import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isUserOrAdmin: boolean = false;
  isAdmin: boolean = false;
  identity: any;
  constructor(private router: Router, private globalService: GlobalService) { }

  ngOnInit(): void {
    if(this.router.url != '/'){
      this.isUserOrAdmin = true;
      console.log(this.isUserOrAdmin);
    }
    this.getIdentity();
  }
  getIdentity(){
    this.identity = this.globalService.getIdentity();
  }
  cerrarSesion(){
    this.globalService.logOut()
  }
}
