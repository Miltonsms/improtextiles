import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ClienteIndustrial {
  Entidad: string,
  nit:string,
  pbx:string,
  Direccion:string,
  Observaciones:string,
  Departamentos:any,
}

export interface  ClienteIndustrialId extends ClienteIndustrial { id: string; }
@Component({
  selector: 'app-cliente-industrial',
  templateUrl: './cliente-industrial.component.html',
  styles: []
})
export class ClienteIndustrialComponent implements OnInit {
  departamentoItem={
    NombreDepartamento:'',
    Contacto:'',
    email:'',
    movil:'',
    Extension:'',
    DireccionDepartemeto:'',
    Observaciones:'',
  }
  //variables para permisos 
  ModuloUserClienteEliminar = JSON.parse(localStorage.getItem('ModuloUserClienteEliminar'));
  ModuloUserClienteEditar = JSON.parse(localStorage.getItem('ModuloUserClienteEditar',));
  
  private clienteindustrialCollection: AngularFirestoreCollection<ClienteIndustrial>;
  clientes: Observable<ClienteIndustrialId[]>;
  
  //arrego para agregar nuevo cliente
  nuevoClienteIndustrial: ClienteIndustrial = {
    Entidad: " ",
    nit:" ",
    pbx:" ",
    Direccion:" ",
    Observaciones:" ",
    Departamentos:[]
  };
  edit_cliente = {
    Entidad: " ",
    nit:" ",
    pbx:" ",
    Direccion:" ",
    Observaciones:" ",
    Departamentos:[]
  };

  editar = true;
  docCliente: AngularFirestoreDocument<ClienteIndustrial>;
  editCliente: Observable<ClienteIndustrial>;
  query: string;
  p = 1;
  itemsPerPage = 10;
  idDepartamento:any

  constructor(private readonly afs: AngularFirestore) {
        // cliente
        this.clienteindustrialCollection = afs.collection<ClienteIndustrial>('clienteindus');
        this.clientes = this.clienteindustrialCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as ClienteIndustrial;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );

   }

  ngOnInit() {
    
  }
  addCliente(cliente: ClienteIndustrial) {
    this.nuevoClienteIndustrial.Departamentos.push(this.departamentoItem)
    this.clienteindustrialCollection.add(cliente);
    this.nuevoClienteIndustrial = {
      Entidad: " ",
      nit:" ",
      pbx:" ",
      Direccion:" ",
      Observaciones:" ",
      Departamentos:[]
    };
    this.departamentoItem={
      NombreDepartamento:'',
      Contacto:'',
      email:'',
      movil:'',
      Extension:'',
      DireccionDepartemeto:'',
      Observaciones:'',
    }
  }
  addDepartamento(){
    this.edit_cliente.Departamentos.push(this.departamentoItem)
    this.departamentoItem={
      NombreDepartamento:'',
      Contacto:'',
      email:'',
      movil:'',
      Extension:'',
      DireccionDepartemeto:'',
      Observaciones:'',
    }
    this.docCliente.update(this.edit_cliente);
  }
  verCliente(cliente) {
    console.log(cliente);
    this.docCliente = this.afs.doc(`clienteindus/${cliente.id}`);
    this.editCliente=this.docCliente.valueChanges()
    this.edit_cliente = cliente
    console.log(cliente.Entidad)
    this.editar = true;
  }

  //funcion para guardar cambios
  setCliente(cliente) {
    this.docCliente.update(cliente);
    this.editar = true;
  }
  // eliminar clente
  daleteCliente() {
    this.docCliente.delete();
  }
  // eliminar Departamento
  daleteDepartamento() {
    this.edit_cliente.Departamentos.splice(this.idDepartamento, 1);
    this.docCliente.update(this.edit_cliente);
  }
  ObtenerId(id){
    this.idDepartamento=id
  }
  IditClient(item,id){
    this.idDepartamento=id
    this.departamentoItem={
      NombreDepartamento:item.NombreDepartamento,
      Contacto:item.Contacto,
      email:item.email,
      movil:item.movil,
      Extension:item.Extension,
      DireccionDepartemeto:item.DireccionDepartemeto,
      Observaciones:item.Observaciones,
    }
  }
  actualizarDepartamento(){
    this.edit_cliente.Departamentos[this.idDepartamento].NombreDepartamento=this.departamentoItem.NombreDepartamento
    this.edit_cliente.Departamentos[this.idDepartamento].Contacto=this.departamentoItem.Contacto
    this.edit_cliente.Departamentos[this.idDepartamento].email=this.departamentoItem.email
    this.edit_cliente.Departamentos[this.idDepartamento].movil=this.departamentoItem.movil
    this.edit_cliente.Departamentos[this.idDepartamento].Extension=this.departamentoItem.Extension
    this.edit_cliente.Departamentos[this.idDepartamento].DireccionDepartemeto=this.departamentoItem.DireccionDepartemeto
    this.edit_cliente.Departamentos[this.idDepartamento].Observaciones=this.departamentoItem.Observaciones

    this.docCliente.update(this.edit_cliente);
  }
}
