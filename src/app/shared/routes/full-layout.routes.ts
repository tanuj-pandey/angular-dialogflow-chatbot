import { Routes } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
  }
];
