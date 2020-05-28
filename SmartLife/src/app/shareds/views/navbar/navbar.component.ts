import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Auth1Service } from '../../services/auth1.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(private appService: AppService,private authService:Auth1Service,) { }
  isCollapsed = true;
  ngOnInit() {
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
  async Logout(){
    await this.authService.signout();   
}
}
