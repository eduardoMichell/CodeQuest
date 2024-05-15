import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsweredTracksDialogComponent } from './answered-tracks-dialog.component';

describe('AnsweredTracksDialogComponent', () => {
  let component: AnsweredTracksDialogComponent;
  let fixture: ComponentFixture<AnsweredTracksDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnsweredTracksDialogComponent]
    });
    fixture = TestBed.createComponent(AnsweredTracksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
