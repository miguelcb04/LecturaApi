import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarDatosComponent } from './cargar-datos.component';

describe('CargarDatosComponent', () => {
  let component: CargarDatosComponent;
  let fixture: ComponentFixture<CargarDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
