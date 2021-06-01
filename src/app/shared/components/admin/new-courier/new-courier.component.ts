import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiNotificationsService } from '@taiga-ui/core';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

@Component({
  selector: 'app-new-courier',
  templateUrl: './new-courier.component.html',
  styleUrls: ['./new-courier.component.scss'],
})
export class NewCourierComponent implements OnInit {
  newCourier = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthday: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
  });

  loader = false;

  constructor(
    private geocoderservice: GeocoderService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit() {}

  async addCourier() {
    this.loader = true;
    try {
      await this.geocoderservice.newCourier(this.newCourier.value);
      this.newCourier.reset();
    } catch (e) {
      console.log(e.message);
    }
    this.loader = false;
  }

}
