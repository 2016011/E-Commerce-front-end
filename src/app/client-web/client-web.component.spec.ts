import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWebComponent } from './client-web.component';

describe('ClientWebComponent', () => {
  let component: ClientWebComponent;
  let fixture: ComponentFixture<ClientWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientWebComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
