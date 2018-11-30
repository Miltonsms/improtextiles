import { Component, Output, EventEmitter,OnInit } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Improtextiles';
  login = false;
  login2 = true;


  constructor(public router: Router) {

  }

  ngOnInit() {
    console.log("prueba");
  }
}