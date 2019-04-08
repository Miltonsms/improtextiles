import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteIndustrialComponent } from './cliente-industrial.component';

describe('ClienteIndustrialComponent', () => {
  let component: ClienteIndustrialComponent;
  let fixture: ComponentFixture<ClienteIndustrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteIndustrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
