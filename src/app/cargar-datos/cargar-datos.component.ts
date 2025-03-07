import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cargar-datos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cargar-datos.component.html',
  styleUrl: './cargar-datos.component.css',
})
export class CargarDatosComponent {
  @ViewChild('formularioInsertar') formularioInsertar!: ElementRef;
  @ViewChild('formularioEditar') formularioEditar!: ElementRef;

  url: string = '';
  platos: Plato[] = [];
  platosFiltrados: Plato[] = [];
  datosCargados: boolean = false;
  platoEditando: Plato | null = null;
  mostrarFormularioInsertar: boolean = false;
  nuevoPlato: Plato = {
    id: 0,
    nombre: '',
    tipo: '',
    precio: 0,
    disponible: true,
    descripcion: '',
    calorias: 0,
    preparacion: 0,
  };
  filtroCriterio: string = 'id';
  filtroValor: string = '';

  constructor(private http: HttpClient) {}

  async cargarDatos() {
    if (!this.url) {
      alert('Por favor, introduce una URL válida.');
      return;
    }

    try {
      const response = await this.http.get<Plato[]>(this.url).toPromise();
      this.platos = response || [];
      this.platosFiltrados = this.platos;
      this.datosCargados = true;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      alert(`Error al cargar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  aplicarFiltro() {
    if (this.filtroCriterio && this.filtroValor) {
      this.platosFiltrados = this.platos.filter((plato) => {
        if (this.filtroCriterio === 'disponible') {
          return plato.disponible === (this.filtroValor.toLowerCase() === 'sí');
        } else {
          const valor = plato[this.filtroCriterio as keyof Plato].toString().toLowerCase();
          return valor.includes(this.filtroValor.toLowerCase());
        }
      });
    } else {
      this.platosFiltrados = this.platos;
    }
  }

  abrirFormularioInsertar() {
    this.mostrarFormularioInsertar = true;
    setTimeout(() => {
      this.formularioInsertar.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  cerrarFormularioInsertar() {
    this.mostrarFormularioInsertar = false;
    this.nuevoPlato = {
      id: 0,
      nombre: '',
      tipo: '',
      precio: 0,
      disponible: true,
      descripcion: '',
      calorias: 0,
      preparacion: 0,
    };
  }

  async guardarNuevoPlato() {
    if (!this.nuevoPlato) {
      alert('Error: No se puede guardar un plato vacío.');
      return;
    }

    try {
      const response = await lastValueFrom(this.http.post<Plato>(this.url, this.nuevoPlato));
      this.platos.push(response);
      this.platosFiltrados = this.platos;
      this.cerrarFormularioInsertar();
      alert('Plato insertado correctamente.');
    } catch (error) {
      console.error('Error al insertar el plato:', error);
      alert('Error al insertar el plato.');
    }
  }

  editarPlato(plato: Plato) {
    this.platoEditando = { ...plato };
    setTimeout(() => {
      this.formularioEditar.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  async guardarCambios() {
    if (this.platoEditando) {
      try {
        const updateUrl = `${this.url}/${this.platoEditando.id}`;
        await this.http.put(updateUrl, this.platoEditando).toPromise();

        const index = this.platos.findIndex((p) => p.id === this.platoEditando!.id);
        if (index !== -1) {
          this.platos[index] = { ...this.platoEditando };
        }

        this.platoEditando = null;
        alert('Plato actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar el plato:', error);
        alert('Error al actualizar el plato.');
      }
    }
  }

  cancelarEdicion() {
    this.platoEditando = null;
  }

  async eliminarPlato(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este plato?')) {
      try {
        const deleteUrl = `${this.url}/${id}`;
        await this.http.delete(deleteUrl).toPromise();

        this.platos = this.platos.filter((plato) => plato.id !== id);
        this.platosFiltrados = this.platos;
        alert('Plato eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar el plato:', error);
        alert('Error al eliminar el plato.');
      }
    }
  }
}

interface Plato {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
  disponible: boolean;
  descripcion: string;
  calorias: number;
  preparacion: number;
}