import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  customHeaders = new HttpHeaders().set('Content-Type', 'application/json')
  API = environment.api
  constructor(private globalService: GlobalService, private httpClient: HttpClient) { }
  
  bibliografiasMasBuscadas(rol: any){
    let body = {rol}
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.post(`${this.API}library/mostSearch`,body,{headers: authHeaders})
  }
  bibliografiasMasPrestadas(rol: any){
    let body = {rol}
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.post(`${this.API}library/mostLend`,body,{headers: authHeaders})
  }
  usuarioConMasPrestamos(){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}loan/mostUser`, {headers: authHeaders})
  }
}
