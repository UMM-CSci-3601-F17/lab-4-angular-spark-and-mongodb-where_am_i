import {Component, OnInit, TemplateRef} from '@angular/core';
import {Todo} from "./todo";
import {TodoListService} from "./todo-list.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
    selector: 'todo-list-component',
    styleUrls: ['./todo-list.component.css'],
    templateUrl: './todo-list.component.html',
    providers: []
})
export class TodoListComponent implements OnInit {

    public todos: Todo[];
    public filteredTodos: Todo[];

    public todoAddSuccess : boolean = false;

    public todoOwner: string;
    public todoStatus: string = "";
    public todoBody: string;
    public todoCategory: string;

    public newTodoOwner: string;
    public newTodoStatus: string = "incomplete";
    public newTodoBody: string;
    public newTodoCategory: string;

    public modalRef: BsModalRef;



    constructor(private todoListService: TodoListService,
                private modalService: BsModalService) {
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public addNewTodo() {
        this.todoListService.addNewTodo(this.newTodoOwner, this.newTodoStatus == "complete", this.newTodoBody, this.newTodoCategory).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                this.refreshTodos();
            }
        )
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

    refreshTodos(): void {
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

    ngOnInit(): void {
        this.refreshTodos();
    }

}
