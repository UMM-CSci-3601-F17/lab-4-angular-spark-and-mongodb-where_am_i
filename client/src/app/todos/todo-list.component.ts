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

    public todoStatus: string = "";


    constructor(private todoListService: TodoListService) {
    }

    public filterTodos(searchOwner: string, searchStatus: string, searchBody: string, searchCategory: string): Todo[] {
        this.filteredTodos = this.todos;

        if(searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
            })
        }

        if(searchStatus != null && searchStatus != "") {
            var searchStatusbool = searchStatus == "complete";
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchStatus || todo.status == searchStatusbool;
            })
        }

        if(searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
            })
        }

        if(searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
            })
        }


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
