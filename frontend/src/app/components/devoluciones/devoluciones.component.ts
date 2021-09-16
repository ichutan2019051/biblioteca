import { Component, OnInit } from '@angular/core';
import { PrestamosService } from 'src/app/services/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {
  prestamos: Array<any> = [];
  isEmpty: boolean = false;
  isLoading: boolean = true;
  constructor(private prestamos_service: PrestamosService) { }

  ngOnInit(): void {
    this.getPrestamos()
  }

  getPrestamos(){
    this.prestamos_service.obtenerPrestamos().subscribe((pres: any) => {
      pres.body.map((prest: any) => {
        if(!prest.is_returned){
          this.prestamos.push(prest)
        }
      })
      if(this.prestamos.length < 1){
        this.isEmpty = true;
      }
      
      this.isLoading = false;
      console.log(this.prestamos);
    }, error => {
      Swal.fire({   
        icon: 'error',  
        title: 'Error al obtener tus prestamos, Intenta mas tarde',  
        showConfirmButton: false,  
        timer: 2500  
      })  
    })
  }
  devolver(id: any){
    this.prestamos_service.devolverPrestamo(id).subscribe(data => {
      Swal.fire({   
        icon: 'success',  
        title: 'Gracias, Esperamos que esta bibliografia te haya gustado.',  
        showConfirmButton: false,  
        timer: 2500  
      })  
      let indexofPrestamos = this.prestamos.findIndex((el: any) => el._id === id);
      this.prestamos.splice(indexofPrestamos, 1)      
      this.prestamos = [];
      this.getPrestamos()
    }, error => {
      Swal.fire({   
        icon: 'error',  
        title: 'Error al devolver la bibliografia, Intenta mas tarde',  
        showConfirmButton: false,  
        timer: 2500  
      })  
    })
  }

}
