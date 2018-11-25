import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {
  public newDato;
  nombreUser: string;
  cargoUser: string;
  emailUser: string;
  passwordUser: string;
  editar = true;
  userVer: boolean;
  userEditar: boolean;
  userEliminar: boolean;
//   mostrar datos variables

MostrarNombreUser: string;
MostrarCargoUser: string;
MostrarEmailUser: string;
MostrarPasswordUser: string;

  user=[
        {
            "Nombre":"milton",
            "correo":"m@gmail.com",
            "cargo":"gerente",
            "ModuloUser":{
                "ver":true,
                "editar":true,
                "eleminar":false
            }
        },
        {
            "Nombre":"sergio",
            "correo":"s@gmail.com",
            "cargo":"supervisor",
            "ModuloUser":{
                "ver":true,
                "editar":true,
                "eleminar":false
            }
        },
        {
            "Nombre":"saul",
            "correo":"s@gmail.com",
            "cargo":"visitador Medico",
            "ModuloUser":{
                "ver":true,
                "editar":true,
                "eleminar":false
            }
        },
        {
            "Nombre":"milton",
            "correo":"m@gmail.com",
            "cargo":"gerente",
            "ModuloUser":{
                "ver":true,
                "editar":true,
                "eleminar":false
            }
        }
    ];
  constructor() { }

  ngOnInit() {
  }
  pustDatos(){
    this.newDato ={
      "Nombre":''+this.nombreUser+'',
      "correo":''+this.emailUser+'',
      "cargo":''+this.cargoUser+''
      }
  }

  MostrarDatos(users){
    this.MostrarNombreUser = users.Nombre;
    this.MostrarCargoUser = users.cargo;
    this.MostrarEmailUser = users.correo;
    this.userVer=users.ModuloUser.ver;
    this.userEditar=users.ModuloUser.editar;
    this.userEliminar=users.ModuloUser.eleminar;
    console.log(this.MostrarNombreUser,this.MostrarCargoUser,this.MostrarEmailUser);
    this.editar = true;
  }
  ButtonEditar(){
      this.editar = false;
  }
  

}
