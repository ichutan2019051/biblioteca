import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BibliografiasService {
  customHeaders = new HttpHeaders().set('Content-Type', 'application/json')
  API = environment.api
  constructor(private globalService: GlobalService, private httpClient: HttpClient) { }

  getBibliografias(){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}library/libraryAll`, {headers: authHeaders})
  }
  getBibliografia(id: any){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}library/oneLibrary/${id}`, {headers: authHeaders})
  }
  searchBibliografia(title: any){
    let body = {title};
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.post(`${this.API}library/findName`,body,{headers: authHeaders})
  }
  crearBibliografia(data: any){
    let body = JSON.stringify(data);
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.post(`${this.API}library/createLibrary`,body,{headers: authHeaders})
  }
  updateBibliografia(id: any, data: any){
    let body = JSON.stringify(data);
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.put(`${this.API}library/editLibrary/${id}`,body,{headers: authHeaders})
  }
  eliminarBibliografia(id: any){
    console.log(id);
    
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.delete(`${this.API}library/dropLibrary/${id}`,{headers: authHeaders})
  }
}
