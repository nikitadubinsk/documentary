import { Component, OnInit } from '@angular/core';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';
import { clamp } from '@taiga-ui/cdk';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent implements OnInit {
  orders;
  total;
  search = '';
  columns;
  pages;
  sumPage = [];
  currentPage;
  loading = false;

  constructor(private geocoderservice: GeocoderService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.currentPage = 1;
      this.total = await this.geocoderservice.totalOrders();
      this.orders = await this.geocoderservice.allOrders(0);
      this.columns = Object.keys(this.orders[0]);
      this.pages = Math.ceil(this.total.total / 20);
      for (let i = 1; i <= this.pages; i++) {
        this.sumPage.push(i);
      }
      this.loading = false;
    } catch (e) {
      console.log(e.message);
    }
  }

  async newPage(page) {
    if (page === this.currentPage) {
      return;
    }
    try {
      this.loading = true;
      this.orders = await this.geocoderservice.allOrders(page * 20);
      this.columns = Object.keys(this.orders[0]);
    } catch (e) {
      console.log(e.message);
    }
    this.currentPage = page;
    this.loading = false;
    console.log(page, this.currentPage);
  }
}
