import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreatorComponent } from './quiz-creator.component';

describe('QuizCreator', () => {
  let component: QuizCreatorComponent;
  let fixture: ComponentFixture<QuizCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCreatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizCreatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
