import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Empleado { 
    nombre: string;
    emailLaboral: string;  
}

export interface EmpleadoId extends Empleado { id: string; }

export interface usuarios {
        nombre: string;
        correo:string,
        password:string,
        ModuloUserRRHH:{
            ver:boolean,
            editar:boolean,
            eleminar:boolean
        }
    }

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {
//empledos
  private empleadoCollection: AngularFirestoreCollection<Empleado>;
  empleados: Observable<EmpleadoId[]>;

//   nuevo usuario 
nuevoUsuario: usuarios = {
    nombre: '',
    correo:'',
    password:'',
    ModuloUserRRHH:{
        ver: false,
        editar:false,
        eleminar:false
    }
};


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

// ver datos de firebase de empelados
docEmpleado: AngularFirestoreDocument<Empleado>;
editEmpleado: Observable<Empleado>;

  constructor(private readonly afs: AngularFirestore) {

    this.empleadoCollection = afs.collection<Empleado>('empleados');
    this.empleados = this.empleadoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Empleado;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

   }

  ngOnInit() {
  }



  addUsuarios(empleado: Empleado) {
    this.empleadoCollection.add(empleado);
    this.nuevoUsuario = {
        nombre: '',
        correo:'',
        password:'',
        ModuloUserRRHH:{
            ver: false,
            editar:false,
            eleminar:false
        }
    };
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
