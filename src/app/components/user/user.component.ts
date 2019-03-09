import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { ConsoleReporter } from 'jasmine';

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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})

export class UserComponent implements OnInit {

  ModuloUserEliminar = JSON.parse(localStorage.getItem('ModuloUserEliminar'));
  ModuloUserEditar = JSON.parse(localStorage.getItem('ModuloUserEditar',));
//empledos
  private empleadoCollection: AngularFirestoreCollection<Empleado>;
  empleados: Observable<EmpleadoId[]>;

//   nuevo usuario agregar
    private usuarioCollection: AngularFirestoreCollection<usuario>;
    usuarios: Observable<usuarioId[]>;
    nuevoUsuario: usuario = {
        nombre: ' ',
        correo:' ',
        password:' ',
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


  public newDato;
  nombraCorreo: string;
  editar = true;
  editarUsuario = true;

  docUsuario: AngularFirestoreDocument<usuario>;
  editUsuario: Observable<usuario>;
  query: string;
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
    this.usuarioCollection.add(usuario);
    this.nuevoUsuario = {
        nombre: ' ',
        correo:' ',
        password:' ',
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
    // RRHH
    localStorage.setItem('ModuloUserRRHHVer', empleado.ModuloUserRRHH.ver);
    localStorage.setItem('ModuloUserRRHHEditar', empleado.ModuloUserRRHH.editar);
    localStorage.setItem('ModuloUserRRHHEliminar', empleado.ModuloUserRRHH.eliminar);
    // usuarios
    localStorage.setItem('ModuloUserVer', empleado.ModuloUser.ver);
    localStorage.setItem('ModuloUserEditar', empleado.ModuloUser.editar);
    localStorage.setItem('ModuloUserEliminar', empleado.ModuloUser.eliminar);

    // Clientes
    localStorage.setItem('ModuloUserClienteVer', empleado.ModuloUserCliente.ver);
    localStorage.setItem('ModuloUserClienteEditar', empleado.ModuloUserCliente.editar);
    localStorage.setItem('ModuloUserClienteEliminar', empleado.ModuloUserCliente.eliminar);
    
    // proveedores

    localStorage.setItem('ModuloUserProveedoresVer', empleado.ModuloUserProveedores.ver);
    localStorage.setItem('ModuloUserProveedoresEditar', empleado.ModuloUserProveedores.editar);
    localStorage.setItem('ModuloUserProveedoresEliminar', empleado.ModuloUserProveedores.eliminar);
    this.docUsuario.update(empleado);
    this.editar = true;
    console.log(localStorage.getItem('ModuloUserRRHHEliminar'),"eliminar");
    // window.location.reload();
  }
  daleteEmpleado() {
    this.docUsuario.delete();
  }
}
