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
  gurpo =[];
  tatalsuma = 0;
  query2: string;
  proveedores2 =[];
  total:number;
  sumaTotal:number=0;
  nuevoInsumoOcultar= false;
  grupoActual= [];
  constructor(private readonly afs: AngularFirestore) {
    //grupos
    this.grupoCollection = afs.collection<GrupoInventario>('grupos');
    this.grupos = this.grupoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GrupoInventario;
        const id = a.payload.doc.id;
        this.gurpo.push(data)
        this.inventariotatal();
        console.log(this.gurpo);
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
        this.proveedores2.push(data)
        // console.log(this.proveedores2,"proveedores");
        return { id, ...data };
      }))
    );
    
  }
  ngOnInit() {
    
  }
  inventariotatal(){
    this.tatalsuma =0;
    for (var i = 0; i< this.gurpo.length; i++){
      this.tatalsuma = this.tatalsuma + this.gurpo[i].total;
    }
    // console.log(this.tatalsuma ,"tatal");
  }
//grupo
  addUGrupo(grupo: GrupoInventario) {
    this.gurpo =[];
    this.inventariotatal();
    this.grupoCollection.add(grupo);
    this.nuevoGrupo = {
      nombre: "",
      total: 0,
      totalProductos: 0
    };
  }
  verGrupo(grupo) {
    this.grupoActual = grupo;
    this.docGrupo = this.afs.doc(`grupos/${grupo.id}`);
    this.editGrupo=this.docGrupo.valueChanges();
    this.grupoProductos = grupo.nombre;
    this.query2 = grupo.nombre;
    this.inventariotatal();
  }
  //producto
  addProducto(producto: Producto ,grupos,proveedor,datecompra,cantidad) {
    this.gurpo = [];
    producto.grupo = this.grupoProductos;
    
    var total = cantidad * producto.preciounit;
    producto.Cantidad = cantidad;
    producto.total = total;
    grupos.total = grupos.total + total;
    grupos.totalProductos = grupos.totalProductos + cantidad;

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
    this.inventariotatal();
    this.grupoActual = grupos;
  }
  verProducto(producto) {
    this.docproducto = this.afs.doc(`productos/${producto.id}`);
    this.editProducto=producto;
    this.vistaproducto = true;
    console.log(this.editProducto,producto);
  }
  ButtonEditar(){
    this.editar = false
  }
  ButtonEditarCancelar(){
    this.editar = true;
  }
  nuevosInsumos(){
    this.nuevoInsumoOcultar = true;
    this.inventariotatal();
  }
  guardarInsumos(grupo,editProducto,proveedor2,datecompra22,cantidad22){
    this.nuevoInsumoOcultar = false;
    editProducto.Cantidad = editProducto.Cantidad + cantidad22;
    var total = editProducto.Cantidad * editProducto.preciounit;
    editProducto.total = total;
    var total2 = cantidad22 * editProducto.preciounit;


    grupo.total = grupo.total + total2;
    grupo.totalProductos = grupo.totalProductos + cantidad22;

    var hostorial = {
      Fechacompra: datecompra22,
      proveedor: proveedor2,
      cantidad: cantidad22
    }
    editProducto.hostorial.push(hostorial)
    // console.log(editProducto);
    this.docGrupo.update(grupo);
    this.docproducto.update(editProducto);
    this.inventariotatal();

  }
 cancelarInsumos(){
    this.nuevoInsumoOcultar = false;
  }

}
