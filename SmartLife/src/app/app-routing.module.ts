import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shareds/views/home/home.component';
import { RemoteDeviceComponent } from './components/remote-device/remote-device.component';
import { WelcomeComponent } from './shareds/views/account/welcome/welcome.component';
import { AuthGuard } from './shareds/core/authentication/auth.guard';


const routes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
 { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
