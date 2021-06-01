import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GeocoderService } from 'src/app/shared/services/geocoder.service';

@Component({
  selector: 'app-login-courier',
  templateUrl: './login-courier.component.html',
  styleUrls: ['./login-courier.component.scss'],
})
export class LoginCourierComponent implements OnInit {
  autherization = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  newPasswordForm = new FormGroup({
    password1: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    password2: new FormControl(''),
  });

  newPassword = false;
  staff;
  public error$: Subject<string> = new Subject<string>();

  constructor(
    private geocoderservice: GeocoderService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async auth() {
    try {
      if (!this.autherization.value.password) {
        this.staff = await this.geocoderservice.findStaff(
          this.autherization.value
        );
        if (!this.staff[0].password) {
          this.newPassword = true;
        } else {
          this.error$.next('Пароль для данного аккаунта уже задан');
        }
      } else {
        let res = await this.geocoderservice.auth(this.autherization.value);
        console.log(res);
        if (res['isAdmin']) {
          this.router.navigate(['/admin']);
        } else {
          localStorage.setItem('id', res['id']);
          this.router.navigate(['/courier']);
        }
      }
    } catch (e) {
      this.error$.next(e.error.message);
    }
  }

  async createNewPassword() {
    try {
      await this.geocoderservice.addPassword({
        id: this.staff[0].id,
        password: this.newPasswordForm.value.password1,
      });
      this.router.navigate(['/courier']);
    } catch (e) {
      this.error$.next(e.error.message);
    }
  }
}
