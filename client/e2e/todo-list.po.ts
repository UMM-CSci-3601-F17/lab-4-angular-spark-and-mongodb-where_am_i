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
}
