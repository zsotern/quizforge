import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from '../../../core/services/local-storage.service';
import {IQuizAttempt} from '../../../shared/models/quiz.model';
import {LocalStorageKey} from '../../../core/services/local-storage-key.enum';

@Injectable({
  providedIn: 'root'
})

export class QuizAttemptService {
  private storage = inject(LocalStorageService);

  getAllQuizAttempts(): IQuizAttempt[]{
    return this.storage.get<IQuizAttempt[]>(LocalStorageKey.QUIZ_ATTEMPTS) ?? [];
  }

  getQuizAttemptById(id: string): IQuizAttempt | undefined {
    return this.getAllQuizAttempts().find(q => q.id === id);
  }

  saveQuizAttempt(quizAttempt: IQuizAttempt): void {
    const quizAttempts = this.getAllQuizAttempts();
    const index = quizAttempts.findIndex(q => q.id === quizAttempt.id);

    if(index === -1){
      quizAttempts.push(quizAttempt);
    } else {
      quizAttempts[index] = quizAttempt;
    }

    this.storage.set(LocalStorageKey.QUIZ_ATTEMPTS, quizAttempts);
  }

  deleteQuizAttemptsById(quizId: string){
    const quizAttempts = this.getAllQuizAttempts();
    const newQuizAttempt = quizAttempts.filter(q => q.quizId !== quizId);

    this.storage.set(LocalStorageKey.QUIZ_ATTEMPTS, newQuizAttempt);
  }
}
