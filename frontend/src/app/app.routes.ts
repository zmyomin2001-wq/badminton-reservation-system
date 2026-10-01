import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { AdminCourts } from './pages/admin-courts/admin-courts';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  {
    path: 'my-bookings',
    component: MyBookings,
    canActivate: [authGuard]
  },

  {
    path: 'admin/courts',
    component: AdminCourts,
    canActivate: [authGuard]
  }
];