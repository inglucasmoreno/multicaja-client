import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  
  public loginForm = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private authService: AuthService,
              private router: Router  
  ) {}

  ngOnInit(): void {}

  login(): void {
    // Verificacion - Datos de acceso
    const { usuario, password } = this.loginForm.value;      
    if(usuario.trim() === '' || password.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }  
    this.alertService.loading();
    this.authService.login(this.loginForm.value).subscribe(()=> {
      this.alertService.close();     
      this.router.navigateByUrl('dashboard/home');
    },({error}) => {
      this.loginForm.setValue({ usuario: '', password: '' }); 
      this.alertService.close();     
      this.alertService.errorApi(error.msg);  
    });
  }

}
