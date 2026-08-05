import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-answer-card',
  imports: [],
  templateUrl: './answer-card.component.html',
  styleUrl: './answer-card.component.scss',
  standalone: true
})
export class AnswerCardComponent {
  @Input() text: string = '';
  @Input() index: number = 0;
  @Input() isSelected: boolean = false;
  @Input() isCorrect: boolean = false;
  @Input() hasAnswered: boolean = false;
  @Input() isLocked: boolean = false;

  @Output() answerSelected: EventEmitter<number> = new EventEmitter();

  get label():string{
    // 65 az 'A' karakter kódja az ASCII táblázatban, 66 a 'B', stb.
    // Ha az indexet (0,1,2,3) hozzáadjuk a 65-höz, pont az A/B/C/D karakterkódokat kapjuk
    return String.fromCharCode(65 + this.index)
  }

  onSelect(): void {
    this.answerSelected.emit(this.index);
  }
}
