import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MqttDeviveService } from '../../services/mqtt-devive.service';
import { userHub } from '../../models/user-hub';
import { ToasterService } from '../../services/toaster.service';
import { devicemqtt } from '../../models/device.mqtt';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Auth1Service } from '../../services/auth1.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() zIndex: number = 2000;
  GetAllUserHub:userHub[]
  GetAllDevice:devicemqtt[]
  FGetAllDevice:devicemqtt[]
  SelectDevice
  selectdevice= new devicemqtt()
  private userid= sessionStorage.getItem('userid')
  private username= sessionStorage.getItem('username')
  @ViewChild('ChangeHubCode', {static: false}) ChangeHubCode: ElementRef;
  @ViewChild('statusSaveDevice', {static: false}) statusSaveDevice: ElementRef;
  @ViewChild('onDeletebevice', {static: false}) onDeletebevice: ElementRef;
  checkshowSpinner:boolean=false

  addDevice = new FormGroup(
    {
     // Id :new FormControl(),
      name_device :new FormControl(),
      code_device :new FormControl(),
      device_type :new FormControl(),
      number_switch :new FormControl(),
      hubid :new FormControl(),
      hub_code:new FormControl(),
      hub_password_client:new FormControl(),
      hub_room_name:new FormControl(),
      icon:new FormControl(),
      note:new FormControl(),
      status :new FormControl(true),
      userid_by :new FormControl(),
      created_by :new FormControl(),
      status_device:new FormControl(),
    }
  );

  
  constructor(
    private appService: AppService,
    public _mqttDeviveService: MqttDeviveService,
    private _toaster: ToasterService,
    ) { }
  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
  ngOnInit() {
        this._mqttDeviveService.showSpinner.next(true)
        this._toaster.subject.next(null)
        this.getAlluserhub(this.userid)
  }
  getAlluserhub(userid:string) {
    this._mqttDeviveService.GetUserHub(userid).subscribe(data => {
      this.GetAllUserHub = data
      this.ChangeHubCode.nativeElement.value=this.GetAllUserHub[0].hubid
      this.SelectDevice=this.GetAllUserHub[0]
      this.getAllDeviceByHub(this.GetAllUserHub[0].hubid)
    
    });
   
  }
  getAllDeviceByHub(hubid:string) {
    this._mqttDeviveService.GetDeviceMqtt(hubid).subscribe(data => {
      this.GetAllDevice = data
      this.FGetAllDevice= this.GetAllDevice
    });
  }
  onEventHubCode(hubid:string){
      this._mqttDeviveService.showSpinner.next(true)
      this.getAllDeviceByHub(hubid)
       this.SelectDevice=this.GetAllUserHub.filter(x=>x.hubid==hubid)[0]
  }
  _FilterDevice: string;
  get FilterDevice(): string {
    return this._FilterDevice;
  }
  set FilterDevice(value: string) {
    this._FilterDevice = value;
    this.FGetAllDevice = this.FilterDevice ? this.PerformFilter(this.FilterDevice) : this.GetAllDevice;
  }
  PerformFilter(filterBy: string): devicemqtt[] {
    filterBy = filterBy.toLowerCase();
    return this.GetAllDevice.filter((device: devicemqtt) =>
    device.name_device.toLowerCase().indexOf(filterBy) !== -1);
  }
  onSubmitDevice(){
    this.statusSaveDevice.nativeElement.disabled=true;
    if (this.selectdevice.edittable==true) 
    {
      this.selectdevice.name_device= this.addDevice.controls['name_device'].value;
      this.selectdevice.icon= this.addDevice.controls['icon'].value;
      this.selectdevice.note= this.addDevice.controls['note'].value;
      this.selectdevice.status= this.addDevice.controls['status'].value;
      this.selectdevice.userid_by=this.userid
      this.selectdevice.created_by=this.username
      this._mqttDeviveService.UpdateDeviceMqtt(this.selectdevice).subscribe(data=>{
        this.getAllDeviceByHub(this.SelectDevice.hubid)
        this._toaster.show('success', 'Sửa Thiết Bị!','Thành Công');
        let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
        element.click();
      }); 
    }else{
      this.addDevice.controls['hubid'].reset(this.SelectDevice.hubid);
      this.addDevice.controls['hub_code'].reset(this.SelectDevice.hub_code);
      this.addDevice.controls['hub_password_client'].reset(this.SelectDevice.hub_password_client);
      this.addDevice.controls['hub_room_name'].reset(this.SelectDevice.note);
      this.addDevice.controls['userid_by'].reset(this.userid);
      this.addDevice.controls['created_by'].reset(this.username);
      this._mqttDeviveService.AddDeviceMqtt(this.addDevice.value).subscribe(data=>{
        this.addDevice.reset();
        this.getAllDeviceByHub(this.SelectDevice.hubid)
        this._toaster.show('success', 'Thêm Thiết Bị!','Thành Công');
        let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
        element.click();
      }); 
    }
  }
  refreshDevice(){
    
  }
  openDeleteDevice(item: devicemqtt){
    this.selectdevice=item
    this.onDeletebevice.nativeElement.disabled=false
    let element: HTMLElement = document.getElementById('modalDelete') as HTMLElement;
    element.click();
  }
  onDeleteDevice(id:string)
  {
    if(id)
    {
      this.onDeletebevice.nativeElement.disabled=true
      this._mqttDeviveService.DeleteDeviceMqtt(id).subscribe(data=>{
        this.getAllDeviceByHub(this.SelectDevice.hubid)
        this._toaster.show('success', 'Xóa Thiết Bị!','Thành Công');
        let element: HTMLElement = document.getElementById('modalDeleteHide') as HTMLElement;
        element.click();
      }); 
       
    }
  }
  openEditDevice(item: devicemqtt){
    this.statusSaveDevice.nativeElement.disabled=false;
    this.selectdevice=item;
    this.selectdevice.edittable=true
    this.addDevice.controls['name_device'].reset(item.name_device);
    this.addDevice.controls['code_device'].reset(item.code_device);
    this.addDevice.controls['device_type'].reset(item.device_type);
    this.addDevice.controls['number_switch'].reset(item.number_switch);
    this.addDevice.controls['hubid'].reset(item.hubid);
    this.addDevice.controls['hub_password_client'].reset(item.hub_password_client);
    this.addDevice.controls['hub_room_name'].reset(item.hub_room_name);
    this.addDevice.controls['hub_code'].reset(item.hub_code);
    this.addDevice.controls['icon'].reset(item.icon);
    this.addDevice.controls['note'].reset(item.note);
    this.addDevice.controls['status'].reset(item.status);
    this.addDevice.controls['userid_by'].reset(item.userid_by);
    let element: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
    element.click();
  }
  openmodaladdDevice()
  {
    this.statusSaveDevice.nativeElement.disabled=false;
    this.addDevice.reset()
    this.selectdevice = new devicemqtt()
    let element: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
    element.click();
  }
}
