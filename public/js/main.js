let data = {
    types: [
        {
            type: 'Scripture',
            subtypes: 
                [
                    'Memory Verse',
                    'Call to Worship',
                    'Conviction of Sin',
                    'Confession of Sin',
                    'Assurance of Pardon',
                    'Invitation to Pray',
                    'Reading of the Word'
                ]
        },
        {
            type: 'Prayer',
            subtypes: []
        },
        {
            type: 'Song',
            subtypes: 
                [
                    'Songs of Adoration',
                    'Songs of Praise',
                    'Songs of Thanksgiving'
                ]
        },
        {
            type: 'Confession',
            subtypes: 
                [
                    'Apostle\'s Creed',
                    'Nicene Creed',
                    'Heidelberg Catechism',
                    'Westminster Shorter Catechism',
                    'Westminster Larger Catechism'
                ]
        },
        {
            type: 'Other',
            subtypes: []
        },
    ]
}

document.querySelector('.draft').addEventListener('click', createDraft)

document.querySelector('.submit').addEventListener('click', postLiturgy)

window.onload = function() {
    const selectOrder = document.querySelectorAll('li')
    selectOrder.forEach((el) => el.dataset.sort = el.dataset.order)

    if (document.querySelector('.liturgy').id) {
        document.querySelector('.submit').removeEventListener('click',postLiturgy)
        document.querySelector('.submit').className = 'update'
        
        document.querySelector('.update').name = 'update'
        document.querySelector('.update').innerText = 'Update'
        document.querySelector('.update').addEventListener('click', putLiturgy)
    }

    refreshSmurfs()
}

async function postLiturgy() {
    const worshipDate = document.querySelector('#dateOfWorship').value
    const selectType = Array.from(document.querySelectorAll('li'))
    
    const liturgyElements = selectType.map((el) => {
        const entries = new Map()
        for (const child of el.children) {
            if (child.className !== 'container') {
                entries.set(`${child.className}`,`${child.value}`)
            }
        }
        entries.set(`${el.className}`,`${el.dataset.sort}`)
        return Object.fromEntries(entries)
    })

    try{
        const res = await fetch('builder/postLiturgy', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'dateFromJSFile': worshipDate,
                'orderFromJSFile': liturgyElements
            })
        })
        const data = await res.json()
        console.log(data)
    }catch(err){
        console.log(err)
    }
}

async function putLiturgy() {
    const orderId = document.querySelector('.liturgy').getAttribute('id')
    console.log(orderId)
    const updateDefault = document.querySelector('#updateDefault')
    console.log(updateDefault.value === 'on')
    const selectType = Array.from(document.querySelectorAll('li'))

    defaultElements = null

    if (updateDefault.value === 'on') {
        defaultElements = selectType.map((el) => {
            const entries = new Map()
            for (const child of el.children) {
                if (child.className !== 'container') {
                    if (child.className === 'elementRef') {
                        entries.set(`${child.className}`,null)
                    } else {
                        entries.set(`${child.className}`,`${child.value}`)
                    }
                }
            }
            entries.set(`${el.className}`,`${el.dataset.sort}`)
            return Object.fromEntries(entries)
        })
    } else {
        defaultElements = undefined
    }

    console.log(defaultElements)
    
    const liturgyElements = selectType.map((el) => {
        const entries = new Map()
        for (const child of el.children) {
            if (child.className !== 'container') {
                entries.set(`${child.className}`,`${child.value}`)
            }
        }
        entries.set(`${el.className}`,`${el.dataset.sort}`)
        return Object.fromEntries(entries)
    })

    try{
        const res = await fetch('builder/putLiturgy', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'idFromJSFile': orderId,
                'orderFromJSFile': liturgyElements,
                'defOrderFromJSFile': defaultElements
            })
        })
        const data = await res.json()
        console.log(data)
    }catch(err){
        console.log(err)
    }
}

function refreshSmurfs() {
    const selectType = document.querySelectorAll('.elementType')
    selectType.forEach((el) => {
        el.removeEventListener('change', getSubtypes)
        el.addEventListener('change', getSubtypes)
    })

    const selectSubtype = document.querySelectorAll('.elementSubtype')
    selectSubtype.forEach((el) => {
        el.removeEventListener('change', getRefs)
        el.addEventListener('change', getRefs)
    })

    let smurfDiv = document.querySelectorAll('.container')
    smurfDiv.forEach((el) => {
        el.removeEventListener('click', reorderLiturgy)
        el.addEventListener('click', reorderLiturgy)
    })
}

function getSubtypes(event) {
    const sel = event.target.nextElementSibling
    const typeVal = event.target.value
    popSubtypes(sel,typeVal)
}

function popSubtypes(sel,typeVal) {
    data.types.forEach((detail, index) => {
        if (detail.type === typeVal) {
            sel.innerHTML = ''
            sel.nextElementSibling.disabled = (typeVal === 'Confession')
            sel.append(createOption('Select header',''))
            data.types[index].subtypes.forEach((subtype) => {
                sel.append(createOption(subtype, subtype))
            })
        }
    })
}

function getRefs(event) {
    const ref = event.target.nextElementSibling
    const type = event.target.previousElementSibling
    type.value === 'Confession' ? ref.value = event.target.value : ref.value = ""
}

function createOption(displayMember, valueMember) {
    const newOption = document.createElement('option')
    newOption.value = valueMember
    newOption.text = displayMember
    return newOption
}    

function createDraft() {
    
    const selectType = document.querySelectorAll('.elementType')
    const selectSubtype = Array.from(document.querySelectorAll('.elementSubtype'))
    const selectRefs = Array.from(document.querySelectorAll('.elementRef'))
    
    document.querySelector('main').innerHTML = ''
    
    const getPassage = async () => {
        const requests = selectRefs.map((el) => {
            return getPassageRef(el.value)
            .then((data) => data)
            .catch((err) => err)
        })
        return Promise.all(requests)
    }
        
    getPassage()
    .then((data) => {
        selectSubtype.forEach((el, i) => {
            el.value ? document.querySelector('main').innerHTML += `<h2>${el.value}</h2>` : document.querySelector('main').innerHTML += ''
            switch (selectType[i].value) {
                case 'Scripture':
                    document.querySelector('main').innerHTML += `<section>${data[i]}</section>`
                    break;
                default :
                    break;
            }
        })
    })

}
    
async function getPassageRef(ref) {
    
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'Token 38870776555d9f3aea6b18987359bbfdd5771dfa')

    const url = `https://api.esv.org/v3/passage/html/?q=${ref}&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-short-copyright=false&include-css-link=true&inline-styles=false&wrapping-div=true&include-book-titles=true&include-verse-anchors=true&include-audio-link=false`;

    const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: myHeaders,
    })
    
    const data = await res.json()

    // indexLinkStylesStart = data.passages[0].includes('<link') ? data.passages[0].search('<link') : -1

    // indexLinkStylesEnd = data.passages[0].includes('>',indexLinkStylesStart + 1) ? data.passages[0].search('>',indexLinkStylesStart + 1) : -1

    // document.querySelector('head').innerHTML += (data.passages[0].substring(indexLinkStylesStart,indexLinkStylesEnd+1))

    let updatedPassage = data.passages[0].replaceAll(/&nbsp;/g,'')
        
    updatedPassage = updatedPassage.replaceAll(/&nbsp;&nbsp;/g,'')

    updatedPassage = updatedPassage.replaceAll(/&nbsp;&nbsp;&nbsp;&nbsp;/g,'')

    updatedPassage = updatedPassage.replaceAll('LORD','<b class="smallCaps">Lord</b>')

    // let hideElements = [
    //     // document.querySelector('form')
    // ]
        
    // hideElements.forEach((elementToHide) => elementToHide.classList.add('hidden'))

    return updatedPassage

}

function orderElements() {
    const container = document.querySelector('li').parentNode
    const selectOrder = Array.from(document.querySelectorAll('li'))

    const sorted = selectOrder.sort((a,b) => Number(a.dataset.sort) - Number(b.dataset.sort))

    container.innerHTML = ''
    sorted.forEach((el) => container.append(el))
}

function reorderLiturgy(event) {
    const selectOrder = document.querySelectorAll('li')

    if (event.target.classList.contains('up')) {
        let target = event.target.closest('li')
        let liValue = Number(target.dataset.sort)
        liValue--
        target.dataset.sort = liValue.toString()
        liValue = Number(target.previousElementSibling.dataset.sort)
        liValue++
        target.previousElementSibling.dataset.sort = liValue.toString()
    } else if (event.target.classList.contains('down')) {
        let target = event.target.closest('li')
        let liValue = Number(target.dataset.sort)
        liValue++
        target.dataset.sort = liValue.toString()
        liValue = Number(target.nextElementSibling.dataset.sort)
        liValue--
        target.nextElementSibling.dataset.sort = liValue.toString()
    } else if (event.target.classList.contains('add')) {
        let target = event.target.closest('li')
        let targetLast = target.parentNode.lastElementChild

        for (const node of selectOrder) {
            if (Number(node.dataset.sort) > Number(target.dataset.sort)) {
                let liValue = Number(node.dataset.sort)
                liValue++
                node.dataset.sort = liValue.toString()
            }
        }
        
        const container = document.querySelector('li').parentNode
        let newElement = document.createElement('li')
        container.appendChild(newElement)
        newElement.setAttribute('class','elementOrder')
        liValue = target.dataset.sort.valueOf()
        liValue++
        newElement.setAttribute('data-sort', liValue.toString())

        let typeSelect = document.createElement('select')
        newElement.appendChild(typeSelect)
        typeSelect.setAttribute('class','elementType')
        data.types.forEach((value) => {
            typeSelect.appendChild(createOption(value.type, value.type))
        })
        
        let subtypeSelect = document.createElement('select')
        newElement.appendChild(subtypeSelect)
        newElement.appendChild(document.createElement('input')).setAttribute('class','elementRef')
        subtypeSelect.setAttribute('class','elementSubtype')
        popSubtypes(subtypeSelect,typeSelect.value)

        let newDiv = document.createElement('div')
        newElement.appendChild(newDiv)
        newDiv.setAttribute('class','container')

        newDiv.appendChild(document.createElement('i')).setAttribute('class','fa-solid fa-up-long up')
        newDiv.appendChild(document.createElement('i')).setAttribute('class','fa-solid fa-down-long down')
        newDiv.appendChild(document.createElement('i')).setAttribute('class','fa-solid fa-plus add')
        newDiv.appendChild(document.createElement('i')).setAttribute('class','fa-regular fa-trash-can del')
    } else if (event.target.classList.contains('del')) {
        let target = event.target.closest('li')
        let targetLast = target.parentNode.lastElementChild

        for (const node of selectOrder) {
            if (Number(node.dataset.sort) > Number(target.dataset.sort)) {
                let liValue = Number(node.dataset.sort)
                liValue--
                node.dataset.sort = liValue.toString()
            }
        }
        
        target.remove()
    }

    orderElements()
    refreshSmurfs()
}