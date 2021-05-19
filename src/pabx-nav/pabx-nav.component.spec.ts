import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PabxNavComponent } from './pabx-nav.component';

describe('PabxNavComponent', () => {
  let component: PabxNavComponent;
  let fixture: ComponentFixture<PabxNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PabxNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PabxNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
