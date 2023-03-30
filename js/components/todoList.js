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
    #element
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
        this.#element = element
        element.append(
           cloneTemplate('todolist-layout') 
        )
        this.#listElement = element.querySelector('.list-group')
        for (let todo of this.#todos){
            const t = new todoListItem(todo)
            this.#listElement.append(t.element)
        }
        this.#ifVide()
        this.#listElement.addEventListener('delete', ({detail: todo})=>{
            this.#todos = this.#todos.filter(t => t !== todo)
            this.#onUpdate()
        })
}
#onUpdate(){
    localStorage.setItem('exoTabs', JSON.stringify(this.#todos))
    this.#ifVide()
}
#ifVide(){
    if (this.#todos.length === 0){
        this.#element.append(
            cloneTemplate('no-todolist')
        )
    }
}
}
class todoListItem{
    /**
     * @param {todo} todo 
     */
    #element
    #todo
    constructor(todo){
        this.#todo = todo
        let count = {
            v: 0,
            total: 0
        }
        const card = cloneTemplate('todolist-item').firstElementChild
        this.#element = card
        const button = card.querySelector('button')
        const cardBody = card.querySelector('.card-body')
        const calpase = card.querySelector('.collapse')
        for(const exo of todo){
            let li
            if (exo.a && exo.b && exo.reponse || exo.reponse === 0){
                count.total++
                if(exo.a * exo.b === exo.reponse){
                    count.v++
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
        const objPourcentage = this.#pourcentage(count)
        const progress = cloneTemplate('todolist-progress')
        const progressSucces = progress.querySelector('.bg-success')
        const progressFailure = progress.querySelector('.bg-danger')
        if (objPourcentage.pourcentageVrai >= 50){
            card.querySelector('.card-header').classList.add('bg-success')
        } else {
            card.querySelector('.card-header').classList.add('bg-danger')
        }
        progressSucces.setAttribute('style', `width: ${objPourcentage.pourcentageVrai}%`)
        progressFailure.setAttribute('style', `width: ${objPourcentage.pourcentageFaux}%`)
        progressSucces.innerText = `${objPourcentage.pourcentageVrai}% (${objPourcentage.nbJuste})`
        progressFailure.innerText = `${objPourcentage.pourcentageFaux}% (${objPourcentage.nbFaux})`
        cardBody.prepend(progress)
        const suprrim = createElement('button',{
            class: 'todo list-group-item list-group-item-action list-group-item-primary'
        })
        suprrim.innerText = `Supprimer` 
        cardBody.append(suprrim)
        suprrim.addEventListener('click',e => this.remove(e))
        
    }
    
    /**
     * @return {HTMLElement} element 
     */
    get element (){
        return this.#element
    }

    #pourcentage(count){
        const total = count.total
        const nbJuste = count.v
        const nbFaux = total-nbJuste
        const pourcentageVrai = Math.round((nbJuste / (total)) * 100)
        const pourcentageFaux = 100 - pourcentageVrai
        return {pourcentageVrai, pourcentageFaux, nbJuste, nbFaux}
    }

    /**
     * @param {PointEvent} e
     */
    remove (e){
        e.preventDefault()
        const event = new CustomEvent('delete', {
            detail: this.#todo,
            bubbles: true,
            cancelable: true
        })
        this.#element.dispatchEvent(event)
        this.#element.remove()
    }

}