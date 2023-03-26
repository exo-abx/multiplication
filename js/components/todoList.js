import { cloneTemplate, createElement } from "../functions/dom.js"
/**
 * @typedef{object} todo
 * @property{number} id
 * @property{string} title
 * @property{boolean} completed
 */
export class TodoList {
    /** @type{todo[]} */
    #todos = []
    /** @type{HTMLULElement */
    #listElement = []
    /**
     * 
     * @param {todo[]} todos 
     */
    constructor (todos){
        this.#todos = todos
    }
    /**
     * @param {HTMLElement} element 
     */
    appendTo (element){
        element.append(
           cloneTemplate('todolist-layout') 
        )
        this.#listElement = element.querySelector('.list-group')
        for (let todo of this.#todos){
            const t = new todoListItem(todo)
            this.#listElement.append(t.element)
        }
}
}

class todoListItem{
    /**
     * @param {todo} todo 
     */
    #element
    constructor(todo){
        const card = cloneTemplate('todolist-item').firstElementChild
        this.#element = card
        const button = card.querySelector('button')
        const cardBody = card.querySelector('.card-body')
        const calpase = card.querySelector('.collapse')
        for(const exo of todo){
            let li
            if (exo.a && exo.b && exo.reponse || exo.reponse === 0){
                if(exo.a * exo.b === exo.reponse){
                    li = createElement('li',{
                        class: 'todo list-group-item d-flex align-items-center list-group-item-success'
                    })
                    li.innerText = `${exo.a}x${exo.b}=${exo.a*exo.b}`
                } 
                if (exo.a * exo.b !== exo.reponse) {
                    li = createElement('li',{
                        class: 'todo list-group-item d-flex align-items-center list-group-item-danger'
                    })
                    li.innerText = `${exo.a}x${exo.b}=${exo.a*exo.b} et non (${exo.reponse})`
                }
                cardBody.append(li)
            }
            if (exo.dateString && exo.id) {     
                button.innerText = `Exercice du ${exo.dateString}`
                calpase.setAttribute('id', `exo-${exo.id}`)
                button.setAttribute('data-target',`#exo-${exo.id}`)
            }
        }
    }
    
    /**
     * @return {HTMLElement} element 
     */
    get element (){
        return this.#element
    }

    /**
     * @param {PointEvent} e
     */
    remove (e){
        e.preventDefault()
        this.#element.remove()
    }

}