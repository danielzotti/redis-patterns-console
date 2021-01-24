import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Theme } from '@app/shared/models/themes.interface';

@Component({
  selector: 'tr-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit {

  @Input()
  themes: Array<Theme>;

  @Output()
  themeSelected = new EventEmitter<Theme>();

  isExpanded = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onSelect(theme: Theme) {
    this.themeSelected.emit(theme);

    // !!!TRICK!!!
    // We should trigger the 'resize' event because some margins
    // could be different on the new selected theme and the height
    // of ScrollableContent component should be recalculated
    // TODO: edit TitleAndScrollableContent to accept a list of
    //  events or callback to decide wether update height
    window.dispatchEvent(new Event('resize'));
  }


  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
