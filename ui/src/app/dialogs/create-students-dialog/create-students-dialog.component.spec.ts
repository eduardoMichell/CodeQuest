import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentsDialogComponent } from './create-students-dialog.component';

describe('CreateStudentsDialogComponent', () => {
  let component: CreateStudentsDialogComponent;
  let fixture: ComponentFixture<CreateStudentsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateStudentsDialogComponent]
    });
    fixture = TestBed.createComponent(CreateStudentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
