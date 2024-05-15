import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTracksComponent } from './view-tracks.component';

describe('ViewTracksComponent', () => {
  let component: ViewTracksComponent;
  let fixture: ComponentFixture<ViewTracksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTracksComponent]
    });
    fixture = TestBed.createComponent(ViewTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
