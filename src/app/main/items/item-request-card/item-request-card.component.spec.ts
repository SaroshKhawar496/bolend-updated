import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequestCardComponent } from './item-request-card.component';

describe('ItemRequestCardComponent', () => {
  let component: ItemRequestCardComponent;
  let fixture: ComponentFixture<ItemRequestCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRequestCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
