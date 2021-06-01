import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './shared/components/admin/admin-page/admin-page.component';
import { AllCourierComponent } from './shared/components/admin/all-courier/all-courier.component';
import { AllOrdersComponent } from './shared/components/admin/all-orders/all-orders.component';
import { NewCourierComponent } from './shared/components/admin/new-courier/new-courier.component';
import { LoginCourierComponent } from './shared/components/couriers/login-courier/login-courier.component';
import { MainCourierPageComponent } from './shared/components/couriers/main-courier-page/main-courier-page.component';
import { MyOrdersComponent } from './shared/components/couriers/my-orders/my-orders.component';
import { NewOrdersComponent } from './shared/components/couriers/new-orders/new-orders.component';
import { LoginPageComponent } from './shared/components/user/login-page/login-page.component';
import { MainPageComponent } from './shared/components/user/main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: LoginCourierComponent },
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: AdminPageComponent,
        children: [
          { path: '', component: AllOrdersComponent },
          { path: 'new-courier', component: NewCourierComponent },
          { path: 'couriers', component: AllCourierComponent },
        ],
      },
    ],
  },
  {
    path: 'courier',
    children: [
      {
        path: '',
        component: MainCourierPageComponent,
        children: [
          { path: '', component: MyOrdersComponent },
          { path: 'new-orders', component: NewOrdersComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
