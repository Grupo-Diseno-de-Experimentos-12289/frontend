import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private showFiltersSubject = new BehaviorSubject<boolean>(false);
  showFilters$ = this.showFiltersSubject.asObservable();

  get showFilters(): boolean {
    return this.showFiltersSubject.value;
  }

  setFilters(value: boolean): void {
    this.showFiltersSubject.next(value);
  }
}
