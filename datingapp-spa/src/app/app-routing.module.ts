import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberDetailResolver } from './_resolvers/member-detals.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-chagnes.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children:
    [
      {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
      {path: 'members/:id', component: MemberDetailsComponent, resolve: {user: MemberDetailResolver}},
      {path: 'member/edit', component: MemberEditComponent,
       resolve: {user: MemberEditResolver},
      canDeactivate: [PreventUnsavedChanges]},
      {path: 'lists', component: ListsComponent},
      {path: 'messages', component: MessagesComponent},

    ]
  },

  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
