import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishDialogComponent } from './finish-dialog.component';

describe('FinishDialogComponent', () => {
  let component: FinishDialogComponent;
  let fixture: ComponentFixture<FinishDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinishDialogComponent]
    });
    fixture = TestBed.createComponent(FinishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
