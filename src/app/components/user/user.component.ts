import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// empreados
export interface Empleado { 
    nombre: string;
    emailLaboral: string;  
}
export interface EmpleadoId extends Empleado { id: string; }
// usuarios
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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})

export class UserComponent implements OnInit {
//empledos
  private empleadoCollection: AngularFirestoreCollection<Empleado>;
  empleados: Observable<EmpleadoId[]>;

//   nuevo usuario agregar
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


  public newDato;
  nombraCorreo: string;
  editar = true;
  editarUsuario = true;

  docUsuario: AngularFirestoreDocument<usuario>;
  editUsuario: Observable<usuario>;
    
  constructor(private readonly afs: AngularFirestore) {

    this.empleadoCollection = afs.collection<Empleado>('empleados');
    this.empleados = this.empleadoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Empleado;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

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
    this.usuarios = this.usuarioCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as usuario;
        const id = a.payload.doc.id;
        console.log(data)
        return { id, ...data };
      }))
    );
  }

  verUsuario(usuario) {
    this.docUsuario = this.afs.doc(`usuarios/${usuario.id}`);
    this.editUsuario = this.docUsuario.valueChanges();
    console.log(this.docUsuario);
    this.editar = true;
  }

  addUsuarios(usuario: usuario) {
    // this.nuevoUsuario = {
    //     nombre: '',
    //     correo: datos.emailLaboral[id.id],
    //     password:'',
    //     ModuloUserRRHH:{
    //         ver: false,
    //         eliminar:false,
    //         editar:false
    //     }
    // };
    // console.log(datos.nombre[id],id);
    this.usuarioCollection.add(usuario);
    this.nuevoUsuario = {
        nombre: '',
        correo:'',
        password:'',
        ModuloUserRRHH:{
            ver: false,
            eliminar:false,
            editar:false
        }
    };
  }

  MostrarDatos(users){
    this.editar = true;
  }
  ButtonEditar(){
      this.editar = false;
  }
  ButtonEditarCancelar(){
    this.editar = true;
  }
// funcion para guardar datos editados
  setUsuario(empleado) {
    this.docUsuario.update(empleado);
    this.editar = true;
  }
  daleteEmpleado() {
    this.docUsuario.delete();
  }
}
