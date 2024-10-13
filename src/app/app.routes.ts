import { Routes } from '@angular/router';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SummaryComponent } from './main/summary/summary.component';
import { AddTaskComponent } from './main/add-task/add-task.component';
import { ContactsComponent } from './main/contacts/contacts.component';
import { BoardComponent } from './main/board/board.component';
import { HelpComponent } from './other/help/help.component';
import { PrivacyPolicyComponent } from './other/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './other/legal-notice/legal-notice.component';
import { ResetPasswordComponent } from './other/reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', component: LogInPageComponent },
    { path: 'reset_password/:token', component: ResetPasswordComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'add_task', component: AddTaskComponent },
    { path: 'board', component: BoardComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'help', component: HelpComponent },
    { path: 'privacy_policy', component: PrivacyPolicyComponent },
    { path: 'legal_notice', component: LegalNoticeComponent }
];
