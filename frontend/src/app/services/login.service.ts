import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { GlobalService } from './global.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  customHeaders = new HttpHeaders().set('Content-Type', 'application/json')
  API = environment.api
  constructor(private httpClient: HttpClient, private globalService: GlobalService) { }

  login(user: any){
    let body = JSON.stringify(user);
    return this.httpClient.post(`${this.API}login`, body, {headers: this.customHeaders});
  }
  getIdentity(){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}user/accountDetails`, {headers: authHeaders})
  }
}
