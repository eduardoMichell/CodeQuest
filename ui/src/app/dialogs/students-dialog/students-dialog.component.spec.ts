import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsDialogComponent } from './students-dialog.component';

describe('StudentsDialogComponent', () => {
  let component: StudentsDialogComponent;
  let fixture: ComponentFixture<StudentsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsDialogComponent]
    });
    fixture = TestBed.createComponent(StudentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
