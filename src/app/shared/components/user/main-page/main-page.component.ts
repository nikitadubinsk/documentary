import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(private geocoderservice: GeocoderService) {}

  ngOnInit(): void {}

  newOrder = new FormGroup({
    senderName: new FormControl('', Validators.required),
    senderTelephone: new FormControl('', Validators.required),
    senderAddress: new FormControl('', Validators.required),
    senderEmail: new FormControl('', [Validators.required, Validators.email]),
    recipientName: new FormControl('', Validators.required),
    recipientTelephone: new FormControl('', Validators.required),
    recipientAddress: new FormControl('', Validators.required),
    personalData: new FormControl(false, [
      Validators.required,
      Validators.requiredTrue,
    ]),
    cardNumber: new FormControl(''),
    cardDate: new FormControl(''),
    CVVcode: new FormControl(''),
    password: new FormControl(''),
  });

  expanded = false;
  numberOrder = '';
  priceOrder = 0;
  order = {
    sender: {
      latitude: 0,
      longitude: 0,
      name: 'Отсутствует',
      telephone: 'Отсутствует',
      address: 'отсутствует',
      email: 'Отсутствует',
    },
    recipient: {
      latitude: 0,
      longitude: 0,
      name: 'Отсутствует',
      telephone: 'Отсутствует',
      address: 'отсутствует',
    },
    password: '',
    date: new Date(),
  };

  isPrice = false;

  passwordOdrder = '';
  newPasswordOdrder = '';
  ans;

  cl1;
  cl2;
  sl1;
  sl2;
  delta;
  cdelta;
  sdelta;
  y;
  x;
  ad;

  calculateTheDistance(lat1, long1, lat2, long2) {
    this.cl1 = Math.cos((lat1 * Math.PI) / 180);
    this.cl2 = Math.cos((lat2 * Math.PI) / 180);
    this.sl1 = Math.sin((lat1 * Math.PI) / 180);
    this.sl2 = Math.sin((lat2 * Math.PI) / 180);
    this.delta = (long2 * Math.PI) / 180 - (long1 * Math.PI) / 180;
    this.cdelta = Math.cos(this.delta);
    this.sdelta = Math.sin(this.delta);

    this.y = Math.sqrt(
      Math.pow(this.cl2 * this.sdelta, 2) +
        Math.pow(this.cl1 * this.sl2 - this.sl1 * this.cl2 * this.cdelta, 2)
    );
    this.x = this.sl1 * this.sl2 + this.cl1 * this.cl2 * this.cdelta;

    this.ad = Math.atan2(this.y, this.x);
    return Math.round(this.ad * 6372795);
  }

  async calculateCost() {
    this.loading = true;
    try {
      let res = await this.geocoderservice.geocoding(
        this.newOrder.value.senderAddress
      );
      this.order.sender.latitude =
        Object.values(
          res
        )[0].GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
          ' '
        )[0];
      this.order.sender.longitude =
        Object.values(
          res
        )[0].GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
          ' '
        )[1];
      let res1 = await this.geocoderservice.geocoding(
        this.newOrder.value.recipientAddress
      );
      this.order.recipient.latitude =
        Object.values(
          res1
        )[0].GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
          ' '
        )[0];
      this.order.recipient.longitude =
        Object.values(
          res1
        )[0].GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
          ' '
        )[1];
      let distance = this.calculateTheDistance(
        this.order.sender.latitude,
        this.order.sender.longitude,
        this.order.recipient.latitude,
        this.order.recipient.longitude
      );
      this.geoObject = {
        feature: {
          geometry: {
            // The "Polyline" geometry type.
            type: 'LineString',
            // Specifying the coordinates of the vertices of the polyline.
            coordinates: [
              [+this.order.sender.longitude, +this.order.sender.latitude],
              [+this.order.recipient.longitude, +this.order.recipient.latitude],
            ],
          },
        },
        options: {
          draggable: false,
          strokeColor: '#526ed3',
          strokeWidth: 5,
        },
      };

      this.isPrice = true;
      this.priceOrder = +(150 + distance / 100).toFixed(2);
      this.loading = false;
    } catch (e) {}
  }

  async toggle() {
    if (!this.expanded) {
      try {
        this.newPasswordOdrder = this.passwordOdrder;
        this.loading = true;
        this.ans = await this.geocoderservice.findOrder({
          id: this.numberOrder,
          password: this.newPasswordOdrder,
        });
        console.log(this.ans);
        this.expanded = !this.expanded;
      } catch (e) {}
      this.loading = true;
    } else {
      this.expanded = !this.expanded;
    }
    this.loading = false;
  }

  res2;
  isError = false;
  isOpenNewOrder = true;
  loading = false;
  geoObject;

  async createOrder() {
    this.loading = true;
    try {
      this.order.sender.name = this.newOrder.value.senderName;
      this.order.sender.telephone = this.newOrder.value.senderTelephone;
      this.order.sender.address = this.newOrder.value.senderAddress;
      this.order.sender.email = this.newOrder.value.senderEmail;
      this.order.recipient.name = this.newOrder.value.recipientName;
      this.order.recipient.telephone = this.newOrder.value.recipientTelephone;
      this.order.recipient.address = this.newOrder.value.recipientAddress;
      this.order.password = this.newOrder.value.password;
      this.res2 = await this.geocoderservice.newOrder(this.order);
      this.newOrder.reset();
      this.priceOrder = 0;
      this.isOpenNewOrder = false;
      this.isPrice = false;
    } catch (e) {
      this.isError = true;
      this.isOpenNewOrder = false;
      console.log(e);
    }
    this.loading = false;
  }

  startNewOrder() {
    this.res2 = null;
    this.isError = false;
    this.isOpenNewOrder = true;
  }
}
