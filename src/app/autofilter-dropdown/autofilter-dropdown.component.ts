import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DropdownOption } from '../data.models';

@Component({
  selector: 'app-autofilter-dropdown',
  templateUrl: './autofilter-dropdown.component.html',
  styleUrls: ['./autofilter-dropdown.component.css']
})
export class AutofilterDropdownComponent<T extends DropdownOption> implements OnInit {
  @Output()
  selectionChange = new EventEmitter<T>();

  @Input()
  entries$: Observable<T[]> = of([]);

  @Input()
  placeholder = '';

  @Input()
  set selection(entry: T) {
    this.entryControl.setValue(entry ? entry.name : '')
  }

  filteredEntries$: Observable<T[]> = of([]);
  entryControl = new FormControl<string>('');

  get entryValue() {
    return this.entryControl.getRawValue() ?? '';
  }

  ngOnInit() {
    this.filteredEntries$ = combineLatest([this.entryControl.valueChanges, this.entries$]).pipe(
      map(([userInput, entries]) => entries.filter(c => {
        if (!userInput) {
          userInput = '';
        }
        return c.name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      }))
    );
  }

  newSelection(entry: T) {
    this.entryControl.setValue(entry.name);
    this.selectionChange.emit(entry);
  }
}
