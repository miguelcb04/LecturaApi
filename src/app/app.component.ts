import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CargarDatosComponent } from './cargar-datos/cargar-datos.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CargarDatosComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lecturaApiAngular';
}
