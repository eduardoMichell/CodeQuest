import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateStudentsDialogComponent } from '../create-students-dialog/create-students-dialog.component';
import { ExcelReaderService } from 'src/app/services/excel-reader-service/excel-reader.service';

@Component({
  selector: 'app-students-dialog',
  templateUrl: './students-dialog.component.html',
  styleUrls: ['./students-dialog.component.css']
})
export class StudentsDialogComponent implements OnInit {
  displayedColumns: string[] = ['enrollment', 'name', 'totalScore'];
  students = new MatTableDataSource<any>([
    { enrollment: '12345', name: 'João Silva', totalScore: 1500 },
    { enrollment: '67890', name: 'Maria Oliveira', totalScore: 1700 },
    // Adicione mais alunos conforme necessário
  ]);

  constructor(public dialogRef: MatDialogRef<StudentsDialogComponent>,
    private excelReaderService: ExcelReaderService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  generateReport(): void {
    // Lógica para gerar relatório em PDF
    console.log('Gerar Relatório');
  }

  downloadTemplate(): void {
    const link = document.createElement('a');
    link.href = 'assets/xlsx/students-template.xlsx';
    link.download = 'students-template.xlsx';
    link.click();
  }

  addStudent(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const data = await this.excelReaderService.readExcel(file);
        const students = data.slice(1).filter((row: any[]) => row[0] && row[1]).map((row: any[]) => ({
          enrollment: row[0],
          name: row[1],
          email: row[2] || 0,
          add: true
        }));

        this.openAddStudentsDialog(students);
      }
    };
    input.click();
  }

  openAddStudentsDialog(students: any[]): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(CreateStudentsDialogComponent, {
      width: '800px',
      data: { students }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Alunos a serem adicionados:', result);
      }
    });
  }
}

 