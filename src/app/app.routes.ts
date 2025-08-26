import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentsComponent } from './appointments/appointments.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'appointments', component: AppointmentsComponent },
];
