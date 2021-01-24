import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { Output } from '@app/shared/models/response.interface';
import { Pattern } from '@app/shared/models/pattern.interface';
import { CommandService } from '@app/core/services/command.service';
import { PatternService } from '@app/core/services/pattern.service';
import { RedisConnectService } from '@app/core/services/redis-connect.service';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'tr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  readonly responses$: Observable<Output[]>;
  private currentResponseBs: BehaviorSubject<Output> = new BehaviorSubject<Output>(null);

  activePattern: Pattern;
  newCommandForInput: string;
  resetCommand$: Observable<number> = this.redisConnectService.execCommandTime$;
  resetChapterScrollValue: number; // Once the value changes, it triggers the "scroll to top" of chapter content

  commandListHeight: number;
  commandOutputHeight: number;

  @ViewChild('commandOutput')
  commandOutputElementRef: ElementRef;


  constructor(
    public commandService: CommandService,
    public patternService: PatternService,
    private redisConnectService: RedisConnectService) {

    // this.redisConnectService.response$.subscribe(res => console.log({ redisConnectService: res }));

    /** when currentResponse$ is null reset responses$ */
    this.responses$ = merge(this.currentResponseBs.asObservable(), this.redisConnectService.response$).pipe(
      scan((previous, current) => (current != null) ? [...previous, current] : [], [])
    );

    this.responses$.subscribe((res) => {
      this.scrollCommandOutputToEnd();
    });
  }

  ngOnInit(): void {
  }

  /**
   * Set current command as the active one
   * @param command String
   */
  selectActiveCommand(command: string) {
    this.commandService.activeCommand = command;
  }

  /**
   * Write command on text input
   * @param command String
   */
  writeCommand(command: string) {
    this.newCommandForInput = command;
    this.selectActiveCommand(command);
  }

  /**
   * Set new active pattern
   * @param pattern pattern
   */
  selectPattern(pattern: Pattern) {
    this.activePattern = pattern;
    this.patternService.activePattern = pattern;
  }

  /**
   * Send command to server and update responses
   * @param commandString String
   */
  runCommand(commandString: string) {
    const newCommand: Output = { valid: true, output: commandString.toUpperCase(), type: 'command' };
    this.currentResponseBs.next(newCommand);
    // If a command is written lowercase, the redis service doesn't recognize the command!
    // We must transform the command in uppercase!
    // this.redisConnectService.send(commandString);
    const uppercaseCommandString = commandString.split(' ').map((w, i) => {
      return i === 0 ? w.toUpperCase() : w;
    }).join(' ');
    this.redisConnectService.send(uppercaseCommandString);
    const [first, ...second] = commandString.split(' ');
    this.selectActiveCommand(first);
  }

  /**
   * reset responses
   *
   */
  clearOutput(): void {
    this.currentResponseBs.next(null);
  }

  onChapterChange() {
    this.resetChapterScrollValue = new Date().getTime();
  }

  setCommandListHeight(height: any) {
    setTimeout(() => this.commandListHeight = height, 0);
  }

  setCommandOutputHeight(height: number) {
    setTimeout(() => this.commandOutputHeight = height, 0);
  }

  scrollCommandOutputToEnd() {
    if (this.commandOutputElementRef?.nativeElement) {
      const el = this.commandOutputElementRef.nativeElement;
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 0);
    }
  }
}


