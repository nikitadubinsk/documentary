import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeocoderService {
  constructor(private http: HttpClient) {}

  geocoding(address) {
    return this.http
      .get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=ea1646d1-2502-47b0-8738-bd4f2afe3830&geocode=${address.replace(
          / /g,
          '+'
        )}&format=json&results=1`
      )
      .toPromise();
  }

  newOrder(order) {
    return this.http.post(`${environment.urlApi}/neworder`, order).toPromise();
  }

  findOrder(args) {
    return this.http.post(`${environment.urlApi}/findorder`, args).toPromise();
  }

  allOrders(start) {
    return this.http.get(`${environment.urlApi}/orders/${start}`).toPromise();
  }

  totalOrders() {
    return this.http.get(`${environment.urlApi}/totalOrders`).toPromise();
  }

  couriers() {
    return this.http.get(`${environment.urlApi}/couriers`).toPromise();
  }

  newCourier(user) {
    return this.http.post(`${environment.urlApi}/newcourier`, user).toPromise();
  }

  newOrdersCourier() {
    return this.http.get(`${environment.urlApi}/neworderscourier`).toPromise();
  }

  auth(staff) {
    return this.http.post(`${environment.urlApi}/auth`, staff).toPromise();
  }

  findStaff(staff) {
    return this.http.post(`${environment.urlApi}/findStaff`, staff).toPromise();
  }

  addPassword(staff) {
    return this.http
      .put(`${environment.urlApi}/addPassword`, staff)
      .toPromise();
  }

  addCourierInOrder(arr) {
    return this.http
      .put(`${environment.urlApi}/addCourierInOrder`, arr)
      .toPromise();
  }

  allCourierOrders(id) {
    return this.http
      .post(`${environment.urlApi}/allCourierOrders`, id)
      .toPromise();
  }

  changeStatus(arr) {
    return this.http.put(`${environment.urlApi}/changeStatus`, arr).toPromise();
  }
}
