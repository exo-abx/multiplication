const tablexEl = document.querySelector('#tableX')
const arr = [1,2,3,4,5,6,7,8,9]
const observer = new IntersectionObserver((entries)=>{
    for(const entry of entries){
        if(entry.isIntersecting){
            const ulEl = entry.target
            const a = ulEl.id
            const lis = ulEl.querySelectorAll('.text-left')
            lis.forEach((li)=>{
                li.remove()
            })    
            randomize(arr)
            for (let i of arr) {
                const liEl = document.createElement('li')
                liEl.classList.add('list-group-item', 'text-left')
                liEl.innerText = `${a} x ${i} = ${a*i}`
                ulEl.append(liEl)
            }  
        }
    }
})
function randomize(tab) {
    var i, j, tmp;
    for (i = tab.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = tab[i];
        tab[i] = tab[j];
        tab[j] = tmp;
    }
    return tab;
}
for(let a = 2; a < 10; a++){
    const rowEl = document.createElement('div')
    rowEl.classList.add('row', 'justify-content-center', 'mb-3')
    const ulEl = document.createElement('ul')
    ulEl.classList.add('list-group')
    ulEl.setAttribute('id', a)
    const liTitreEl = document.createElement('li')
    liTitreEl.classList.add('list-group-item', 'active')
    liTitreEl.innerText = `Table de ${a}`
    ulEl.appendChild(liTitreEl)
    randomize(arr)
    for (let i of arr) {
        const liEl = document.createElement('li')
        liEl.classList.add('list-group-item', 'text-left')
        liEl.innerText = `${a} x ${i} = ${a*i}`
        ulEl.append(liEl)
      }  
    rowEl.appendChild(ulEl)
    tablexEl.appendChild(rowEl)
    observer.observe(document.getElementById(a))
}
