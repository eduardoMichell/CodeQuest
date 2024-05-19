import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-students-dialog',
  templateUrl: './create-students-dialog.component.html',
  styleUrls: ['./create-students-dialog.component.css']
})
export class CreateStudentsDialogComponent implements OnInit {
  displayedColumns: string[] = ['enrollment', 'name', 'add'];
  students = new MatTableDataSource<any>(this.data.students);

  constructor(
    public dialogRef: MatDialogRef<CreateStudentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { students: any[] }
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  onAddStudents(): void {
    const selectedStudents = this.students.data.filter(student => student.add);
    this.dialogRef.close(selectedStudents);
  }
}
 