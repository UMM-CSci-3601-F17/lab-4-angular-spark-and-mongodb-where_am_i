import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TodoListComponent} from './todo-list.component';
import {Observable} from "rxjs/Observable";
import {Todo} from "./todo";
import {TodoListService} from "./todo-list.service";

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {FormsModule} from '@angular/forms';

describe('TodoListComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: "58895985a22c04e761776d54",
                    owner: "Blanche",
                    status: false,
                    body: "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
                    category: "software design"
                },
                {
                    _id: "58895985c1849992336c219b",
                    owner: "Fry",
                    status: false,
                    body: "Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.",
                    category: "video games"
                },
                {
                    _id: "58895985ae3b752b124e7663",
                    owner: "Fry",
                    status: true,
                    body: "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
                    category: "homework"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports:[FormsModule, TypeaheadModule.forRoot()],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })

    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });


    it("contains all the users", () => {
        expect(component.todos.length).toBe(3);
    });

    it("contains a todo id 58895985a22c04e761776d54", () => {
        expect(component.todos.some((todo: Todo) => todo._id === "58895985a22c04e761776d54")).toBe(true);
    });

    it("contain a todo id 58895985ae3b752b124e7663", () => {
        expect(component.todos.some((todo: Todo) => todo._id === "58895985ae3b752b124e7663")).toBe(true);
    });

    it("doesn't contain a todo id 182755281759ae91827196", () => {
        expect(component.todos.some((todo: Todo) => todo._id === "182755281759ae91827196")).toBe(false);
    });

    it("has todos with status false", () => {
        expect(component.todos.filter((todo: Todo) => todo.status === false).length).toBe(2);
    });

    it("filters todos by owner has correct number of todos", () => {
        expect(component.filterTodos( "Fry", null, null).length).toBe(2);
    });

    it("filters todos by category has correct number of todos", () => {
        expect(component.filterTodos( null, null, "homework").length).toBe(1);
    });

    it("Multiple filters has correct number of todos", () => {
        expect(component.filterTodos( "Fry", null, "homework").length).toBe(1);
    });


});
