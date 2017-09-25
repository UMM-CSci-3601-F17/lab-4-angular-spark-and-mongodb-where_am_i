import {Component, OnInit} from '@angular/core';
import {Todo} from "./todo";
import {TodoListService} from "./todo-list.service";

@Component({
    selector: 'todo-list-component',
    templateUrl: './todo-list.component.html',
    providers: []
})
export class TodoListComponent implements OnInit {

    public todos: Todo[];
    public filteredTodos: Todo[];

    constructor(private todoListService: TodoListService) {
    }

    public filterTodos(): Todo[] {
        this.filteredTodos = this.todos;
        return this.filteredTodos;
    }

    ngOnInit(): void {
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }

}
