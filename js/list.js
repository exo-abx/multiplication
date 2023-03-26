import { TodoList } from "./components/TodoList.js";
import { createElement } from "./functions/dom.js";
try{
    const todosInStorage = localStorage.getItem('exoTabs')
    const todos = todosInStorage ? JSON.parse(todosInStorage) : []
    const list = new TodoList(todos)
    list.appendTo(document.querySelector('#todolist'))

}catch(e){
    const alertElement = createElement('div',{
        class: 'alert alert-danger m-2',
        role: 'alert'
    })
    alertElement.innerText = 'Impossible de charger les éléments'
    document.body.prepend(alertElement)
    console.error(e)
}