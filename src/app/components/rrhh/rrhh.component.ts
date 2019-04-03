import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Empleado { nombre: string; apellidos: string; fechaNacimiento: Date; dpi: number; sexo: string; EstadoCivil: string; Telefono: number; email: string;  FechaIngreso: Date;  emailLaboral: string;  cargo: string; jefeinmediato: string; departamento: string;daysUsed:number}
export interface EmpleadoId extends Empleado { id: string; }
import * as moment from 'moment';
import { detectChanges } from '@angular/core/src/render3';

@Component({
  selector: 'app-rrhh',
  templateUrl: './rrhh.component.html',
  styles: []
})
export class RrhhComponent implements OnInit {
  ModuloUserRRHHEliminar = JSON.parse(localStorage.getItem('ModuloUserRRHHEliminar'));
  ModuloUserRRHHEditar = JSON.parse(localStorage.getItem('ModuloUserRRHHEditar',));
  private empleadoCollection: AngularFirestoreCollection<Empleado>;
  empleados: Observable<EmpleadoId[]>;
  nuevoEmpleado: Empleado = {
    nombre: '',
    apellidos: '',
    fechaNacimiento: null,
    dpi: null,
    sexo: '',
    EstadoCivil: '',
    Telefono: null,
    email: '',
    FechaIngreso: null,
    emailLaboral: '',
    cargo: '',
    jefeinmediato: '',
    departamento:'',
    daysUsed:null
  };
  editar = true;
  query: string;  
  docEmpleado: AngularFirestoreDocument<Empleado>;
  editEmpleado: Observable<Empleado>;
  //vacations
  vacationVar=false
  totalDays
  selectedEmployee
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
    // window.location.reload();
    console.log(localStorage.getItem('ModuloUserRRHHVer'),"rrhhver");
    console.log(localStorage.getItem('ModuloUserRRHHEliminar'),"eliminar");


  }

  verEmpleado(empleado) {
    this.selectedEmployee=empleado
    this.docEmpleado = this.afs.doc(`empleados/${empleado.id}`);
    this.editEmpleado = this.docEmpleado.valueChanges();
    console.log(this.editEmpleado);

  }

  addEmpleado(empleado: Empleado) {
    this.empleadoCollection.add(empleado);
    this.nuevoEmpleado = {
      nombre: '',
      apellidos: '',
      fechaNacimiento: null,
      dpi: null,
      sexo: '',
      EstadoCivil: '',
      Telefono: null,
      email: '',
      FechaIngreso: null,
      emailLaboral: '',
      cargo: '',
      jefeinmediato: '',
      departamento:'',
      daysUsed:null
    };
  }

  setEmpleado(empleado) {
    this.docEmpleado.update(empleado);
    this.editar = true;
  }

  daleteEmpleado() {
    this.docEmpleado.delete();
  }
  ButtonEditar(){
    this.editar = false;
}
ButtonEditarCancelar(){
  this.editar = true;
}
setVacations(empleado){
  if(this.vacationVar==false){
    this.vacationVar=true
    if(empleado.daysUsed==null){
      this.afs.doc(`empleados/${this.selectedEmployee.id}`).set({
        daysUsed:0
      },{merge:true}).then(_=>{
        console.log("update ok")
      }).catch(error=>{
        console.log("error:",error)
      })
      let dateCreated=moment(empleado.FechaIngreso)
      let dateNow=moment()
      let yearsWorked=dateNow.diff(dateCreated,"years",true)
      this.totalDays=yearsWorked*15
      this.totalDays=this.totalDays.toFixed(2)
      }
    else{
       let dateCreated=moment(empleado.FechaIngreso)
      let dateNow=moment()
      let yearsWorked=dateNow.diff(dateCreated,"years",true)
      this.totalDays=yearsWorked*15
      this.totalDays=this.totalDays.toFixed(2)
  
    }
  }
  else{
    this.vacationVar=false
  }
}
}
