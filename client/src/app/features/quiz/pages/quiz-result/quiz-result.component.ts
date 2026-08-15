import {Component, inject, OnInit} from '@angular/core';
import {QuizAttemptService} from '../../services/quiz-attempt-service';
import {QuizService} from '../../services/quiz-service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { IQuestionResult, IQuiz, IQuizAttempt} from '../../../../shared/models/quiz.model';

@Component({
  selector: 'app-quiz-result',
    imports: [
        RouterLink
    ],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss',
  standalone: true
})
export class QuizResultComponent implements OnInit {
  private quizService = inject(QuizService);
  private quizAttemptService = inject(QuizAttemptService);
  private activatedRoute = inject(ActivatedRoute);

  quizAttempt: IQuizAttempt | undefined;
  quizId: string | undefined;
  quiz: IQuiz | undefined;
  sortedRes: IQuestionResult[] = [];
  quizTitle : string | undefined;
  total: number = 0;

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    const foundQuizAttempt = this.quizAttemptService.getQuizAttemptById(id);
    console.log(foundQuizAttempt);
    if (foundQuizAttempt) {
      this.quizAttempt = foundQuizAttempt;
      this.quizId = foundQuizAttempt.quizId;
      this.quiz = this.quizService.getQuizById(this.quizId);
      this.quizTitle = this.quiz?.title;
    }
    this.getSortResult();
    this.total = this.quizAttempt?.questionResults.length ?? 0;
  }

  getTime(): string {
    const start = this.quizAttempt?.start;
    const finish = this.quizAttempt?.finish;

    if (start && finish) {
      const totalMs = finish - start;

      // A teljes eltelt másodpercek száma: ms / 1000, lefelé kerekítve
      const totalSeconds = Math.floor(totalMs / 1000);

      // Ebből hány TELJES perc fér bele: másodpercek / 60, megint lefelé kerekítve
      const minutes = Math.floor(totalSeconds / 60);

      // A "maradék" másodperc, ami a percek levonása UTÁN marad
      // (a % a maradékos osztás operátora: pl. 134 % 60 = 14)
      const seconds = totalSeconds % 60;

      // padStart(2, '0'): ha a szám 1 jegyű (pl. "5"), kiegészíti "05"-re
      // Így sosem lesz "2:5", mindig "2:05" formátum
      const secondsFormatted = seconds.toString().padStart(2, '0');

      console.log(`${minutes}:${secondsFormatted}`)
      return `${minutes}:${secondsFormatted}`;
    }

    return '0:00';
  }

  getScore() {
    const correctCount = this.getCorrectAnswerCount();

    if (this.total === 0) {
      return 0;
    } else {
      return Math.floor(correctCount / this.total * 100);
    }
  }

  getCorrectAnswerCount() {
    return this.quizAttempt?.questionResults?.filter(r => r.isCorrect).length ?? 0;
  }

  getWrongAnswerCount() {
    return this.quizAttempt?.questionResults?.filter(r => !r.isCorrect).length ?? 0;
  }

  getResultSummary(result: IQuestionResult) {
    const question = this.quiz?.questions.find(question => question.id === result.questionId);

    const chosenAnswer = question?.answers.find(answer => answer.id === result.answerId);
    const correctAnswer = question?.answers.find(answer => answer.id === question.correctAnswerIds[0]);

    const explanation = question?.explanation;
    return {
      questionText: question?.text,
      chosenAnswerText: chosenAnswer?.text,
      correctAnswerText: correctAnswer?.text,
      explanation: explanation
    };
  }

  getSortResult() {
    this.sortedRes = [...this.quizAttempt?.questionResults ?? []].sort((a, b) => Number(a.isCorrect) - Number(b.isCorrect));
  }
}
