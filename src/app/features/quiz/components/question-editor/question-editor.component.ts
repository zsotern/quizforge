import {Component, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {IAnswer, IQuestion} from '../../../../shared/models/quiz.model';

@Component({
  selector: 'app-question-editor',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './question-editor.component.html',
  styleUrl: './question-editor.component.scss',
  standalone: true
})
export class QuestionEditorComponent implements OnChanges{
  @Input() questionToEdit: IQuestion | undefined;
  @Output() questionSaved: EventEmitter<IQuestion> = new EventEmitter();

  private formBuilder = inject(FormBuilder);

  questionForm = this.formBuilder.group({
    text: this.formBuilder.control('', {nonNullable: true, validators: [Validators.required]}),
    answers: this.formBuilder.array([
      this.createAnswerControl(),
      this.createAnswerControl(),
      this.createAnswerControl(),
      this.createAnswerControl(),
    ]),
    correctAnswerIndex: this.formBuilder.control<number | null>(null, {validators: [Validators.required]}),
    explanation: this.formBuilder.control('')
  });

  private createAnswerControl(){
    return this.formBuilder.control('', {nonNullable: true, validators: [Validators.required]});
  }

  onSubmit(): void {
    if(this.questionForm.invalid){
      this.questionForm.markAllAsTouched();
      return;
    }
    const formValue= this.questionForm.getRawValue();
    const answers : IAnswer[]= formValue.answers.map(text=>({
      id: crypto.randomUUID(),
      text,
    }));

    const correctAnswer = answers[formValue.correctAnswerIndex!];

    const newQuestion: IQuestion = {
      id: this.questionToEdit?.id ?? crypto.randomUUID(),
      text: formValue.text,
      answers,
      correctAnswerIds: [correctAnswer.id],
      explanation: formValue.explanation ? formValue.explanation : undefined,
    };

    this.questionForm.reset();
    this.questionSaved.emit(newQuestion)
  }

  getKey(index:number):string{
    // 65 az 'A' karakter kódja az ASCII táblázatban, 66 a 'B', stb.
    // Ha az indexet (0,1,2,3) hozzáadjuk a 65-höz, pont az A/B/C/D karakterkódokat kapjuk
    return String.fromCharCode(65 + index)
  }

  ngOnChanges(){
    if(this.questionToEdit){
      const index = this.questionToEdit.answers.findIndex(q => q.id === this.questionToEdit?.correctAnswerIds[0]);
      this.questionForm.patchValue({
        text: this.questionToEdit.text,
        answers: this.questionToEdit.answers.map(answer=>answer.text),
        correctAnswerIndex: index,
        explanation: this.questionToEdit.explanation
      });
    } else{
      this.questionForm.reset();
    }
  }

}
