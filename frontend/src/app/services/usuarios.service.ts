import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  customHeaders = new HttpHeaders().set('Content-Type', 'application/json')
  API = environment.api
  constructor(private globalService: GlobalService, private httpClient: HttpClient) { }

  crearUsuario(data: any){
    let body = JSON.stringify(data)
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.post(`${this.API}user/crearUsers`,body,{headers: authHeaders})
  }
  getUsuarios(){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}user/allUsers`,{headers: authHeaders})
  }
  getUsuario(id: any){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.get(`${this.API}user/oneUser/${id}`,{headers: authHeaders})
  }
  editarUsuario(id: any, data: any){
    let body = JSON.stringify(data)
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.put(`${this.API}user/editUser/${id}`,data,{headers: authHeaders})
  }
  eliminarUsuario(id: any){
    let token = JSON.parse(this.globalService.getToken() || '{}')
    let authHeaders = this.customHeaders.set('Authorization', token) 
    return this.httpClient.delete(`${this.API}user/dropUser/${id}`,{headers: authHeaders})
  }
}
