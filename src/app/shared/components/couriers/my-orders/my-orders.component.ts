import { Component, OnInit } from '@angular/core';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  orders;
  loading = false;
  constructor(private geocoderservice: GeocoderService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.orders = await this.geocoderservice.allCourierOrders({
        id: localStorage['id'],
      });
    } catch (e) {
      console.log(e.message);
    }
    this.loading = false;
  }

  async changeStatus(status, id) {
    try {
      await this.geocoderservice.changeStatus({
        id: id,
        status: status,
      });
      let index = this.orders.findIndex((el) => (el.id = id));
      this.orders[index].status = status;
    } catch (e) {
      console.log(e.message);
    }
  }
}
