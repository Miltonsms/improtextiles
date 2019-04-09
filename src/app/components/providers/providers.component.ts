import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface proveedores {
  Entidad: string,
  Nit:string,
  nombre:string,
  movil:string,
  email:string,
  pbx: string,
  Extension:string,
  Direccion:string,
  Observaciones:string
}
export interface  proveedoresId extends proveedores { id: string; }
@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styles: []
})
export class ProvidersComponent implements OnInit {
  //variables para permisos 
  ModuloUserClienteEliminar = JSON.parse(localStorage.getItem('ModuloUserProveedoresEliminar'));
  ModuloUserClienteEditar = JSON.parse(localStorage.getItem('ModuloUserProveedoresEditar',));

  private provedoresCollection: AngularFirestoreCollection<proveedores>;
  proveedores: Observable<proveedoresId[]>;
  
  //arrego para agregar nuevo cliente
  nuevoProeveedor: proveedores = {
  Entidad: " ",
  Nit:" ",
  nombre:" ",
  movil:" ",
  email:" ",
  pbx: " ",
  Extension:" ",
  Direccion:" ",
  Observaciones:" "
  };

  editar = true;
  docCliente: AngularFirestoreDocument<proveedores>;
  editCliente: Observable<proveedores>;
  query: string;
  constructor(private readonly afs: AngularFirestore) {
        // cliente
        this.provedoresCollection = afs.collection<proveedores>('proveedores');
        this.proveedores = this.provedoresCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as proveedores;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );

   }

  ngOnInit() {
  }
  addCliente(cliente: proveedores) {
    this.provedoresCollection.add(cliente);
    this.nuevoProeveedor = {
      Entidad: " ",
      Nit:" ",
      nombre:" ",
      movil:" ",
      email:" ",
      pbx: " ",
      Extension:" ",
      Direccion:" ",
      Observaciones:" "
    };
  }
  verCliente(prove) {
    // console.log(cliente);
    this.docCliente = this.afs.doc(`proveedores/${prove.id}`);
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
