import { Component, OnInit } from '@angular/core';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

@Component({
  selector: 'app-all-courier',
  templateUrl: './all-courier.component.html',
  styleUrls: ['./all-courier.component.scss'],
})
export class AllCourierComponent implements OnInit {
  loading = false;
  couriers;
  search = '';

  constructor(private geocoderservice: GeocoderService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.couriers = await this.geocoderservice.couriers();
    } catch (e) {
      console.log(e.message);
    }
    this.loading = false;
  }
}
