import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formularioLogin!: FormGroup;
  constructor(
    private formBuilder: FormBuilder, 
    private loginService: LoginService,
    private globalService: GlobalService,
    private router: Router) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.formularioLogin = this.formBuilder.group({
      userName: [''],
      password: ['']
    })
  }
  login(){
    let formValue = this.formularioLogin.value;
    console.log(formValue);
    this.loginService.login(formValue).subscribe((data: any) => {
      this.globalService.setToken(data.body);
      this.getIdentity()
    }, error => {
      if(error.status === 404){
        Swal.fire({  
          icon: 'error',  
          title: 'Oops...',  
          text: 'Nuestro sistema no reconoce este usuario, porfavor contacta el administrador para registrarte',  
          footer: 'Biblioteca 2021'
        })  
      } else if(error.status === 500){
        Swal.fire({  
          icon: 'error',  
          title: 'Estas a un paso',  
          text: 'Tu contraseña no coincide, Intenta de nuevo',  
          footer: 'Biblioteca 2021'  
        })  
      }
    })
  }
  getIdentity(){
    this.loginService.getIdentity().subscribe((data: any) => {
      this.globalService.setIdentity(data.body);
      Swal.fire({   
        icon: 'success',  
        title: 'Te has logueado satisfactoriamente',  
        showConfirmButton: false,  
        timer: 1500  
      })  
      if(data.body.rol === 'ADMIN'){
        this.router.navigate(['/admin'])
      }else if (data.body.rol === 'ESTUDIANTE'){
        this.router.navigate(['/home'])
      }else if (data.body.rol === 'BIBLIOTECARIO'){
        this.router.navigate(['/admin'])
      }
    })
  }
}
