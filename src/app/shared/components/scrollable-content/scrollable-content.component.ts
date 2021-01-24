import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'tr-title-and-scrollable-content',
  templateUrl: './scrollable-content.component.html',
  styleUrls: ['./scrollable-content.component.scss']
})
export class ScrollableContentComponent implements OnInit, OnChanges, AfterViewInit {

  @Input()
  contentTitle: string;

  @Input()
  triggerResetScroll: number;

  @Input()
  @HostBinding('class.is-standalone')
  isStandalone = false;

  @Input()
  @HostBinding('class.has-padding')
  hasPadding = true;

  @Output()
  contentHeight: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('title')
  titleElementRef: ElementRef<HTMLDivElement>;

  @ViewChild('content')
  contentElementRef: ElementRef<HTMLDivElement>;

  // HTML Elements
  titleEl: HTMLDivElement;
  contentEl: HTMLDivElement;
  containerEl: HTMLDivElement;

  isTextCollapsed = true;

  constructor(private containerElRef: ElementRef<HTMLDivElement>) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Scroll to top on page or chapter change
    if (changes.triggerResetScroll?.currentValue || changes.contentTitle?.currentValue) {
      this.scrollToTop();
    }
  }

  ngAfterViewInit(): void {
    this.titleEl = this.titleElementRef?.nativeElement;
    this.contentEl = this.contentElementRef?.nativeElement;
    this.containerEl = this.containerElRef?.nativeElement;

    if (!this.isStandalone) {
      this.fixDimensions();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.isStandalone) {
      setTimeout(() => this.fixDimensions(), 0);
    }
  }

  toggleExpand() {
    this.isTextCollapsed = !this.isTextCollapsed;
    setTimeout(() => this.fixDimensions(), 0);
  }

  fixDimensions() {
    const containerHeight = this.containerEl.offsetHeight;
    const titleHeight = this.titleEl?.offsetHeight;
    const contentNewHeight = titleHeight ? (containerHeight - titleHeight) : containerHeight;
    const containerPadding = this.getCssAttributeNumber(this.containerEl, 'padding');

    this.contentEl.style.height = `${ contentNewHeight }px`;

    setTimeout(() => this.contentHeight.emit(contentNewHeight - (2 * containerPadding)), 0);
    // this.contentHeight.emit(contentNewHeight - (2 * containerPadding));
  }

  scrollToTop() {
    if (this.contentEl) {
      this.contentEl.scrollTop = 0;
    }
  }

  getCssAttribute(el: HTMLElement, attribute: string): string {
    return window.getComputedStyle(el, null)[attribute];
  }

  getCssAttributeNumber(el: HTMLElement, attribute: string): number {
    return parseInt(this.getCssAttribute(el, attribute), 10);
  }


}
