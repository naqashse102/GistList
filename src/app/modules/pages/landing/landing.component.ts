import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { GistHttp } from 'src/app/core/http/gits.http';
import { Gist } from 'src/app/shared/interfaces/gist.interface';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  alive$: Subject<boolean> = new Subject<boolean>();

  page: number = 1;
  limit = 5;
  userName = '';
  gists: Gist[] = [];


  constructor(
    private gistHttp: GistHttp,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchGists();
  }

  fetchGists(): void {
    this.isLoading = true;
    if (this.userName) {
      this.gistHttp.listUserGists(this.userName, this.page, this.limit)
        .pipe(takeUntil(this.alive$))
        .subscribe({
          next: (res: Gist[] | undefined) => {
            if (res) {
              console.log(res)
              this.gists = res;
            }
            this.isLoading = false;
          }, error: err => {
            this.gists = [];
            this.toastr.error(err.message);
            this.isLoading = false
          }
        })
      return;
    }
    this.gistHttp.listPublicGists(this.page, this.limit)
      .pipe(takeUntil(this.alive$))
      .subscribe({
        next: (res: Gist[] | undefined) => {
          if (res) {
            console.log(res)
            this.gists = res;
          }
          this.isLoading = false;
        }, error: err => {
          this.gists = [];
          this.toastr.error(err.message);
          this.isLoading = false
        }
      })
  }

  clearFilterHandler(): void {
    this.userName = '';
  }

  gistFilterHandler(): void {
    this.fetchGists()
  }

  limitChangeHandler(event: any): void {
    this.limit = event.target.value;
    this.fetchGists();
  }

  ngOnDestroy(): void {
    this.alive$.next(true);
    this.alive$.unsubscribe();
  }
}
