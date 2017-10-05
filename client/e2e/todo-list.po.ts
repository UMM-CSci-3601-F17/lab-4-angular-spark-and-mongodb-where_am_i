import {browser, element, by} from 'protractor';
import {Key} from "selenium-webdriver";

export class TodoListPage {
    navigateTo() {
        return browser.get('/todos');
    }

    getTodosTitle() {
        let title = element(by.id('title')).getText();

        return title;
    }

    typeInput(input: string, text: string, enter?: boolean) {
        let inputElement = element(by.id(input));
        inputElement.click();
        inputElement.sendKeys(text);
        if(enter) {
            inputElement.sendKeys(Key.ENTER);
        }
    }

    clickButton(id: string) {
        let e = element(by.id(id));
        e.click();
    }

    addTodo(owner: string, status: boolean, body: string, category: string) {
        this.clickButton("newTodoModalButton");
        this.typeInput("newTodoOwner", owner);
        this.typeInput("newTodoStatus", status ? "Complete" : "Incomplete", true);
        this.typeInput("newTodoBody", body);
        this.typeInput("newTodoCategory", category);
        this.clickButton("newTodoCreateButton");
    }

    getElementTextByID(id: string) {
        return element(by.id(id)).getText();
    }

    getElementsByClass(htmlClass: string){
        return element.all(by.className(htmlClass));
    }

    getAllTodoCards() {
        return this.getElementsByClass("todoCard");
    }

    getTextOfFirstCardElementByClass(htmlClass: string) {
        return this.getAllTodoCards().first().element(by.className(htmlClass)).getText()
    }

    // from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    randomText(length: number): string {
        var text: string = "";
        var possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    randomBoolean(): boolean {
        return Boolean(Math.round(Math.random()));
    }
}
