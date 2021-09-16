import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BibliografiasService } from 'src/app/services/bibliografias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  searchForm!: FormGroup;
  prestamos: Array<any> = [];
  results: Array<any> = [];
  isLoading: boolean = true;
  biblioNotFound: boolean = false;


  constructor(private formBuilder: FormBuilder,
  private prestamos_service: PrestamosService,
  private bibliografias_service: BibliografiasService) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.search();
    this.getPrestamos()
  }
  search(){
    this.searchForm.get('search')?.valueChanges.subscribe(data => {
      this.bibliografias_service.searchBibliografia(data).subscribe((biblio: any) => {
        this.results = [biblio.body]
        this.isLoading = false;
      })
    }, e => {
      console.log(e.error);
    })
  }
  getPrestamos(){
    this.prestamos_service.obtenerPrestamos().subscribe((prestamos: any) => {
      this.prestamos = prestamos.body;
      console.log(this.prestamos);
      
    })
  }
}
