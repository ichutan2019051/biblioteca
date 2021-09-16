import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Subject } from 'rxjs';
import { BibliografiasService } from 'src/app/services/bibliografias.service';
import { multi } from './data';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReportesService } from 'src/app/services/reportes.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  // Forms
  userGenericForm:  FormGroup
  bibliografiaGenericForm: FormGroup;
  reportesForm : FormGroup;
  // Modify variables
  idInfo: any;
  idUser: any;
  idBiblio: any;
  //Data Tables
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  dtTriggerB: Subject<any> = new Subject<any>();
  dtOptionsB: DataTables.Settings = {};
  // Reportes
  reporteData: Array<any> = [];
  reporteDataGrafica: Array<any> = [];
  isLoadingReportes: boolean = false;
  isNoOptionSelected: boolean = true;
  reporteDataUser: Array<any> = [];
  // Global Info
  identity: any;
  usuarios: any;
  bibliografias: any;
  isRevista: boolean = false;
  isLibro: boolean = false;
  isRevistaForm: boolean = false;
  isLibroForm: boolean = false;
  isReportSelected: boolean = false;
  // Grafics
  multi: any[];
  view: [number, number] = [600, 800];
  single: any[] = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },
  
    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    }
  ];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Normalized Population'
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  constructor(
    private usuarios_service: UsuariosService,
    private bibliografias_service: BibliografiasService,
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private globalService: GlobalService,
    ){
      Object.assign(this, { multi })
    }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      responsive: true,
    };
    this.buildForms();
    this.getUsuarios()
    this.getBibliografias();
    this.listenReportChanges();
    this.identity = this.globalService.getIdentity()
  }
  // Global Methods
  getUsuarios(){
    this.usuarios_service.getUsuarios().subscribe((users: any) => {
      this.usuarios = users.body;
      this.dtTrigger.next();
    })
  }
  getBibliografias(){
    this.bibliografias_service.getBibliografias().subscribe((data: any) => {
      this.bibliografias = data.body
      this.dtTriggerB.next();
    })
  }
  buildForms(){
    this.userGenericForm = this.formBuilder.group({
      id: [''],
      userName: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      rol: ['']
    })
    this.bibliografiaGenericForm = this.formBuilder.group({
      author: [''],
      title: [''],
      edition: [''],
      description: [''],
      keywords: [''],
      theme: [''],
      rol: [''],
      copy: [''],
      available: [''],
      Actual_Frequency: [''],
      Specimens: ['']
    })
    this.reportesForm = this.formBuilder.group({
      tipo: [''],
    })
  }
  resetFormUser(){
    this.userGenericForm.reset();
    this.userGenericForm.markAsUntouched;
    this.userGenericForm.controls.id.disable()
    this.userGenericForm.controls.userName.disable()
    this.userGenericForm.controls.firstName.enable()
    this.userGenericForm.controls.lastName.enable()
    this.userGenericForm.controls.email.enable()
    this.userGenericForm.controls.rol.enable()
  }
  resetFormBibliografia(){
    this.bibliografiaGenericForm.reset();
    this.bibliografiaGenericForm.markAsUntouched;
    this.bibliografiaGenericForm.controls.author.enable()
    this.bibliografiaGenericForm.controls.title.enable()
    this.bibliografiaGenericForm.controls.edition.enable()
    this.bibliografiaGenericForm.controls.description.enable()
    this.bibliografiaGenericForm.controls.keywords.enable()
    this.bibliografiaGenericForm.controls.theme.enable()
    this.bibliografiaGenericForm.controls.rol.enable()
    this.bibliografiaGenericForm.controls.copy.enable()
    this.bibliografiaGenericForm.controls.available.enable()
    this.bibliografiaGenericForm.controls.Actual_Frequency.enable()
    this.bibliografiaGenericForm.controls.Specimens.enable()
  }
  // User Methods
  crearUsuario(){
    let value = this.userGenericForm.value;
    this.usuarios_service.crearUsuario(value).subscribe((data: any) => {
      this.usuarios.push(data.body);
      Swal.fire({   
        icon: 'success',  
        title: 'Usuario creado correctamente',  
        showConfirmButton: false,  
        timer: 1500  
      })
      this.userGenericForm.reset();
      this.userGenericForm.markAsUntouched;  
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al crear el usuario',  
        showConfirmButton: false,  
        timer: 1500  
      })
    });
  }
  obtenerUsuario(id: any, isUpdate?: boolean){
    if(!isUpdate){
        this.userGenericForm.controls.id.disable()
        this.userGenericForm.controls.userName.disable()
        this.userGenericForm.controls.firstName.disable()
        this.userGenericForm.controls.lastName.disable()
        this.userGenericForm.controls.email.disable()
        this.userGenericForm.controls.rol.disable()
    }
    this.usuarios_service.getUsuario(id).subscribe((data: any) => {
      this.userGenericForm.controls.id.setValue(data.body.id)
      this.userGenericForm.controls.userName.setValue(data.body.userName)
      this.userGenericForm.controls.firstName.setValue(data.body.firstName)
      this.userGenericForm.controls.lastName.setValue(data.body.lastName)
      this.userGenericForm.controls.email.setValue(data.body.email)
      this.userGenericForm.controls.rol.setValue(data.body.rol)
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al obtener el usuario',  
        showConfirmButton: false,  
        timer: 1500  
      }) 
    })
  }
  editarUsuario(id: any){
    let body = this.userGenericForm.value;
    this.usuarios_service.editarUsuario(id, body).subscribe((data: any) => {
      let indexOfUser = this.usuarios.findIndex((el: any) => el._id === id);
      this.usuarios.splice(indexOfUser, 1)
      this.usuarios.push(data.body.usuarioModificado)
      Swal.fire({   
        icon: 'success',  
        title: 'Usuario actualizado correctamente',  
        showConfirmButton: false,  
        timer: 1500  
      })
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al actualizar el usuario',  
        showConfirmButton: false,  
        timer: 1500  
      })
    })
  }
  eliminarUsuario(id: any){
    this.usuarios_service.eliminarUsuario(id).subscribe(data => {
      let indexOfUser = this.usuarios.findIndex((el: any) => el._id === id);
      this.usuarios.splice(indexOfUser, 1)
      Swal.fire({   
        icon: 'success',  
        title: 'Usuario eliminado correctamente',  
        showConfirmButton: false,  
        timer: 1500  
      })
    }, error => {
      Swal.fire({   
        icon: 'error',  
        title: 'Error al eliminar el usuario',  
        showConfirmButton: false,  
        timer: 1500  
      })
    })
  }  
  enableUserField(){
    this.userGenericForm.controls.userName.enable()
    this.userGenericForm.controls.id.enable()
  }
  // Biblio Methods
  crearBibliografia(){
    let value = this.bibliografiaGenericForm.value;
    this.bibliografias_service.crearBibliografia(value).subscribe((data: any) => {
      this.bibliografias.push(data.body);
      Swal.fire({   
        icon: 'success',  
        title: 'Bibliografia creada correctamente',  
        showConfirmButton: false,  
        timer: 1500  
      })
      this.bibliografiaGenericForm.reset();
      this.bibliografiaGenericForm.markAsUntouched;  
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al crear la bibliografia',  
        showConfirmButton: false,  
        timer: 1500  
      })
    });
  }
  obtenerBibliografia(id: any, isUpdate?: boolean){
    if(!isUpdate){
      this.bibliografiaGenericForm.controls.author.disable()
      this.bibliografiaGenericForm.controls.title.disable()
      this.bibliografiaGenericForm.controls.edition.disable()
      this.bibliografiaGenericForm.controls.description.disable()
      this.bibliografiaGenericForm.controls.keywords.disable()
      this.bibliografiaGenericForm.controls.theme.disable()
      this.bibliografiaGenericForm.controls.rol.disable()
      this.bibliografiaGenericForm.controls.copy.disable()
      this.bibliografiaGenericForm.controls.available.disable()
      this.bibliografiaGenericForm.controls.Actual_Frequency.disable()
      this.bibliografiaGenericForm.controls.Specimens.disable()
    }
    this.bibliografias_service.getBibliografia(id).subscribe((data: any) => {
      if(data.body.rol == "LIBRO"){
        this.isLibro = true;
        this.isRevista = false;
      }else{
        this.isLibro = false;
        this.isRevista = true;
      }
      this.bibliografiaGenericForm.controls.author.setValue(data.body.author)
      this.bibliografiaGenericForm.controls.title.setValue(data.body.title)
      this.bibliografiaGenericForm.controls.edition.setValue(data.body.edition)
      this.bibliografiaGenericForm.controls.description.setValue(data.body.description)
      this.bibliografiaGenericForm.controls.keywords.setValue(data.body.keywords)
      this.bibliografiaGenericForm.controls.theme.setValue(data.body.theme)
      this.bibliografiaGenericForm.controls.rol.setValue(data.body.rol)
      this.bibliografiaGenericForm.controls.copy.setValue(data.body.copy)
      this.bibliografiaGenericForm.controls.available.setValue(data.body.available)
      this.bibliografiaGenericForm.controls.Actual_Frequency.setValue(data.body.Actual_Frequency)
      this.bibliografiaGenericForm.controls.Specimens.setValue(data.body.Specimens)
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al obtener el usuario',  
        showConfirmButton: false,  
        timer: 1500  
      }) 
    })
  }
  editarBibliografia(id: any){
    let body = this.bibliografiaGenericForm.value;
    this.bibliografias_service.updateBibliografia(id, body).subscribe((data: any) => {
      let indexOfUser = this.usuarios.findIndex((el: any) => el._id === id);
      this.bibliografias.splice(indexOfUser, 1)
      this.bibliografias.push(data.body)
      Swal.fire({   
        icon: 'success',  
        title: 'Bibliografia actualizada correctamente',  
        showConfirmButton: false,  
        timer: 1500  
      })
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al actualizar la bibliografia',  
        showConfirmButton: false,  
        timer: 1500  
      })
    })
  }
  eliminarBiblio(id: any){
    this.bibliografias_service.eliminarBibliografia(id).subscribe(data => {
      let indexOfUser = this.bibliografias.findIndex((el: any) => el._id === id);
      this.bibliografias.splice(indexOfUser, 1)
      Swal.fire({   
        icon: 'success',  
        title: 'Bibliografia eliminada correctamente',  
        showConfirmButton: false,  
        timer: 1500  
      })
    }, error => {
      console.error(error);
      Swal.fire({   
        icon: 'error',  
        title: 'Error al eliminar la bibliografia',  
        showConfirmButton: false,  
        timer: 1500  
      })
    })
  }
  catchInformacion(id:any, typeAction:any){
    switch (typeAction) {
      case 'visualizar':
        this.obtenerUsuario(id)
        break;
      case 'modificar':
        this.idInfo = id;
        this.obtenerUsuario(id, true)
        break;
      case 'eliminar':
          this.idInfo = id;
        break
      case 'agregar':

        break
      default:
        break;
    }
  } 
  catchInformacionBibliografia(id:any, typeAction:any){
    switch (typeAction) {
      case 'visualizar':
        this.obtenerBibliografia(id)
        break;
      case 'modificar':
        this.idInfo = id;
        this.listenFormChanges()
        this.obtenerBibliografia(id, true)
        break;
      case 'eliminar':
          this.idBiblio = id;
        break
      case 'agregar':
        break
      default:
        break;
    }
  } 
  listenFormChanges(){
    this.bibliografiaGenericForm.get('rol')?.valueChanges.subscribe(data => {
      if(data == 'LIBRO'){
        this.isLibroForm = true;
        this.isRevistaForm = false;
      }else{
        this.isRevistaForm = true;
        this.isLibroForm = false;
      }
    })
  }
  // Report Methods
  listenReportChanges(){
    this.reportesForm.get('tipo')?.valueChanges.subscribe(type => {
      this.isNoOptionSelected = false;
      this.reporteData = [];
      this.reporteDataGrafica = [];
      this.isLoadingReportes = true;
      this.reporteDataUser = [];
      switch (type.toString()) {
        case "Usuarios que más bibliografías han prestado.":
          this.reportesService.usuarioConMasPrestamos().subscribe((data: any) => {
            this.reporteDataUser = data.body;
            data.body.map((user:any) => {
              let newData = {
                "name": user._id[0].firstName,
                "series": [
                  {
                    "name": user._id[0].firstName,
                    "value": user.count
                  }
                ]
              }
              this.reporteDataGrafica.push(newData);
            })
            this.isLoadingReportes = false;
          }, error => {
            this.isLoadingReportes = false;
            Swal.fire({   
              icon: 'error',  
              title: 'Error al obtener la informacion',  
              showConfirmButton: false,  
              timer: 1500  
            })
          })
          break;
        case "Libros más prestados.":
          this.reportesService.bibliografiasMasPrestadas('libro').subscribe((data: any) => {
            this.reporteData = data.body;
            data.body.map((book:any) => {
              let newData = {
                "name": book.title,
                "series": [
                  {
                    "name": book.title,
                    "value": book.cant_lend
                  }
                ]
              }
              this.reporteDataGrafica.push(newData);
            })
            this.isLoadingReportes = false;
          }, error => {
            this.isLoadingReportes = false;
          })
          break;
        case "Revistas más prestadas.":
          this.reportesService.bibliografiasMasPrestadas('revista').subscribe((data: any) => {
            this.reporteData = data.body;
            data.body.map((revista:any) => {
              let newData = {
                "name": revista.title,
                "series": [
                  {
                    "name": revista.title,
                    "value": revista.cant_lend
                  }
                ]
              }
              this.reporteDataGrafica.push(newData);
            })

            this.isLoadingReportes = false;
          }, error => {
            Swal.fire({   
              icon: 'error',  
              title: 'Error al obtener la informacion',  
              showConfirmButton: false,  
              timer: 1500  
            })
            this.isLoadingReportes = false;
          })
          break;
        case "Libros más buscados.":
          this.reportesService.bibliografiasMasBuscadas('libro').subscribe((data: any) => {
            this.reporteData = data.body;
            data.body.map((book:any) => {
              let newData = {
                "name": book.title,
                "series": [
                  {
                    "name": book.title,
                    "value": book.cant_searches
                  }
                ]
              }
              this.reporteDataGrafica.push(newData);
            })
            this.isLoadingReportes = false;
          }, error => {
            Swal.fire({   
              icon: 'error',  
              title: 'Error al obtener la informacion',  
              showConfirmButton: false,  
              timer: 1500  
            })
            this.isLoadingReportes = false;
          })
          break;
        case "Revistas más buscadas.":
          this.reportesService.bibliografiasMasBuscadas('revista').subscribe((data: any) => {
            this.reporteData = data.body;
            data.body.map((revista:any) => {
              let newData = {
                "name": revista.title,
                "series": [
                  {
                    "name": revista.title,
                    "value": revista.cant_searches
                  }
                ]
              }
              this.reporteDataGrafica.push(newData);
            })
            this.isLoadingReportes = false;
          }, error => {
            Swal.fire({   
              icon: 'error',  
              title: 'Error al obtener la informacion',  
              showConfirmButton: false,  
              timer: 1500  
            })
            this.isLoadingReportes = false;
          })
          break;
        default:
          
          break;
      }
    });
  }




  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
