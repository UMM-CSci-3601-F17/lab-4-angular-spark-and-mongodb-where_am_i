import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from "./users/user.component";
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {Routing} from './app.routes';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from "@angular/common";
import { TodoListComponent } from './todos/todo-list.component';
import {TodoListService} from "./todos/todo-list.service";

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        Routing,
        FormsModule,
        TypeaheadModule.forRoot(),
        ModalModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        UserListComponent,
        UserComponent,
        TodoListComponent
    ],
    providers: [
        UserListService,
        TodoListService,
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
