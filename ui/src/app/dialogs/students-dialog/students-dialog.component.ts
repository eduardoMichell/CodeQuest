import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateStudentsDialogComponent } from '../create-students-dialog/create-students-dialog.component';
import { ExcelReaderService } from 'src/app/services/excel-reader-service/excel-reader.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-students-dialog',
  templateUrl: './students-dialog.component.html',
  styleUrls: ['./students-dialog.component.css']
})
export class StudentsDialogComponent implements OnInit {
  students: any[] = [];

  displayedColumns: string[] = ['enrollment', 'name', 'totalScore'];
 
  constructor(public dialogRef: MatDialogRef<StudentsDialogComponent>,
    private excelReaderService: ExcelReaderService,
    private userService: UserService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.userService.getStudents().subscribe(
      response => {
        this.students = response.result;
      },
      error => {
        console.error('Error fetching students:', error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  generateReport(): void {
    this.userService.getStudentReport().subscribe(
      response => {
        if (response.error) {
          console.error('Erro ao gerar relatório:', response.message);
          return;
        }
        this.createPDF(response.result);
      },
      error => {
        console.error('Erro ao buscar relatório:', error);
      }
    );
  }

  createPDF(studentReports: any[]): void {
    const doc = new jsPDF();

    doc.text('Relatório de Alunos', 10, 10);

    autoTable(doc, {
      startY: 20,
      head: [['Matrícula', 'Nome', 'Email', 'Total de Trilhas', 'Total de Perguntas', 'Respostas Corretas', 'Respostas Incorretas']],
      body: studentReports.map(student => [
        student.enrollment,
        student.name,
        student.email,
        student.totalTracks,
        student.totalQuestions,
        student.totalCorrectAnswers,
        student.totalIncorrectAnswers
      ]),
      theme: 'striped',
      headStyles: { fillColor: [255, 133, 51] }

    });

    doc.save('relatorio-alunos.pdf');
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
        this.userService.addStudents(students).subscribe(
          response => {
            if (response.error) {
              this.utils.showMessage("Alguns alunos não foram registrados com sucesso", true);
            } else {
              this.utils.showMessage("Todos os alunos foram adicionados com sucesso");
            }
            this.onClose();
          },
          error => {
            this.utils.showMessage("Erro ao adicionar aluno", true);
          }
        );
      }
    });
  }
}