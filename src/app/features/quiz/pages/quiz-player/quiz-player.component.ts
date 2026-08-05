import {Component, inject, OnInit} from '@angular/core';
import {QuizService} from '../../services/quiz-service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {IAnswer, IQuestion, IQuestionResult, IQuiz, IQuizAttempt} from '../../../../shared/models/quiz.model';
import {FormsModule} from '@angular/forms';
import {QuizAttemptService} from '../../services/quiz-attempt-service';
import {AnswerCardComponent} from '../../components/answer-card/answer-card.component';
import {Shuffle} from '../../../../shared/utils/shuffle';

@Component({
  selector: 'app-quiz-player',
  imports: [
    FormsModule,
    RouterLink,
    AnswerCardComponent
  ],
  templateUrl: './quiz-player.component.html',
  styleUrl: './quiz-player.component.scss',
  standalone: true
})
export class QuizPlayerComponent implements OnInit {
  private quizService = inject(QuizService);
  private quizAttemptService = inject(QuizAttemptService);
  private activatedRoute = inject(ActivatedRoute);
  private shuffle = inject(Shuffle);

  quizTitle = '';
  questionIndex = 0;
  actualQuestion: IQuestion | undefined;
  quiz: IQuiz | undefined;

  chosenAnswerIdx: number | null = null;

  questionResult: IQuestionResult[] = [];
  protected attemptId = crypto.randomUUID();
  private startedAt = Date.now();

  shuffledQuestions: IQuestion[] = [];

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      let foundQuiz = this.quizService.getQuizById(id);
      if (foundQuiz) {
        this.quizTitle = foundQuiz.title;
        this.shuffledQuestions = this.getShuffleQuestion([...foundQuiz.questions ?? []]);

        foundQuiz.questions = this.shuffledQuestions;
        this.quiz = foundQuiz;

        this.updateCurrentQuestion();
      }
    }
  }

  nextQuestion() {
    this.saveCurrentQuestionResult();
    this.questionIndex++;
    this.chosenAnswerIdx = null;
    this.updateCurrentQuestion();
  }

  isAnswerCorrect(answer: IAnswer): boolean {
    return this.actualQuestion?.correctAnswerIds.includes(answer.id) ?? false;
  }

  hasAnswered(): boolean {
    return this.chosenAnswerIdx !== null;
  }

  isSelectedAnswerCorrect(): boolean {
    if (this.chosenAnswerIdx != null) {
      const selectedId = this.actualQuestion?.answers[this.chosenAnswerIdx].id;
      if (selectedId) {
        if (this.actualQuestion?.correctAnswerIds.includes(selectedId)) {
          return true;
        }
      }
    }
    return false;
  }

  updateCurrentQuestion() {
    this.actualQuestion = this.quiz?.questions[this.questionIndex];
    if (this.actualQuestion) {
      this.actualQuestion.answers = this.getShuffleAnswer([...this.actualQuestion.answers]);
    }
  }

  saveCurrentQuestionResult() {
    if (this.actualQuestion && this.chosenAnswerIdx !== null) {
      const questionRes: IQuestionResult = {
        questionId: this.actualQuestion.id,
        answerId: this.actualQuestion.answers[this.chosenAnswerIdx].id,
        isCorrect: this.isSelectedAnswerCorrect()
      }
      const index = this.questionResult.findIndex(q => q.questionId === questionRes.questionId);
      if(index != -1) {
        this.questionResult[index]= questionRes;
      } else{
        this.questionResult.push(questionRes);
      }
    }
  }

  finishQuiz() {
    this.saveCurrentQuestionResult();
    if (this.quiz != null) {
      const quizA: IQuizAttempt = {
        id: this.attemptId,
        quizId: this.quiz?.id,
        questionResults: this.questionResult,
        start: this.startedAt,
        finish: Date.now(),
      }
      this.quizAttemptService.saveQuizAttempt(quizA);
    }
  }

  getShuffleQuestion(arr: IQuestion[]):IQuestion[] {
    return this.shuffle.fisherYatesShuffleAlg(arr)

  }

  getShuffleAnswer(arr: IAnswer[]):IAnswer[] {
    return this.shuffle.fisherYatesShuffleAlg(arr)
  }

  forwardQuestion() {
    this.saveCurrentQuestionResult();
    this.questionIndex--;
    this.chosenAnswerIdx = null;
    this.updateCurrentQuestion();
  }

  isAllowBackTrack() {
    return this.quiz?.allowBacktrack;
  }
}
