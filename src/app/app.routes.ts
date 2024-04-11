import { Routes } from '@angular/router';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SummaryComponent } from './main/summary/summary.component';
import { AddTaskComponent } from './main/add-task/add-task.component';
import { ContactsComponent } from './main/contacts/contacts.component';
import { BoardComponent } from './main/board/board.component';

export const routes: Routes = [
    { path: '', component: LogInPageComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'add_task', component: AddTaskComponent },
    { path: 'board', component: BoardComponent },
    { path: 'contacts', component: ContactsComponent }
];
