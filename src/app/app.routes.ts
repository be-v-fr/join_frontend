import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SummaryComponent } from './main/summary/summary.component';
import { AddTaskComponent } from './main/add-task/add-task.component';
import { ContactsComponent } from './main/contacts/contacts.component';
import { BoardComponent } from './main/board/board.component';

export const routes: Routes = [
    { path: '', component: LogInComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'add_task', component: AddTaskComponent },
    { path: 'board', component: BoardComponent },
    { path: 'contacts', component: ContactsComponent }
];
