import * as uuid from 'uuid';

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, catchError, tap, share} from 'rxjs/operators';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

import {environment} from '@app/../environments/environment';
import {Output} from '@app/shared/models/response.interface';
import {RedisRequest, RedisResponse, RedisWebsocket} from '@app/shared/models/redis.interface';

@Injectable({
    providedIn: 'root'
})
export class RedisConnectService {

    private readonly sessionId = uuid.v4();
    private subject$: WebSocketSubject<RedisWebsocket> = webSocket(environment.redisServer);
    private execCommandTimeSubject: BehaviorSubject<number> = new BehaviorSubject(0);

    execCommandTime$: Observable<number> = this.execCommandTimeSubject.asObservable();

    response$: Observable<Output> = this.subject$.pipe(
        // tap(res => console.log({ redisResponse: res})),
        map((response: RedisResponse): Output => {
            const valid = response.status === 'ok';
            return {valid, type: 'response', output: response.output};
        }),
        share(),
        catchError((): Observable<Output> => {
            /** return connection error response to not clear the output response box */
            const valid = false;
            return of({valid, type: 'response', output: 'Connection error'});
        })
    );

    send(command: string) {
        this.subject$.next({command, sessionId: this.sessionId, date: Date.now()} as RedisRequest);
        this.execCommandTimeSubject.next(new Date().getTime());
    }
}
