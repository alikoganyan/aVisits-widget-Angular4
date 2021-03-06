import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {MainComponent} from './layouts/main/main.component';

const appRoutes: Routes = [
  // {path: '', redirectTo: ':widget', pathMatch: 'full'},
  {path: ':widget', component: MainComponent},
  // {path: '**', redirectTo: '/:widget'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,  {useHash: true})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
