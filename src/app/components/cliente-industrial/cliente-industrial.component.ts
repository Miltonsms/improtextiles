import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ClienteIndustrial {
  Entidad: string,
  Departamento:string,
  nombre:string,
  nit:string,
  email:string,
  movil: string,
  pbx:string,
  Extension:string,
  Direccion:string,
  Direccionbodega:string,
  Observaciones:string
}
export interface  ClienteIndustrialId extends ClienteIndustrial { id: string; }
@Component({
  selector: 'app-cliente-industrial',
  templateUrl: './cliente-industrial.component.html',
  styles: []
})
export class ClienteIndustrialComponent implements OnInit {

  //variables para permisos 
  ModuloUserClienteEliminar = JSON.parse(localStorage.getItem('ModuloUserClienteEliminar'));
  ModuloUserClienteEditar = JSON.parse(localStorage.getItem('ModuloUserClienteEditar',));
  
  private clienteindustrialCollection: AngularFirestoreCollection<ClienteIndustrial>;
  clientes: Observable<ClienteIndustrialId[]>;
  
  //arrego para agregar nuevo cliente
  nuevoClienteIndustrial: ClienteIndustrial = {
    Entidad: " ",
    Departamento:" ",
    nombre:" ",
    nit:" ",
    email:" ",
    movil: " ",
    pbx:" ",
    Extension:" ",
    Direccion:" ",
    Direccionbodega:" ",
    Observaciones:" "
  };

  editar = true;
  docCliente: AngularFirestoreDocument<ClienteIndustrial>;
  editCliente: Observable<ClienteIndustrial>;
  query: string;
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
    this.clienteindustrialCollection.add(cliente);
    this.nuevoClienteIndustrial = {
      Entidad: " ",
      Departamento:" ",
      nombre:" ",
      nit:" ",
      email:" ",
      movil: " ",
      pbx:" ",
      Extension:" ",
      Direccion:" ",
      Direccionbodega:" ",
      Observaciones:" "
    };
  }
  verCliente(cliente) {
    // console.log(cliente);
    this.docCliente = this.afs.doc(`clienteindus/${cliente.id}`);
    console.log(this.docCliente,"docliente");
    this.editCliente=this.docCliente.valueChanges()
    console.log("edit cliente",this.editCliente);
    this.editar = true;
  }
  
  ButtonEditar(){
    this.editar = false
}
  ButtonEditarCancelar(){
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
}
