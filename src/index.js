const pupURL = 'http://localhost:3000/pups'

document.addEventListener("DOMContentLoaded", () => {
    
    let dogInfo=document.getElementById('dog-info'),
    h2=document.createElement('h2'),
    img=document.createElement('img'),
    btn=document.createElement('button');
    btn.setAttribute('hidden', 'true')
    dogInfo.appendChild(h2)
    dogInfo.appendChild(img)
    dogInfo.appendChild(btn)
    
    fetch(pupURL)
    .then((resp) => resp.json())
    .then(pupObj => {
        for (const key of pupObj) {
            displayPupBtns(key)
        }
            
    })

    document.getElementById('good-dog-filter').addEventListener('click', ()=>{
        const icons = document.getElementById('dog-bar')
        filterText = document.getElementById('good-dog-filter').textContent
        if(filterText==="Filter good dogs: OFF"){
            document.getElementById('good-dog-filter').textContent ="Filter good dogs: ON"
        }else if(filterText==="Filter good dogs: ON"){
            document.getElementById('good-dog-filter').textContent="Filter good dogs: OFF"
        }
        filterdoggos(icons.children)
    })

    function filterdoggos(iconArray){
        filterSetting = document.getElementById('good-dog-filter').textContent
        if(filterSetting==="Filter good dogs: OFF"){
            for (const key of iconArray) {
                if(key.dataset.isGood==="false"){
                    key.style.display='flex'
                }
            }
        }else if(filterSetting==="Filter good dogs: ON"){
            for (const key of iconArray) {
                if(key.dataset.isGood==="false"){
                    key.style.display='none'
                }
            }
        }
    }

    const displayPupBtns = (pup)=>{
        let dogBar = document.getElementById('dog-bar')
        let span = document.createElement('span');
        span.addEventListener('click', ()=>{
            displayPupDetails(pup)
        })
        span.textContent = pup.name
        span.dataset.isGood = pup.isGoodDog
        dogBar.appendChild(span)
    }

    function displayPupDetails(doggo){
        h2.textContent=doggo.name
        img.src=doggo.image
        btn.removeAttribute('hidden')
        btn.addEventListener('click', ()=>{
            isGoodDogBtn(doggo)
        })
        isGoodDogBtnText(doggo.isGoodDog)

    }

    function isGoodDogBtn(dog){
        let isGood
        fetch(pupURL+ `/${dog.id}`)
        .then((resp) => resp.json())
        .then(a => {
            if(a.isGoodDog===true){
                isGood=false
            }else{
                isGood=true
            }
            let dogBody={
                isGoodDog:isGood
            }
            let message={
                method:'PATCH',
                headers:{
                    'Content-type':'application/json',
                    Accept:'application/json'},
                body:JSON.stringify(dogBody)
            }
            fetch(pupURL+ `/${dog.id}`, message)
            .then(res=>res.json())
            .then(d=> {
                isGoodDogBtnText(d.isGoodDog)
                const pupIcons = document.getElementById('dog-bar').children
                for (const pup of pupIcons)
                    if(pup.textContent ===d.name){
                        pup.dataset.isGood = d.isGoodDog
                    }
                filterdoggos(pupIcons)
                }
                )
                
            })
        }

    function isGoodDogBtnText(doggy){
        if(doggy===true){
            btn.textContent="Good Dog!"
        }else{
            btn.textContent="Bad Dog!"
        }
    }

})