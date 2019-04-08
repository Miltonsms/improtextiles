import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app'

export interface Empleado { nombre: string; apellidos: string; fechaNacimiento: Date; dpi: number; sexo: string; EstadoCivil: string; Telefono: number; email: string;  FechaIngreso: Date;  emailLaboral: string;  cargo: string; jefeinmediato: string; departamento: string;daysUsed:number;historyDays:any}
export interface EmpleadoId extends Empleado { id: string; }
import * as moment from 'moment';
import { detectChanges } from '@angular/core/src/render3';
import { take } from 'rxjs/operators';
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
    daysUsed:null,
    historyDays:null
  };
  editar = true;
  query: string;  
  docEmpleado: AngularFirestoreDocument<Empleado>;
  editEmpleado: Observable<Empleado>;
  //vacations
  vacationVar=false
  totalDays
  selectedEmployee
  numberDiscountDays
  reasonDiscountDays
  yearsWorked
  monthsWorked
  historyEmployee=[]
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
    this.afs.doc(`empleados/${empleado.id}`).collection("historyDays").valueChanges().subscribe(snapshot=>{
      this.historyEmployee=[]
      snapshot.forEach(item=>{
        this.historyEmployee.push(item)
      })   
    })
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
      daysUsed:null,
      historyDays:null
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
  this.yearsWorked=null
  this.monthsWorked=null
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
      this.yearsWorked=dateNow.diff(dateCreated,"years",true)
      let auxsplit=this.yearsWorked.toFixed(2)
      let splitYears=auxsplit.split('.')
      if(splitYears[1]!=null){
        let auxMonth=Number(splitYears[1])
        this.monthsWorked=12*(auxMonth/100)
        this.monthsWorked=this.monthsWorked.toFixed(0)
      }
      this.totalDays=this.yearsWorked*15
      this.totalDays=this.totalDays.toFixed(0)
      this.yearsWorked=auxsplit[0]
      }
    else{
      let dateCreated=moment(empleado.FechaIngreso)
      let dateNow=moment()
      this.yearsWorked=dateNow.diff(dateCreated,"years",true)
      let auxsplit=this.yearsWorked.toFixed(2)
      let splitYears=auxsplit.split('.')
      if(splitYears[1]!=null){
        let auxMonth=Number(splitYears[1])
        this.monthsWorked=12*(auxMonth/100)
        this.monthsWorked=this.monthsWorked.toFixed(0)
      }
      this.totalDays=this.yearsWorked*15-empleado.daysUsed
      this.totalDays=this.totalDays.toFixed(0)
      this.yearsWorked=auxsplit[0]
    }
  }
  else{
    this.vacationVar=false
  }
  
}
discountDays(){
  this.afs.doc(`empleados/${this.selectedEmployee.id}`).valueChanges().pipe(take(1)).subscribe(snapshot=>{
    let aux:any
    aux=snapshot
    console.log("snap",aux.daysUsed)
    this.afs.doc(`empleados/${this.selectedEmployee.id}`).update({
      daysUsed: aux.daysUsed+this.numberDiscountDays
    }).then(_=>{
      this.totalDays=this.totalDays-this.numberDiscountDays
      this.numberDiscountDays=0
      this.reasonDiscountDays=''
      console.log("update ok")
    }).catch(error=>{
      console.log("error:",error)
    })
  })
  this.afs.collection(`empleados/${this.selectedEmployee.id}/historyDays`).add({
    days:this.numberDiscountDays,
    reason:this.reasonDiscountDays,
    date: new Date(Date.now()).toLocaleString()
  }).then(_=>{
    this.afs.collection(`empleados/${this.selectedEmployee.id}/historyDays`).valueChanges().subscribe(snapshot=>{
      console.log("historial",snapshot)
    })
  })
}
}
