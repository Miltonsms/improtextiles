import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';

// inventario
export interface GrupoInventario { 
  nombre: string,
  total: number,
  totalProductos: number
}
export interface grupoioId extends GrupoInventario { id: string; }
//productos
export interface Producto { 
  codigo:number,
  descripcion:string,
  preciounit:number,
  grupo:string,
  Cantidad:number,
  total:number,
  hostorial:any
}
export interface productoId extends Producto { id: string; }
//provedores
export interface proveedores {nombre:string}
export interface  proveedoresId extends proveedores { id: string; }
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styles: []
})
export class InventarioComponent implements OnInit {
//nuevo grupo
private grupoCollection: AngularFirestoreCollection<GrupoInventario>;
grupos: Observable<grupoioId[]>;
nuevoGrupo: GrupoInventario = {
  nombre: "",
  total: 0,
  totalProductos: 0,
};

docGrupo: AngularFirestoreDocument<GrupoInventario>;
editGrupo: Observable<GrupoInventario>;
//producto
private productoCollection: AngularFirestoreCollection<Producto>;
productos: Observable<productoId[]>;
nuevoProducto: Producto = {
  codigo:0,
  descripcion:"",
  preciounit:0,
  grupo:"",
  Cantidad:0,
  total:0,
  hostorial:[]
};

docproducto: AngularFirestoreDocument<Producto>;
editProducto: Observable<Producto>;
//provedores
private provedoresCollection: AngularFirestoreCollection<proveedores>;
proveedores: Observable<proveedoresId[]>;
//


  vistaproducto = false;
  grupoProductos: string;
  editar = true;
  gurpo = [];
  query2: string;
  proveedores2: any;
  total:number;
  constructor(private readonly afs: AngularFirestore) {
    //grupos
    this.grupoCollection = afs.collection<GrupoInventario>('grupos');
    this.grupos = this.grupoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GrupoInventario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    //Producctos
    this.productoCollection = afs.collection<Producto>('productos');
    this.productos = this.productoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Producto;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    //proveedores
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
//grupo
  addUGrupo(grupo: GrupoInventario) {
    this.grupoCollection.add(grupo);
    this.nuevoGrupo = {
      nombre: "",
      total: 0,
      totalProductos: 0
    };
  }
  verGrupo(grupo) {
    this.docGrupo = this.afs.doc(`grupos/${grupo.id}`);
    this.editGrupo=this.docGrupo.valueChanges();
    this.grupoProductos = grupo.nombre;
    this.gurpo = grupo;
    this.query2 = grupo.nombre;
    this.proveedores2 = this.proveedores;
  }
  //producto
  addProducto(producto: Producto ,grupos,proveedor,datecompra,cantidad) {
    console.log(grupos,"HOLA");
    producto.grupo = this.grupoProductos;
    
    var total = cantidad * producto.preciounit;
    producto.Cantidad = cantidad;
    producto.total = total;
    grupos.total = grupos.total + total;
    grupos.totalProductos = grupos.totalProductos + 1;
    var hostorial = {
      Fechacompra: datecompra,
      proveedor: proveedor,
      cantidad: cantidad
    }
    producto.hostorial.push(hostorial)

    this.productoCollection.add(producto);
    this.docGrupo.update(grupos);
    this.nuevoProducto = {
      codigo:0,
      descripcion:"",
      preciounit:0,
      grupo:"",
      Cantidad:0,
      total:0,
      hostorial:[]
    };
  }
  verProducto(producto) {
    this.docproducto = this.afs.doc(`productos/${producto.id}`);
    this.editProducto=producto;
    this.vistaproducto = true;
    this.proveedores2 = this.proveedores;
    console.log(this.editProducto,producto);
  }
  regresar(){
    this.vistaproducto = false;
  }
  ButtonEditar(){
    this.editar = false
  }
  ButtonEditarCancelar(){
    this.editar = true;
  }
//   totalFactura(){
//     //Calculamos el TOTAL 
//     this.total = this.proveedores.reduce((
//       acc,
//       obj,
//     ) => acc + (obj.total),
//     0);
//     console.log("Total: ", this.total)
// }
}
