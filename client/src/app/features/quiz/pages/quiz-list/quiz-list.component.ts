import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {QuizService} from '../../services/quiz-service';
import {IQuiz} from '../../../../shared/models/quiz.model';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  imports: [
    RouterLink, DatePipe
  ],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss',
  standalone: true
})
export class QuizListComponent implements OnInit {
  private quizService = inject(QuizService);
  @ViewChild('scrollList') scrollList!: ElementRef<HTMLUListElement>;

  quizzes : IQuiz[] = [];

  ngOnInit(): void {
    this.quizzes = this.quizService.getAllQuizzes();
  }

  deleteQuiz(quizId: string){
    let confirmed = confirm('Biztosan törlöd a quizt?');
    if(confirmed){
      this.quizService.deleteQuizById(quizId);
      this.quizzes = this.quizService.getAllQuizzes();
    }
  }

  scrollLeft() {
    this.scrollList.nativeElement.scrollBy({ left: -250 });
  }

  scrollRight() {
    this.scrollList.nativeElement.scrollBy({left: 250});
  }
}
