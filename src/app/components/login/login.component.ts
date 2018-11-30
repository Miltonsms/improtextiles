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
      ver:boolean,
      eliminar:boolean,
      editar:boolean
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
        nombre: '',
        correo:'',
        password:'',
        ModuloUserRRHH:{
            ver: false,
            eliminar:false,
            editar:false
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
        localStorage.setItem('currentUser', "false");
        console.log(localStorage.getItem('currentUser'),"loging false");
        if(this.login == true){
          window.location.reload();
        }
      }else{
        this.mensaje = "El Nombre de usuario o contraseña no es correcto."+nombre+password;
        console.log(localStorage.getItem('currentUser'),"loging fallido");
        console.log(data.nombre,this.mensaje);
      }
      return { id, ...data };
    }))
  );
 }

}
