import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from '../../../core/services/local-storage.service';
import {IQuiz} from '../../../shared/models/quiz.model';
import {LocalStorageKey} from '../../../core/services/local-storage-key.enum';
import {QuizAttemptService} from './quiz-attempt-service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private storage = inject(LocalStorageService);
  private quizAttemptService = inject(QuizAttemptService);

  getAllQuizzes(): IQuiz[]{
    return this.storage.get<IQuiz[]>(LocalStorageKey.QUIZZES) ?? [];
  }

  getQuizById(id: string): IQuiz | undefined {
    return this.getAllQuizzes().find(q => q.id === id);
  }

  saveQuiz(quiz: IQuiz): void {
    const quizzes = this.getAllQuizzes();
    const index = quizzes.findIndex(q => q.id === quiz.id);

    if(index === -1){
      quizzes.push(quiz);
    } else {
      quizzes[index] = quiz;
    }

    this.storage.set(LocalStorageKey.QUIZZES, quizzes);
  }

  deleteQuizById(id: string){
    const quizzes = this.getAllQuizzes();
    const newQuizzes = quizzes.filter(q => q.id !== id);

    this.storage.set(LocalStorageKey.QUIZZES, newQuizzes);
    this.quizAttemptService.deleteQuizAttemptsById(id);
  }
}
