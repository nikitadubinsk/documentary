import { Component, OnInit } from '@angular/core';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss'],
})
export class NewOrdersComponent implements OnInit {
  orders;
  loading = false;

  constructor(private geocoderservice: GeocoderService) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.orders = await this.geocoderservice.newOrdersCourier();
    } catch (e) {
      console.log(e.message);
    }
    this.loading = false;
  }

  async addOrder(id) {
    try {
      let res = await this.geocoderservice.addCourierInOrder({
        id: id,
        courier: localStorage['id'],
      });
      let index = this.orders.findIndex((el) => el.id === id);
      this.orders.splice(index, 1);
    } catch (e) {
      console.log(e.message);
    }
  }
}
