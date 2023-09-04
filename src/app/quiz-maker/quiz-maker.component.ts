import { Component } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, of } from 'rxjs';
import { QuizService } from '../quiz.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html'
})
export class QuizMakerComponent {
  allCategories$: Observable<Category[]>;
  mainCategories$: Observable<Category[]>;
  subCategories$: Observable<Category[]> = of([]);
  questions$: Observable<Question[]> | null = null;
  altQuestions$: Observable<Question[]> | null = null;

  selectedMainCategory = '';
  selectedSubCategory: string | null = '';
  canChangeQuestion = true;

  constructor(protected quizService: QuizService) {
    // Fetch all available categories
    this.allCategories$ = quizService.getAllCategories();

    // Filter only main categories
    this.mainCategories$ = this.allCategories$.pipe(
      map(all => {
        const mainCategoriesMap = new Map<string, Category>();
        all.forEach(cat => {
          const formattedTitle = cat.name.includes(':') ? cat.name.split(':')[0] : cat.name;

          // If a title contains ':', it means it has some sub categories so we group them 
          if (!mainCategoriesMap.has(formattedTitle)) {
            mainCategoriesMap.set(formattedTitle, { ...cat, name: formattedTitle });
          }
        });
        return Array.from(mainCategoriesMap.values());
      })
    );
  }

  createQuiz(difficulty: string): void {
    const selectedCategory = this.selectedSubCategory ?? this.selectedMainCategory;
    this.questions$ = this.altQuestions$ = null; // Clear previous questions
    this.canChangeQuestion = true;
    
    this.questions$ = this.quizService.createQuiz(selectedCategory, difficulty as Difficulty);
    this.altQuestions$ = this.questions$;
  }

  initSubCategory(id: string) {
    this.selectedMainCategory = id;
    this.selectedSubCategory = null;

    this.subCategories$ = this.allCategories$.pipe(
      switchMap(all => {
        // We search for the category in the origin list to know if the selected category has subs
        const mainCategory = all.find(cat => cat.id == +id);
        if (mainCategory?.name.includes(':')) {
          // case: with subs = return all categories that starts with the same prefix
          const fragment = mainCategory.name.split(':')[0];
          const subCategories = all.filter(cat => cat.name.startsWith(fragment) && cat.name.includes(':'))
            .map(sub => ({ ...sub, name: sub.name.replace(fragment, '').replace(':', '') }));
          return of(subCategories);
        } else {
          // case: no subs
          return of([]);
        }
      })
    );
  }
}