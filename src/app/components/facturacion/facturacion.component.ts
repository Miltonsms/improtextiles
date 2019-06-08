import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// clientes
export interface ClienteIndividual { nombres: string;}
export interface  ClienteIndividualId extends ClienteIndividual { id: string; }
//cleinte indistrial
export interface ClienteIndustrial { nombre:string }
export interface  ClienteIndustrialId extends ClienteIndustrial { id: string; }

//factura
export interface Factura {
  numeroF: string;
  dateRegistro:string,
  nombreC:string,
  NitC:string,
  DireccionC:string,
  TelenfoC: string,
  Productos:any,
  Pagofinalizado: boolean,
  tipoPago:string,
  historialPagos:any,
  totalParcial:number,
  total:number,
  Vendedor:string
}
export interface  FacturaId extends Factura { id: string; }
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styles: []
})
export class FacturacionComponent implements OnInit {
NombreUsuario = localStorage.getItem('NombreUsuario');
filtroPago = true;
facturavista = true;
historialvista= false;
//cliente
private clienteCollection: AngularFirestoreCollection<ClienteIndividual>;
clientes: Observable<ClienteIndividualId[]>;
//cliente industrial
private clienteindustrialCollection: AngularFirestoreCollection<ClienteIndustrial>;
clientesindustrial: Observable<ClienteIndustrialId[]>;
//variables para prductos
  Productos=[];
  nombreA = "";
  Cantidad = "";
  Precio= "";
  total:number;
  //facturacion
  private facturaCollection: AngularFirestoreCollection<Factura>;
  facturas: Observable<FacturaId[]>;
  //arrego para agregar nuevo factura
  nuevoFactura: Factura = {
    numeroF: "",
    dateRegistro: "",
    nombreC: "",
    NitC: "",
    DireccionC: "",
    TelenfoC: "",
    Productos: null,
    Pagofinalizado: null,
    tipoPago: "",
    historialPagos:null,
    totalParcial:0,
    total:0,
    Vendedor: ""
  };

  editar = true;
  docFactura: AngularFirestoreDocument<Factura>;
  editFactura: Observable<Factura>;
  query: string;

// cliente
  nombreC: string;
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
    //cliente industrial
    this.clienteindustrialCollection = afs.collection<ClienteIndustrial>('clienteindus');
    this.clientesindustrial = this.clienteindustrialCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ClienteIndustrial;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    // facturas
    this.facturaCollection = afs.collection<Factura>('factura');
    this.facturas = this.facturaCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Factura;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    
   }

  ngOnInit() {
    this.totalFactura();
    this.nuevoFactura.Vendedor = this.NombreUsuario; 

  }
  agregaroProducto(nombreA,Cantidad,Precio){
    var sub = Precio*Cantidad;

    var producto={
      Articulo: nombreA,
      Cantidad: Cantidad,
      Precio: Precio,
      SubTotal: sub
    }
    this.Productos.push(producto)
    console.log(this.Productos);
    this.nombreA = "";
    this.Cantidad = "";
    this.Precio= "";

    this.totalFactura();
  }
  DatosClientes(even){
    // this.nombreC =even.split(",", 1);;
    var campos = even.split(",");
    var ultima = campos[campos.length - 1];
    this.nuevoFactura.nombreC = campos[campos.length - 4];
    this.nuevoFactura.NitC = campos[campos.length - 3];
    this.nuevoFactura.DireccionC =campos[campos.length - 2];
    this.nuevoFactura.TelenfoC =campos[campos.length - 1];
    console.log(even,"milton",ultima);

  }
  totalFactura(){
        //Calculamos el TOTAL 
        this.total = this.Productos.reduce((
          acc,
          obj,
        ) => acc + (obj.Precio * obj.Cantidad),
        0);
        console.log("Total: ", this.total)
  }
  addFacturaValidaciones(factura: Factura) {
    console.log("tipo de pago",factura.tipoPago);
    factura.Productos = this.Productos;
    factura.total = this.total;
    if(factura.tipoPago == "contado"){
      factura.Pagofinalizado = true;
      this.addFacturas(factura);
    }else{
      factura.Pagofinalizado = false;
      this.addFacturas(factura);
    }
    console.log(factura);
    this.nuevoFactura = {
      numeroF: "",
      dateRegistro: "",
      nombreC: "",
      NitC: "",
      DireccionC: "",
      TelenfoC: "",
      Productos: null,
      Pagofinalizado: null,
      tipoPago: "",
      historialPagos:null,
      totalParcial:0,
      total:0,
      Vendedor: ""
    };
    this.Productos=[];
    this.total = 0;
  }
  addFacturas(factura){
    this.facturaCollection.add(factura);
  }
  vistaFactura(){
    this.facturavista = true;
    this.historialvista= false;
  }
  vistaHistorial(){
    this.facturavista = false;
    this.historialvista= true;
  }
  verFactura(factura) {
    // console.log(cliente);
    this.docFactura = this.afs.doc(`factura/${factura.id}`);
    console.log(this.docFactura,"docFactura");
    
    this.editFactura=this.docFactura.valueChanges()
    console.log("edit cliente",this.editFactura);
    this.editar = true;
  }
  DeleteProduct(id){
    this.Productos.splice(id, 1);
    this.totalFactura();
  }
}
