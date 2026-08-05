import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerCardComponent } from './answer-card.component';

describe('AnswerCard', () => {
  let component: AnswerCardComponent;
  let fixture: ComponentFixture<AnswerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
