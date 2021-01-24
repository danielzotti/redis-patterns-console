import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownPipe } from './pipes/markdown.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { ScrollableContentComponent } from './components/scrollable-content/scrollable-content.component';

@NgModule({
  declarations: [
    MarkdownPipe,
    SearchFilterPipe,
    ScrollableContentComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MarkdownPipe,
    SearchFilterPipe,
    ScrollableContentComponent
  ]
})
export class SharedModule { }
