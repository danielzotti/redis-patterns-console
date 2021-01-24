import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'tr-command-documentation',
  templateUrl: './command-documentation.component.html',
  styleUrls: ['./command-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandDocumentationComponent {
  @Input()
  documentation = '';
}
