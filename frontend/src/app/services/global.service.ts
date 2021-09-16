import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private router: Router) { }

  setIdentity(identity: any){
    localStorage.setItem('identity', JSON.stringify(identity))
  }
  getIdentity(){
    if(localStorage.getItem('identity')){
      let info: any = localStorage.getItem('identity');
      return JSON.parse(info)
    }else{
      return false;
    }
  }
  setToken(token: any){
    token = JSON.stringify(token)
    localStorage.setItem('token', token);
  }
  getToken(){
    if(localStorage.getItem('token')){
      return localStorage.getItem('token')
    }else{
      return 'we dont found a token'
    }
  }

  logOut(){
    localStorage.removeItem('identity')
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
