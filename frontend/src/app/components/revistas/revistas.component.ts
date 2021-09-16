import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BibliografiasService } from 'src/app/services/bibliografias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revistas',
  templateUrl: './revistas.component.html',
  styleUrls: ['./revistas.component.scss']
})
export class RevistasComponent implements OnInit {
  searchForm!: FormGroup;
  revistas!: any;
  coincidencias: any;
  bibliografias: any = [];
  isLoading: boolean = true;
  constructor(
  private formBuilder: FormBuilder,
  private bibliografias_service: BibliografiasService,
  private prestamos_service: PrestamosService) { }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.getRevista();
    this.search();
  }
  search(){
    this.searchForm?.get('search')?.valueChanges.subscribe((data: any) => {
      this.revistas = this.bibliografias;
      let newValues: any = [];
      let a: RegExp = new RegExp(`${data}`, 'gi')
      this.revistas.map((book:any) => {
        if(a.test(book.title)){
          newValues.push(book);
          this.coincidencias = newValues.length;
          this.revistas = newValues;
        }
      })
      if(data === ''){
        this.coincidencias = false;
      }
    })

  }
  getRevista(){
    this.bibliografias_service.getBibliografias().subscribe((data: any) => {
      data.body.map((revista: any) => {
        if (revista.rol == "REVISTA"){
            this.bibliografias.push(revista);          
        }
      })
      this.revistas = this.bibliografias
      this.isLoading = false;
    }, error => {
        Swal.fire({   
          icon: 'error',  
          title: 'Error al obtener las revistas, Intenta mas tarde',  
          showConfirmButton: false,  
          timer: 2500  
        })  
      })
  }
  prestarRevista(id: string){
    this.prestamos_service.prestarBibliografia(id).subscribe(prestamos => {
      Swal.fire({   
        icon: 'success',  
        title: 'Has prestado la revista correctamente, consulta tus prestamos <a href="/devoluciones">Aqui<a/>',  
        showConfirmButton: false,  
        timer: 1500  
      })  
      this.bibliografias = [];
      this.getRevista()
    }, error => {
      Swal.fire({   
        icon: 'error',  
        title: 'Lo lamentamos ya tienes 10 prestamos en tu cuenta',  
        showConfirmButton: false,  
        timer: 2500  
      })
    })
  }
}
