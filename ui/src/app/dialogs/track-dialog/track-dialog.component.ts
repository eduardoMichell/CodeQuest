import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GameService } from 'src/app/services/game-service/game.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css']
})
export class TrackDialogComponent implements OnInit {
  trackForm!: FormGroup;
  isEdit: boolean;

  difficulties = ['Iniciante', 'Intermediário', 'Avançado'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TrackDialogComponent>,
    private gameService: GameService,
    private utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.trackForm = this.fb.group({
      theme: [this.data.track?.theme || '', Validators.required],
      difficulty: [this.data.track?.difficulty || '', Validators.required],
      createdBy: [this.data.track?.createdBy || ''],
      phases: this.fb.array([])
    });

    if (this.isEdit && this.data.track) {
      this.loadTrack(this.data.track);
    } else {
      this.initializePhases();
    }
  }

  initializePhases(): void {
    for (let i = 0; i < 5; i++) {
      const phase = this.fb.group({
        gameId: [''],
        questions: this.fb.array([])
      });

      for (let j = 0; j < 5; j++) {
        const question = this.fb.group({
          question: ['', Validators.required],
          alternatives: this.fb.array([]),
          correct: [null, Validators.required],
          time: [null, Validators.required],
          rate: [null, Validators.required],
          phaseId: ['']
        });

        const alternativesArray = question.get('alternatives') as FormArray;
        for (let k = 0; k < 4; k++) {
          alternativesArray.push(this.fb.control('', Validators.required));
        }

        (phase.get('questions') as FormArray).push(question);
      }

      (this.trackForm.get('phases') as FormArray).push(phase);
    }
  }

  loadTrack(track: any): void {
    this.trackForm.patchValue({
      theme: track.theme,
      difficulty: track.difficulty,
      createdBy: track.createdBy
    });

    const phasesArray = this.trackForm.get('phases') as FormArray;
    track.phases.forEach((phase: any, i: number) => {
      const phaseGroup = this.fb.group({
        gameId: [phase.gameId],
        questions: this.fb.array([])
      });

      const questionsArray = phaseGroup.get('questions') as FormArray;
      phase.questions.forEach((question: any) => {
        const questionGroup = this.fb.group({
          question: [question.question, Validators.required],
          alternatives: this.fb.array([]),
          correct: [question.answer, Validators.required],
          time: [question.time, Validators.required],
          rate: [question.rate, Validators.required],
          phaseId: [question.phaseId]
        });

        const alternativesArray = questionGroup.get('alternatives') as FormArray;
        question.options.forEach((alternative: string) => {
          alternativesArray.push(this.fb.control(alternative, Validators.required));
        });

        questionsArray.push(questionGroup);
      });

      phasesArray.push(phaseGroup);
    });
  }

  get phases(): FormArray {
    return this.trackForm.get('phases') as FormArray;
  }

  getQuestions(phaseIndex: number): FormArray {
    return this.phases.at(phaseIndex).get('questions') as FormArray;
  }

  getAlternatives(phaseIndex: number, questionIndex: number): FormArray {
    return this.getQuestions(phaseIndex).at(questionIndex).get('alternatives') as FormArray;
  }

  onSubmit(): void {
    if (this.trackForm.valid) {
      const formValue = this.trackForm.value;

      const game = {
        theme: formValue.theme,
        difficulty: formValue.difficulty,
        createdBy: formValue.createdBy,
        phases: formValue.phases.map((phase: any) => ({
          gameId: phase.gameId,
          questions: phase.questions.map((question: any) => ({
            question: question.question,
            options: question.alternatives,
            answer: question.correct,
            time: question.time,
            rate: question.rate,
            phaseId: question.phaseId
          }))
        }))
      };

      this.dialogRef.close(game);
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }

  delete() {
    this.gameService.deleteTrack(this.data.track._id).subscribe(
      response => {
        this.utils.showMessage("A trilha foi deletada com sucesso!")
        window.location.reload();
      },
      error => {
        this.utils.showMessage("Falha ao deletar a trilha")
      }
    );
  }
}
