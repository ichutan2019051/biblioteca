import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { BooksComponent } from './components/books/books.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component';
import { RevistasComponent } from './components/revistas/revistas.component';
import { UserComponent } from './components/user/user.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'home',
    component: UserComponent 
  },
  {
    path: 'admin',
    component: AdminComponent 
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'libros',
    component: BooksComponent
  },
  {
    path: 'revistas',
    component: RevistasComponent
  },
  {
    path: 'devoluciones',
    component: DevolucionesComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
