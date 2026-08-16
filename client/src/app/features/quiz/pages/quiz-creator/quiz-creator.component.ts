import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {IQuestion, IQuiz} from '../../../../shared/models/quiz.model';
import {QuizService} from '../../services/quiz-service';
import {QuestionEditorComponent} from '../../components/question-editor/question-editor.component';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-quiz-creator',
    imports: [
        ReactiveFormsModule,
        QuestionEditorComponent,
        RouterLink
    ],
  templateUrl: './quiz-creator.component.html',
  styleUrl: './quiz-creator.component.scss',
  standalone: true
})

export class QuizCreatorComponent implements OnInit{
  private formBuilder = inject(FormBuilder);
  private quizService = inject(QuizService);
  private quizId: string = crypto.randomUUID();

  questions: IQuestion[] = [];
  quizTitle = this.formBuilder.control('',{nonNullable: true, validators: [Validators.required]});

  private createdAt = Date.now()

  activatedRoute = inject(ActivatedRoute);

  allowBackTrack = false;

  selectedQuestion: IQuestion | undefined;

  quizTitleLabel: string = '';
  selectedQuiz: IQuiz | undefined;

  saveQuiz(): void {
    if(this.questions.length !== 0){
      if(this.quizTitle.invalid){
        this.quizTitle.setValue("Névtelen Quiz");
      }

      const quiz: IQuiz = {
        id: this.quizId,
        title: this.quizTitle.value,
        questions: this.questions,
        createdAt: this.createdAt,
        allowBacktrack: this.allowBackTrack
      };

      this.quizService.saveQuiz(quiz);
      this.selectedQuestion = undefined;
    }else{
      this.quizService.deleteQuizById(this.quizId);
      alert("Ez az utolsó kérdés — a kvíz teljesen törlődik!");
      this.quizTitle.reset();
    }
  }

  questionSaved($event: IQuestion) {
    const index = this.questions.findIndex((x) => x.id === $event.id);
    if(index > -1){
      this.questions[index] = $event
    }else{
      this.questions.push($event);
    }
    this.selectedQuestion = undefined;
    this.saveQuiz();
  }

  deleteQuestion(id: string){
    let confirmed = confirm('Biztosan törlöd a kérdést?');
    if(confirmed){
      this.questions = this.questions.filter((x) => x.id !== id)
      this.selectedQuestion = undefined;
      this.saveQuiz();
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    if (id){
      const quiz = this.quizService.getQuizById(id);

      if (quiz) {
          this.quizId = id;
          this.quizTitle.setValue(quiz.title ?? '');
          this.quizTitleLabel = quiz.title;
          this.selectedQuiz = quiz;

          if(quiz.questions && quiz.questions.length !== 0){
            this.questions = quiz.questions;
          }

          this.createdAt = quiz.createdAt;

        } else {
          this.quizId = crypto.randomUUID();
        }
    }
  }

  toggleBackTrack(){
    this.allowBackTrack = !this.allowBackTrack;
  }

  selectQuestion(question: IQuestion) {
    this.selectedQuestion = question;
  }
}
