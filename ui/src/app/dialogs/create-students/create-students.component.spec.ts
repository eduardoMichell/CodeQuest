import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentsComponent } from './create-students.component';

describe('CreateStudentsComponent', () => {
  let component: CreateStudentsComponent;
  let fixture: ComponentFixture<CreateStudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateStudentsComponent]
    });
    fixture = TestBed.createComponent(CreateStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
