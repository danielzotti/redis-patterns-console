import {
  Component,
  Input
} from '@angular/core';
import { environment } from '@app/../environments/environment';

@Component({
  selector: 'tr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent { // implements AfterViewInit, OnChanges, AfterViewChecked

  title = 'Redis Patterns Console';
  version = environment.version;
  loginUrl = environment.loginFlowStart + environment.githubAppClientId;

  @Input()
  isAuth: boolean;
}
