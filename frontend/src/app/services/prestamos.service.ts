import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  customHeaders = new HttpHeaders().set('Content-Type', 'application/json')
  API = environment.api
  constructor(private globalService: GlobalService, private httpClient: HttpClient) { }


  prestarBibliografia(id_bibliography: any){
    let body = {"id_bibliography": id_bibliography}
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.post(`${this.API}loan/create`,body,{headers: authHeaders})
  }
  obtenerPrestamos(){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}loan/meLoan`,{headers: authHeaders})  
  }
  devolverPrestamo(id: any){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.put(`${this.API}loan/updateLoan/${id}`,{},{headers: authHeaders})  
  }
}
