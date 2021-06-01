import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiRootModule,
  TuiSvgModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AngularYandexMapsModule,
  YaConfig,
  YA_CONFIG,
} from 'angular8-yandex-maps';
import { MainPageComponent } from './shared/components/user/main-page/main-page.component';
import { LoginPageComponent } from './shared/components/user/login-page/login-page.component';
import { AccountPageComponent } from './shared/components/user/account-page/account-page.component';
import {
  TuiAccordionModule,
  TuiCheckboxBlockModule,
  TuiCheckboxLabeledModule,
  TuiFieldErrorModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiMarkerIconModule,
  TuiStepperModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { NewOrderComponent } from './shared/user/new-order/new-order.component';
import {
  TuiInputCardModule,
  TuiInputCVCModule,
  TuiInputExpireModule,
  TuiMoneyModule,
} from '@taiga-ui/addon-commerce';
import { CheckStatusComponent } from './shared/components/tools/check-status/check-status.component';
import { TuiPortalHostModule } from '@taiga-ui/cdk';
import { AdminPageComponent } from './shared/components/admin/admin-page/admin-page.component';
import { AllOrdersComponent } from './shared/components/admin/all-orders/all-orders.component';
import { SearchPipe } from './shared/pipes/search.pipe';
import { NewCourierComponent } from './shared/components/admin/new-courier/new-courier.component';
import { AllCourierComponent } from './shared/components/admin/all-courier/all-courier.component';
import { NewOrdersComponent } from './shared/components/couriers/new-orders/new-orders.component';
import { MyOrdersComponent } from './shared/components/couriers/my-orders/my-orders.component';
import { MainCourierPageComponent } from './shared/components/couriers/main-courier-page/main-courier-page.component';
import { LoginCourierComponent } from './shared/components/couriers/login-courier/login-courier.component';

const mapConfig: YaConfig = {
  apikey: 'ea1646d1-2502-47b0-8738-bd4f2afe3830',
  lang: 'ru_RU',
};

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginPageComponent,
    AccountPageComponent,
    NewOrderComponent,
    CheckStatusComponent,
    AdminPageComponent,
    AllOrdersComponent,
    SearchPipe,
    NewCourierComponent,
    AllCourierComponent,
    NewOrdersComponent,
    MyOrdersComponent,
    MainCourierPageComponent,
    LoginCourierComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    TuiRootModule,
    HttpClientModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    ReactiveFormsModule,
    TuiInputPasswordModule,
    TuiInputPhoneModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiTooltipModule,
    TuiCheckboxLabeledModule,
    TuiCheckboxBlockModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiFieldErrorModule,
    TuiGroupModule,
    TuiHintModule,
    TuiIslandModule,
    TuiMoneyModule,
    TuiInputCardModule,
    TuiInputCVCModule,
    TuiInputExpireModule,
    TuiExpandModule,
    TuiStepperModule,
    TuiPortalHostModule,
    TuiLoaderModule,
    TuiDataListModule,
    TuiMarkerIconModule,
    TuiTabsModule,
    TuiInputDateModule,
    TuiNotificationModule,
    TuiAccordionModule,
    BrowserAnimationsModule,
    TuiInputNumberModule,
  ],
  providers: [
    {
      provide: YA_CONFIG,
      useValue: {
        apikey: 'ea1646d1-2502-47b0-8738-bd4f2afe3830',
        lang: 'ru_RU',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
