import {createElement} from "./functions/dom.js"
const countdownEl = document.querySelector('#countdown span')
const aEl = document.querySelector('#a')
const bEl = document.querySelector('#b')
const formEl = document.querySelector('form')
const pages = document.querySelectorAll(".page")

let nbExo = 20
let arrayb = []
let countDownInterval
let exo = {}
let exoTab = []
window.onload = () => {
    // On affiche la 1ère page du formulaire
    document.querySelector('.page').style.display = 'initial'
    const bouton = document.querySelector('#start')
    bouton.addEventListener('click', startExo)
}

function startExo(){
    //lacencement page
    for(let page of pages){
        page.style.display = "none"
    }
    document.querySelector('#page2').style.display = "initial"
    //recupération donnée
    
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    for (var i = 0; i < checkboxes.length; i++) {
        arrayb.push(checkboxes[i].value)
    }
    nbExo = Number(document.querySelector('#nrbExo').value)
    //lance l'exo
    reload()
}

formEl.addEventListener('submit', e => onSubmit(e))

function generateRandomInt(min,max){
    return Math.floor((Math.random() * (max+1 -min)) +min)
}
function generateArray(){
    const nbrAleatoire = arrayb[generateRandomInt(0,arrayb.length-1)]
    return Number(nbrAleatoire)
}

function play() {
    const element = document.querySelector('.changing')
    element.classList.remove('changing')
    window.requestAnimationFrame(function(time) {
        window.requestAnimationFrame(function(time) {
            element.classList.add('changing')
        });
      });
    
  }
function onSubmit(e){
    e.preventDefault()
    const form = e.currentTarget
    const getx = Number(new FormData(form).get("getx"))
    verifResult(getx)
}

function pourcentage(exoTab){
    const total = exoTab.length
    const nbJuste = exoTab.filter(t => t.a * t.b === t.reponse).length
    const nbFaux = total-nbJuste
    const pourcentageVrai = Math.round((nbJuste / (total)) * 100)
    const pourcentageFaux = 100 - pourcentageVrai
    return {pourcentageVrai, pourcentageFaux, nbJuste, nbFaux}
}
function verifResult(reponse){
    const alert = document.querySelector('.alert')
    const progressSucces = document.querySelector('.bg-success')
    const progressFailure = document.querySelector('.bg-danger')

    if (alert !== null){
        alert.remove()
    }
 
    let newExoTab =  
    {
        a: exo.a,
        b: exo.b,
        reponse: reponse
    }
    if(reponse===exo.x){
        const alertElement = createElement('div',{
            class: 'alert alert-success m-2',
            role: 'alert'
        })
        alertElement.innerText = `Bravo ${exo.a}x${exo.b}=${exo.x}`
        formEl.append(alertElement) 
    } else {
        const alertElement = createElement('div',{
            class: 'alert alert-danger m-2',
            role: 'alert'
        })
        alertElement.innerText = `Attention ${exo.a}x${exo.b}=${exo.x}`
        formEl.prepend(alertElement)
    }
    exoTab.push(newExoTab)
    const objPourcentage = pourcentage(exoTab)
    progressSucces.setAttribute('style', `width: ${objPourcentage.pourcentageVrai}%`)
    progressFailure.setAttribute('style', `width: ${objPourcentage.pourcentageFaux}%`)
    progressSucces.innerText = `${objPourcentage.pourcentageVrai}% (${objPourcentage.nbJuste})`
    progressFailure.innerText = `${objPourcentage.pourcentageFaux}% (${objPourcentage.nbFaux})`
    formEl.reset()
    clearInterval(countDownInterval)
    if(exoTab.length < nbExo){
        reload()
    } else {
        document.querySelector('#countdown').remove()
        formEl.remove()
        const ul = createElement('ul',{
            class: 'list-group pt-3'
        })
        for (let todo of exoTab){
            const t = new exoListItem(todo)
            ul.append(t.element)
        }
        const h1 =  document.querySelector('h1')
        h1.innerText = "Vos résultats"
        h1.after(ul)
        //on ajoutte le bouton recommencer
        const button = createElement('a',{
            class: 'btn btn-primary',
            href: '',
            role:'button'
        })
        button.innerText = "Recommencer"
        document.querySelector('.progress').after(button)
        // on rajoute l'object date dans l'obj exo
        const dateString = new Date().toLocaleString()
        const id = new Date()
        const date = {
            dateString: dateString,
            id: Date.parse(id)
        }
        exoTab.push(date)
        // on récupère le local storage pour lui rajouter cette exo
        const exoTabsInStorage = localStorage.getItem('exoTabs')
        const exoTabs = exoTabsInStorage ? JSON.parse(exoTabsInStorage) : []
        exoTabs.push(exoTab)
        localStorage.setItem('exoTabs', JSON.stringify(exoTabs))
    }
    return exoTab
}

function reload(){
    exo = {
        b: generateRandomInt(2,9),
        //b: generateRandomInt(2,9),
        a: generateArray(),
        get x() {
            return this.a * this.b;
        }
    }
    aEl.innerText = exo.a
    bEl.innerText = exo.b
    let count = 15
    countDownInterval = setInterval(()=>{
        if(count < 0){
            const getx = Number(formEl.querySelector('#getx').value)
            verifResult(getx)
            return
        }

        if(count <= 5){
            countdownEl.style.color = "#dc3545"
        } else {
            countdownEl.style.color = "#007bff"
        }
        countdownEl.innerText = count
        count--;
    }, 1000)
    play()
    console.log(exo.x)
    return exo
}
/*
*appeler pour afficher le résultat de l'exo
*/
class exoListItem{
    /**
     * @param {todo} todo 
     */
    #element
    constructor(todo){
        let li
        if(todo.a * todo.b === todo.reponse){
            li = createElement('li',{
                class: 'todo list-group-item d-flex align-items-center list-group-item-success'
            })
            li.innerText = `${todo.a}x${todo.b}=${todo.a*todo.b}`
        } else {
            li = createElement('li',{
                class: 'todo list-group-item d-flex align-items-center list-group-item-danger'
            })
            li.innerText = `${todo.a}x${todo.b}=${todo.a*todo.b} et non (${todo.reponse})`
        }
        
        this.#element = li
    }
    get element (){
        return this.#element
    }
}
