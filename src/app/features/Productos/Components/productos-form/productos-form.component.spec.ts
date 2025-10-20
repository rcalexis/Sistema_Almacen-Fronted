import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosFormComponent } from './productos-form.component';

describe('ProductosFormComponent', () => {
  let component: ProductosFormComponent;
  let fixture: ComponentFixture<ProductosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
