import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { UserComponent } from './components/user/user.component';
import { ClientsComponent } from './components/clients/clients.component';
import { RrhhComponent } from './components/rrhh/rrhh.component';

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "providers", component: ProvidersComponent},
  {path: "user", component: UserComponent},
  {path: "clients", component: ClientsComponent},
  {path: "rrhh", component: RrhhComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
