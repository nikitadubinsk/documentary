import { Component, Input, OnInit } from '@angular/core';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

interface GeoObjectConstructor {
  feature: ymaps.IGeoObjectFeature;
  options: ymaps.IGeoObjectOptions;
}

@Component({
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['./check-status.component.scss'],
})
export class CheckStatusComponent implements OnInit {
  @Input() isFull;
  @Input() res;
  @Input() isAdmin;
  geoObject;

  constructor(private geocoderservice: GeocoderService) {}

  ngOnInit(): void {
    this.geoObject = {
      feature: {
        geometry: {
          // The "Polyline" geometry type.
          type: 'LineString',
          // Specifying the coordinates of the vertices of the polyline.
          coordinates: [
            [+this.res.senderLongitude, +this.res.senderLatitude],
            [+this.res.recipientLongitude, +this.res.recipientLatitude],
          ],
        },
      },
      options: {
        draggable: false,
        strokeColor: '#526ed3',
        strokeWidth: 5,
      },
    };
  }

  async changeStatus(id) {
    try {
      await this.geocoderservice.changeStatus({
        id: id,
        status: 5,
      });
      this.res.status = 5;
    } catch (e) {
      console.log(e.message);
    }
  }
}
