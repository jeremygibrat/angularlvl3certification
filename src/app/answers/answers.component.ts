import {Component, Input} from '@angular/core';
import {Results} from '../data.models';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html'
})
export class AnswersComponent {

  @Input()
  data!: Results;

}
