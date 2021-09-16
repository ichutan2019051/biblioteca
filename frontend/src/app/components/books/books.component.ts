import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BibliografiasService } from 'src/app/services/bibliografias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  searchForm!: FormGroup;
  books!: any;
  bibliografias: any = [];
  coincidencias: any;
  isLoading: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private bibliografias_service: BibliografiasService,
    private prestamos_service: PrestamosService) { }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.getBooks();
    this.search();
  }
  search(){
    this.searchForm?.get('search')?.valueChanges.subscribe(data => {
      this.books = this.bibliografias;
      let newValues: any = [];
      let a: RegExp = new RegExp(`${data}`, 'gi')
      this.books.map((book:any) => {
        if(a.test(book.title)){
          newValues.push(book);
          this.coincidencias = newValues.length;
          this.books = newValues;
        }
      })
      if(data === ''){
        this.coincidencias = false;
      }
    })
    
  }
  getBooks(){
    this.bibliografias_service.getBibliografias().subscribe((data: any) => {
      data.body.map((book: any) => {
        if (book.rol == "LIBRO"){
            this.bibliografias.push(book);          
        }
      })
      this.books = this.bibliografias
      this.isLoading = false;
    }, error => {
      Swal.fire({   
        icon: 'error',  
        title: 'Error al obtener los libros, Intenta mas tarde',  
        showConfirmButton: false,  
        timer: 2500  
      })  
    })
  }
  loanBook(id: any){
    this.prestamos_service.prestarBibliografia(id).subscribe(bookLoan => {
      Swal.fire({   
        icon: 'success',  
        title: 'Has prestado el libro correctamente, consulta tus libros <a href="/devoluciones">Aqui<a/>',  
        showConfirmButton: false,  
        timer: 1500  
      })  
      this.bibliografias = [];
      this.getBooks()
    }, error => {
      console.log(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Lo lamentamos ya tienes 10 prestamos en tu cuenta',  
        showConfirmButton: false,  
        timer: 2500  
      })
    })
  }
}
