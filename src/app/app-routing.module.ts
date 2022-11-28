import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/pages/landing/landing.component';
import { NotFoundComponent } from './modules/pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full'},
  { path: '404', component: NotFoundComponent },

  // redirect to 404
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
