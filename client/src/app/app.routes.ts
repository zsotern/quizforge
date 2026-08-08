import { Routes } from '@angular/router';
import {QuizListComponent} from './features/quiz/pages/quiz-list/quiz-list.component';
import {QuizCreatorComponent} from './features/quiz/pages/quiz-creator/quiz-creator.component';
import {QuizPlayerComponent} from './features/quiz/pages/quiz-player/quiz-player.component';
import {QuizResultComponent} from './features/quiz/pages/quiz-result/quiz-result.component';

export const routes: Routes = [
  { path: '',
    component:QuizListComponent
  },
  { path:'quiz/new',
    component:QuizCreatorComponent
  },
  {
    path:'quiz/:id/edit',
    component:QuizCreatorComponent
  },
  {
    path:'quiz/:id/player',
    component:QuizPlayerComponent
  },
  {
    path: 'quiz/:id/result',
    component:QuizResultComponent
  }
];
