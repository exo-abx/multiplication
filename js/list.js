import { TodoList } from "./components/todoList.js";
import { createElement } from "./functions/dom.js";
try{
    const QuizResultsInStorage = localStorage.getItem('quizResults')
    const results = QuizResultsInStorage ? JSON.parse(QuizResultsInStorage) : []
    const list = new TodoList(results)
    list.appendTo(document.querySelector('#todolist'))

}catch(e){
    const alertElement = createElement('div',{
        class: 'alert alert-danger m-2',
        role: 'alert'
    })
    alertElement.innerText = 'Impossible de charger les éléments'
    document.body.prepend(alertElement)
    console.error(e)
};