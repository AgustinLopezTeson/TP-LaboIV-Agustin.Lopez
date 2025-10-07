import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encuenta } from './encuesta';

describe('Encuesta', () => {
  let component: Encuenta;
  let fixture: ComponentFixture<Encuenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encuenta],
    }).compileComponents();

    fixture = TestBed.createComponent(Encuenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
