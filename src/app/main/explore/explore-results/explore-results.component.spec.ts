import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreResultsComponent } from './explore-results.component';

describe('ExploreResultsComponent', () => {
  let component: ExploreResultsComponent;
  let fixture: ComponentFixture<ExploreResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
