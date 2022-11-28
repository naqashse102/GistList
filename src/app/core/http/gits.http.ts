import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, mergeMap, subscribeOn, tap } from 'rxjs/operators';
import { forkJoin, Observable, of, OperatorFunction, throwError } from 'rxjs';

import { environment } from 'src/environments/environments';
import { Gist } from 'src/app/shared/interfaces/gist.interface';

@Injectable({
    providedIn: 'root'
})
export class GistHttp {

    httpOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/vnd.github+json'
        })
    }

    constructor(
        private httpClient: HttpClient,
    ) { }


    private static httpErrorHandler<T>(result?: T) {
        return (err: any): Observable<T | undefined> => {

            if (err.status >= 400) {
                throw err.error ? err.error : err;
            }

            return of(result);
        };
    }

    listPublicGists(page: number = 1, limit: number = 10): Observable<Gist[] | undefined> {
        return this.httpClient.get<Gist[]>(`${environment.baseUrl}/gists/public?page=${page}&per_page=${limit}`, this.httpOptions)
            .pipe(
                mergeMap((gists: Gist[]) => {
                    return forkJoin(
                        gists.map((gist: Gist) => {
                            return this.listGistForks(gist.id).pipe(
                                map(forks => {
                                    gist.forks = forks;
                                    return gist;
                                })
                            )
                        })
                    )
                }),
                catchError(GistHttp.httpErrorHandler([]))
            )
    }

    listUserGists(userName: string, page: number = 1, limit: number = 10): Observable<any[] | never[] | undefined> {
        return this.httpClient.get<Gist[]>(`${environment.baseUrl}/users/${userName}/gists?page=${page}&per_page=${limit}`, this.httpOptions)
            .pipe(
                mergeMap((gists: Gist[]) => {
                    return forkJoin(
                        gists.map((gist: Gist) => {
                            return this.listGistForks(gist.id).pipe(
                                map(forks => {
                                    gist.forks = forks;
                                    return gist;
                                })
                            )
                        })
                    )
                }),
                catchError(GistHttp.httpErrorHandler([]))
            )
    }

    listGistForks(gistId: string, page: number = 1, limit: number = 3): Observable<any[] | never[] | undefined> {
        return this.httpClient.get<Gist[]>(`${environment.baseUrl}/gists/${gistId}/forks?page=${page}&per_page=${limit}`, this.httpOptions)
            .pipe(map((gists: Gist[]) => {
                return gists;
            }),
                catchError(GistHttp.httpErrorHandler([])))
    }
}