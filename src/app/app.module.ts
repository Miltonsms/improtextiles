import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { ClientsComponent } from './components/clients/clients.component';
import { RrhhComponent } from './components/rrhh/rrhh.component';
import { LoginComponent } from './components/login/login.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchPipe } from './search.pipe';
import { ClienteIndustrialComponent } from './components/cliente-industrial/cliente-industrial.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    ProvidersComponent,
    ClientsComponent,
    RrhhComponent,
    LoginComponent,
    SearchPipe,
    ClienteIndustrialComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AppRoutingModule,
    FormsModule,
    Ng2SearchPipeModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
