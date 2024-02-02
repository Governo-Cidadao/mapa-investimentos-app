import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';

const routes: Routes = [
  { path: "", component: MapComponent },
  { path: "keyboard", component: KeyboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
