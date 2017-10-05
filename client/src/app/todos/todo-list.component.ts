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

    public filterTodos(): void {
        this.filteredTodos = this.todos;

        if(this.todoOwner != null) {
            this.todoOwner = this.todoOwner.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !this.todoOwner || todo.owner.toLowerCase().indexOf(this.todoOwner) !== -1;
            })
        }

        if(this.todoStatus != null && this.todoStatus != "") {
            console.log(this.todoStatus);
            var searchStatusbool : boolean = this.todoStatus == "complete";
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !this.todoStatus || todo.status == searchStatusbool;
            })
        }

        if(this.todoCategory != null) {
            this.todoCategory = this.todoCategory.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !this.todoCategory || todo.category.toLowerCase().indexOf(this.todoCategory) !== -1;
            })
        }

        if(this.todoBody != null) {
            this.todoBody = this.todoBody.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !this.todoBody || todo.body.toLowerCase().indexOf(this.todoBody) !== -1;
            })
        }
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
