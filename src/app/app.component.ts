import { Component, Output,Input, EventEmitter,OnInit } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Improtextiles';
  
  // login2 = localStorage.setItem('currentUser', "true");
  login = JSON.parse(localStorage.getItem('currentUser'));
  ModuloUserRRHHVer = JSON.parse(localStorage.getItem('ModuloUserRRHHVer'));
  ModuloUserVer = JSON.parse(localStorage.getItem('ModuloUserVer'));
  ModuloUserClienteVer = JSON.parse(localStorage.getItem('ModuloUserClienteVer'));
  ModuloUserProveedoresVer = JSON.parse(localStorage.getItem('ModuloUserProveedoresVer'));
  ModuloUserFacturacionVer = JSON.parse(localStorage.getItem('ModuloUserFacturacionVer'));
  NombreUsuario = localStorage.getItem('NombreUsuario');
  constructor(public router: Router) {

  }

  ngOnInit() {

    if(this.login == true ||this.login == null){
      this.login =true;
      this.router.navigate(['/login']);
      console.log("tienes que logiarse");
    }else{
      this.router.navigate(['/home']);
    }
    console.log(this.ModuloUserProveedoresVer,this.ModuloUserFacturacionVer, "permisos");
  }

  SignOut() {
    localStorage.setItem('currentUser', "true");
    this.router.navigate(['/index.html']);
    window.location.reload();
  }

}