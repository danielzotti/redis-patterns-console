import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {environment} from '@app/../environments/environment';
import {Command} from '@app/shared/models/command.interface';
import {Pattern} from '@app/shared/models/pattern.interface';
import {CachingService} from '@app/core/services/caching.service';
import {GithubContent, ITokenResponse} from '@app/shared/models/github-content.interface';

@Injectable({
    providedIn: 'root'
})

export class GithubDataService {

    accessToken: string;
    isAuthorizedSubject = new BehaviorSubject<boolean>(false);

    private redisDocPath = environment.redisDocRepo.path;
    private patternsPath = environment.patternsRepo.path;

    constructor(
        private http: HttpClient,
        private cachingService: CachingService) {
    }

    /**
     * Fetch all available commands from remote git repo
     */
    fetchCommands(): Observable<Command[]> {
        const endpoint = this.getEndpoint(this.redisDocPath, environment.redisDocRepo.json);

        return this.http.get<GithubContent>(endpoint).pipe(
            map((contentFile) => {
                const decodedCommands: Command[] = JSON.parse(atob(contentFile.content));
                return Object.keys(decodedCommands).map((key) => ({key, ...decodedCommands[key]}));
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Fetch documentation relative to input command
     * @param command name of command
     * @returns Observable<string>
     */
    fetchDocumentation(command: string): Observable<string> {
        const headers: HttpHeaders = this.cachingService.cacheableHeaderObj;
        const file = environment.redisDocRepo.doc.replace('_file', command.replace(' ', '-').toLowerCase());
        const endpoint = this.getEndpoint(this.redisDocPath, file);

        return this.http.get<GithubContent>(endpoint, {headers}).pipe(
            map((contentFile) => atob(contentFile.content)),
            catchError(() => of('No documentation found'))
        );
    }

    /**
     * Fetch available pattern list
     * @returns Observable<Pattern[]>
     */
    fetchPatterns(): Observable<Pattern[]> {
        const endpoint = this.getEndpoint(this.patternsPath, environment.patternsRepo.json);

        return this.http.get<GithubContent | string>(endpoint).pipe(
            map((contentFile: any) => {
                const decodedPatterns: Pattern[] = JSON.parse(atob(contentFile.content));
                return Object.keys(decodedPatterns).map((key) => ({key, ...decodedPatterns[key]}));
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Fetch active pattern content file
     * @param key the key of active pattern
     * @returns Observable<string>
     */
    fetchPattern(key: string): Observable<string> {
        const headers = this.cachingService.cacheableHeaderObj;
        const endpoint = this.getEndpoint(this.patternsPath, `${key}.md`);

        return this.http.get<string>(endpoint, {headers}).pipe(
            map((contentFile: any) => atob(contentFile.content)),
            catchError(() => of('No pattern found'))
        );
    }

    /**
     * Get the observable which tells if the user is authenticated
     * @returns Observable<boolean>
     */
    get isAuth(): Observable<boolean> {
        return this.isAuthorizedSubject.asObservable();
    }

    /**
     * Set the GitHub access token
     * @param code is the code set by GitHub with the redirection
     * @returns Observable<boolean>
     */
    setAccessToken(code?: string): Observable<boolean> {
        return this.http.get(environment.accessTokenRequestUrl + code).pipe(
            switchMap((res: ITokenResponse) => {
                const isToken = !!(res.data.access_token);
                this.isAuthorizedSubject.next(isToken);
                this.accessToken = res.data && res.data.access_token;
                return this.isAuth;
            }),
            catchError(() => {
                this.isAuthorizedSubject.next(false);
                return this.isAuth;
            })
        );
    }

    /**
     * Format url for http request
     * @param repo repo path where fetch from
     * @param file file path to get
     */
    private getEndpoint(repo: string, file: string): string {
        return environment.githubEndpoint.replace('_repo_', repo).replace('_file_', file);
    }

}
