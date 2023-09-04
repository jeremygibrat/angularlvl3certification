import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  @Input()
  questions: Question[] | null = [];

  @Input()
  altQuestions: Question[] | null = [];

  @Input()
  canChangeQuestion = true;

  @Output()
  replaceQuestion = new EventEmitter<number>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  changeQuestion(index: number) {
    if (confirm("Are you sure to change this question ? You can only change once.")) {
      // The user can change a question once by quizz
      this.replaceQuestion.emit(index)

      if (this.questions && this.altQuestions) {
        this.questions[index] = this.altQuestions[index];
      }
    }
  }

}
