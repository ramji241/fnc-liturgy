const myHeaders = new Headers()

myHeaders.append('Authorization', 'Token 38870776555d9f3aea6b18987359bbfdd5771dfa')
    
document.querySelector('button').addEventListener('click',collectPassageRef)

function collectPassageRef () {
    
    let classes = ['callToWorship','convictionOfSin','assuranceOfPardon','invitationToPray','readingOfTheWord']

    // document.querySelector('.dateWorship').innerText = document.querySelector('#dateOfWorship').value

    classes.forEach((classElement) => getPassageRef(classElement))

}

function getPassageRef(classElement) {
    
    const passageRef = document.querySelector(`#${classElement}`).value;
    
    const url = `https://api.esv.org/v3/passage/html/?q=${passageRef}&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-short-copyright=false&include-css-link=true&inline-styles=false&wrapping-div=true&include-book-titles=true&include-verse-anchors=true&include-audio-link=false`;

    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: myHeaders,
})
    .then(res => res.json())

    .then(data => {

        indexLinkStylesStart = data.passages[0].includes('<link') ? data.passages[0].search('<link') : -1

        indexLinkStylesEnd = data.passages[0].includes('>',indexLinkStylesStart + 1) ? data.passages[0].search('>',indexLinkStylesStart + 1) : -1

        document.querySelector('head').innerHTML += (data.passages[0].substring(indexLinkStylesStart,indexLinkStylesEnd+1))

        updatedPassage = data.passages[0].replaceAll(/&nbsp;/g,'')
        
        updatedPassage = updatedPassage.replaceAll(/&nbsp;&nbsp;/g,'')

        updatedPassage = updatedPassage.replaceAll(/&nbsp;&nbsp;&nbsp;&nbsp;/g,'')

        updatedPassage = updatedPassage.replaceAll('LORD','<b class="smallCaps">Lord</b>')

        document.querySelector(`#${classElement}HTML`).innerHTML = updatedPassage
        
        let hideElements = [
            // document.querySelector('form')
        ]
        
        hideElements.forEach((elementToHide) => elementToHide.classList.add('hidden'))

    })

}