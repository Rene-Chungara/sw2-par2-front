import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaEntradaComponent } from './nota-entrada.component';

describe('NotaEntradaComponent', () => {
  let component: NotaEntradaComponent;
  let fixture: ComponentFixture<NotaEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaEntradaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotaEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
