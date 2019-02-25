import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {Router} from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';

export interface usuario {
  nombre: string;
  correo:string,
  password:string,
  ModuloUserRRHH:{
      ver:string,
      eliminar:string,
      editar:string
  },
  ModuloUser:{
    ver:string,
    eliminar:string,
    editar:string
},
ModuloUserCliente:{
  ver:string,
  eliminar:string,
  editar:string
},
ModuloUserProveedores:{
  ver:string,
  eliminar:string,
  editar:string
}
}

export interface usuarioId extends usuario { id: string; }
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {
  private usuarioCollection: AngularFirestoreCollection<usuario>;
    usuarios: Observable<usuarioId[]>;
    nuevoUsuario: usuario = {
        nombre: 'User',
        correo:'',
        password:'',
        ModuloUserRRHH:{
            ver: "true",
            eliminar:"true",
            editar:"true"
        },
        ModuloUser:{
          ver: "true",
          eliminar:"true",
          editar:"true"
      },
      ModuloUserCliente:{
        ver: "true",
        eliminar:"true",
        editar:"true"
    },
    ModuloUserProveedores:{
      ver: "true",
      eliminar:"true",
      editar:"true"
  }
    };


  mensaje: string;
  nombre: string; 
  password: string;
  login = JSON.parse(localStorage.getItem('currentUser'));
  docUsuario: AngularFirestoreDocument<usuario>;
  editUsuario: Observable<usuario>;
  
  constructor(private readonly afs: AngularFirestore,public router: Router) {

    // usurios
    this.usuarioCollection = afs.collection<usuario>('usuarios');
    this.usuarios = this.usuarioCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    
  }

  ngOnInit() {
    console.log(localStorage.getItem('currentUser'),"loging estoy");
    localStorage.setItem('currentUser', "true");
  }

  loginUser(nombre,password){

  this.usuarios = this.usuarioCollection.snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as usuario;
      const id = a.payload.doc.id;

      if(data.nombre == nombre && data.password == password){
        this.mensaje = "hola."+nombre+password;
        // this.router.navigate(['/rrhh']);
        console.log(data.nombre,this.mensaje);
        // login
        localStorage.setItem('currentUser', "false");
        // rrhh
        localStorage.setItem('ModuloUserRRHHVer', data.ModuloUserRRHH.ver);
        localStorage.setItem('ModuloUserRRHHEliminar', data.ModuloUserRRHH.eliminar);
        localStorage.setItem('ModuloUserRRHHEditar', data.ModuloUserRRHH.editar);
        // usuarios
        localStorage.setItem('ModuloUserVer', data.ModuloUser.ver);
        localStorage.setItem('ModuloUserEliminar', data.ModuloUser.eliminar);
        localStorage.setItem('ModuloUserEditar', data.ModuloUser.editar);
        // Cliente
        localStorage.setItem('ModuloUserClienteVer', data.ModuloUserCliente.ver);
        localStorage.setItem('ModuloUserClienteEliminar', data.ModuloUserCliente.eliminar);
        localStorage.setItem('ModuloUserClienteEditar', data.ModuloUserCliente.editar);
        // Cliente
        localStorage.setItem('ModuloUserProveedoresVer', data.ModuloUserProveedores.ver);
        localStorage.setItem('ModuloUserProveedoresEliminar', data.ModuloUserProveedores.eliminar);
        localStorage.setItem('ModuloUserProveedoresEditar', data.ModuloUserProveedores.editar);
        // nombre de usuario
        localStorage.setItem('NombreUsuario', data.nombre);
        // console.log(localStorage.getItem('ModuloUserRRHHVer'),"loging false");
        // console.log(localStorage.getItem('currentUser'),"loging false");
        if(this.login == true){
          this.router.navigate(['/index.html']);
          window.location.reload();
        }
        window.location.reload();

      }else{
        this.mensaje = "El Nombre de usuario o contraseña no es correcto.";
        // console.log(localStorage.getItem('currentUser'),"loging fallido");
        console.log(data.nombre,this.mensaje);
      }
      return { id, ...data };
    }))
  );
 }

}
