import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreTagsComponent } from './explore-tags.component';

describe('ExploreTagsComponent', () => {
  let component: ExploreTagsComponent;
  let fixture: ComponentFixture<ExploreTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
