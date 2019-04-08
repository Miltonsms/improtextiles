import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// clientes
export interface ClienteIndividual {
  nombres: string;
  apellidos:string,
  email:string,
  nit:string,
  direccionDomicilio:string,
  estadocivil: string,
  telefonocasa:string,
  movil:string,
  fechanacimiento:string,
  dpi:string,
  direcciontrabajo:string,
  pbx: string;
  emailempresarial:string,
  cargoempresa:string,
  observaciones:string,
  fechainiciorelacion:string
}
export interface  ClienteIndividualId extends ClienteIndividual { id: string; }


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styles: []
})
export class ClientsComponent implements OnInit {

  //variables para permisos 
  ModuloUserClienteEliminar = JSON.parse(localStorage.getItem('ModuloUserClienteEliminar'));
  ModuloUserClienteEditar = JSON.parse(localStorage.getItem('ModuloUserClienteEditar',));

  private clienteCollection: AngularFirestoreCollection<ClienteIndividual>;
  clientes: Observable<ClienteIndividualId[]>;
  
  //arrego para agregar nuevo cliente
  nuevoClienteIndividual: ClienteIndividual = {
    nombres: " ",
    apellidos:" ",
    email:" ",
    nit:" ",
    direccionDomicilio:" ",
    estadocivil: " ",
    telefonocasa:" ",
    movil:" ",
    fechanacimiento:" ",
    dpi:" ",
    direcciontrabajo:" ",
    pbx: " ",
    emailempresarial:" ",
    cargoempresa:" ",
    observaciones:" ",
    fechainiciorelacion:" "
  };

  editar = true;
  docCliente: AngularFirestoreDocument<ClienteIndividual>;
  editCliente: Observable<ClienteIndividual>;
  query: string;


  constructor(private readonly afs: AngularFirestore) {
        // cliente
        this.clienteCollection = afs.collection<ClienteIndividual>('cliente');
        this.clientes = this.clienteCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as ClienteIndividual;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
  }

  ngOnInit() {

  }

  addCliente(cliente: ClienteIndividual) {
    this.clienteCollection.add(cliente);
    this.nuevoClienteIndividual = {
      nombres: " ",
      apellidos:" ",
      email:" ",
      nit:" ",
      direccionDomicilio:" ",
      estadocivil: " ",
      telefonocasa:" ",
      movil:" ",
      fechanacimiento:" ",
      dpi:" ",
      direcciontrabajo:" ",
      pbx: " ",
      emailempresarial:" ",
      cargoempresa:" ",
      observaciones:" ",
      fechainiciorelacion:" "
    };
  }

  verCliente(cliente) {
    // console.log(cliente);
    this.docCliente = this.afs.doc(`cliente/${cliente.id}`);
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
