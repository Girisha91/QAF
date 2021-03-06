import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItemComponent } from './purchase-item.component';

describe('UpdateEmployeeComponent', () => {
  let component: PurchaseItemComponent;
  let fixture: ComponentFixture<PurchaseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
