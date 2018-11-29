import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreGenericComponent } from './explore-generic.component';

describe('ExploreGenericComponent', () => {
  let component: ExploreGenericComponent;
  let fixture: ComponentFixture<ExploreGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
