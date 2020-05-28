import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-remote-device',
  templateUrl: './remote-device.component.html',
  styleUrls: ['./remote-device.component.css']
})
export class RemoteDeviceComponent implements OnInit {
  @Input() zIndex: number = 2000;
  constructor() { }

  ngOnInit(): void {
  }

}
