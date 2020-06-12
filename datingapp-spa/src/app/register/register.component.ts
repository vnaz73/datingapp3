import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

 user: User;
 registerForm: FormGroup;
 bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authService: AuthService,
              private route: Router,
              private alertify: AlertifyService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    },
    this.createRegisterFrom();
  }
  createRegisterFrom() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
     {validator: [this.passwordMatchValidator]});


  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }
  register() {

    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('register success');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
            this.route.navigate(['/members']);
        });
      });

    }


  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('canceling');
  }
}
