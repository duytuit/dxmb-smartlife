import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { Toast } from '../models/toast.interface';

@Component({
  selector: 'app-toaster-container',
  templateUrl: './toaster-container.component.html',
  styleUrls: ['./toaster-container.component.css']
})
export class ToasterContainerComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(private toaster: ToasterService) {}

  ngOnInit() {
    this.toaster.toast$
  .subscribe(toast => {
    this.toasts = [toast,...this.toasts];
    setTimeout(() => this.toasts.pop(), toast.delay || 6000);
  });
  }
  remove(index: number) {
   this.toasts = this.toasts.filter((v, i) => i !== index);
   // this.toasts.splice(index, 1);
  }

}
