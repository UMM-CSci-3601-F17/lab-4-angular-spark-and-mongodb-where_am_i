import {TodoListPage} from "./todo-list.po";
import {browser, element, by} from 'protractor';
import {before} from "selenium-webdriver/testing";


describe('angular-spark-lab-todos', () => {
    let page: TodoListPage;

    beforeEach(() => {
        page = new TodoListPage();
        page.navigateTo();
    });

    it('should have title h1', () => {
        expect(page.getTodosTitle()).toEqual('Todos');
    });

    it('should type something in the search box and check that it returned correct element', () => {
        page.typeInput("searchInput","In sunt ex non tempor cillum");
        page.getAllTodoCards().each(e => {
            expect(e.element(by.className("todoBody")).getText()).toContain("In sunt ex non tempor cillum");
        })
    });

    it('should type something in the owner filter and check that it returned correct elements', () => {
        page.typeInput("ownerInput","Fry");

        page.getAllTodoCards().each(e => {
            expect(e.element(by.className("todoOwner")).getText()).toEqual("Fry");
        })
    });

    it('should type something in the category filter and check that it returned correct elements', () => {
        page.typeInput("CategoryInput","homework");

        page.getAllTodoCards().each(e => {
            expect(e.element(by.className("todoCategory")).getText()).toEqual("homework");
        })

    });

    it('should change the status filter to complete and check that it returned correct elements', () => {
        page.typeInput("statusInput","Complete", true);

        page.getAllTodoCards().each(e => {
            expect(e.element(by.className("todoStatus")).getText()).toEqual("Complete");
        })

    });

    it('should change the status filter to incomplete and check that it returned correct elements', () => {
        page.typeInput("statusInput","Incomplete", true);

        page.getAllTodoCards().each(e => {
            expect(e.element(by.className("todoStatus")).getText()).toEqual("Incomplete");
        })

    });

    it('should use multiple filters and check that it returned correct elements', () => {
        page.typeInput("CategoryInput","video games");
        page.typeInput("ownerInput","Roberta");
        page.typeInput("statusInput","Incomplete", true);

        page.getAllTodoCards().each(e => {
            expect(e.element(by.className("todoCategory")).getText()).toEqual("video games");
            expect(e.element(by.className("todoOwner")).getText()).toEqual("Roberta");
            expect(e.element(by.className("todoStatus")).getText()).toEqual("Incomplete");
        })

    });

    it('should add a single todo and have 1 more todo', () => {
         page.getAllTodoCards().count().then( beforecount => {
             page.addTodo("test owner", true, "test body", "test category");
             expect(page.getAllTodoCards().count()).toEqual(beforecount + 1);
         })
    })

    it('should add 3 todos and have 3 more todos', () => {
        page.getAllTodoCards().count().then( beforecount => {
            page.addTodo("test owner 1", true, "test body 1", "test category 1");
            page.addTodo("test owner 2", false, "test body 2", "test category 2");
            page.addTodo("test owner 3", true, "test body 3", "test category 3");
            expect(page.getAllTodoCards().count()).toEqual(beforecount + 3);
        })
    })

    it('should add a single todo and have that todo', () => {
        var owner = page.randomText(6);
        var status = page.randomBoolean();
        var body = page.randomText(150);
        var category = page.randomText(6);

        page.addTodo(owner, status, body, category);

        page.typeInput("CategoryInput",category);
        page.typeInput("ownerInput",owner);
        page.typeInput("statusInput",status ? "Complete" : "Incomplete", true);

        expect(page.getAllTodoCards().first().element(by.className("todoOwner")).getText()).toEqual(owner);
        expect(page.getAllTodoCards().first().element(by.className("todoStatus")).getText()).toEqual(status ? "Complete" : "Incomplete");
        expect(page.getAllTodoCards().first().element(by.className("todoBody")).getText()).toEqual(body);
        expect(page.getAllTodoCards().first().element(by.className("todoCategory")).getText()).toEqual(category);

    })


});

