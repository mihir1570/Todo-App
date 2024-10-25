import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SortingColumnService {
  currentSortColumn: string = '';
  sortCriteria: { [key: string]: string } = {};

  constructor() {}

  // Toggle the sorting order for the selected column
  toggleSortOrder(column: string): void {
    if (this.sortCriteria[column]) {
      this.sortCriteria[column] =
        this.sortCriteria[column] === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Clear sorting for other columns and set the current column to ASC
      this.sortCriteria = {};
      this.sortCriteria[column] = 'DESC'; // Default to ASC for new column
    }
    this.currentSortColumn = column;
  }

  // Build dynamic sort parameter as an object with only one column's order
  buildSortParam(): { [key: string]: string } {
    const sortParams: { [key: string]: string } = {};
    if (this.currentSortColumn) {
      sortParams[this.currentSortColumn] =
        this.sortCriteria[this.currentSortColumn];
    }
    return sortParams;
  }

  // Reset sorting state (if needed, like switching views)
  resetSorting() {
    this.sortCriteria = {};
    this.currentSortColumn = '';
  }
}
