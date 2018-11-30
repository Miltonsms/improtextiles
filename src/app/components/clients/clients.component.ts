import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// clientes
export interface cliente {
  nombre: string;
  Representante:string,
  IdentificacionRep:string,
  nit:string,
  email:string
}
export interface  clienteId extends cliente { id: string; }


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styles: []
})
export class ClientsComponent implements OnInit {

  private clienteCollection: AngularFirestoreCollection<cliente>;
  clientes: Observable<clienteId[]>;
  //arrego para agregar nuevo cliente
  nuevoClienteJuridico: cliente = {
    nombre: '',
    Representante:'',
    IdentificacionRep:'',
    nit:'',
    email:''
  };

  editar = true;
  docCliente: AngularFirestoreDocument<cliente>;
  editCliente: Observable<cliente>;


  constructor(private readonly afs: AngularFirestore) { 
        // cliente
        this.clienteCollection = afs.collection<cliente>('cliente');
        this.clientes = this.clienteCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as cliente;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
  }

  ngOnInit() {

  }

  addCliente(cliente: cliente) {
    this.clienteCollection.add(cliente);
    this.nuevoClienteJuridico = {
      nombre: '',
      Representante:'',
      IdentificacionRep:'',
      nit:'',
      email:''
    };
  }
  verCliente(cliente) {
    this.docCliente = this.afs.doc(`cliente/${cliente.id}`);
    this.editCliente = this.docCliente.valueChanges();
    console.log(this.docCliente);
    this.editar = true;
  }
  ButtonEditar(){
    this.editar = false;
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
