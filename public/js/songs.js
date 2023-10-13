// Reads contents of uploaded file; returns contents as text

const readUploadedFileAsText = (file) => {
    const temporaryFileReader = new FileReader()

    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort()
            reject(new DOMException("Problem parsing input file."))
        }

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result)
        }

        temporaryFileReader.readAsText(file)
    })
}

// Parses text file into object

const handleUpload = async(event) => {
    const file = document.getElementById('inputFileUpload').files[0]

    try {
        const fileContents = await readUploadedFileAsText(file)
        
        const fileArray = fileContents.split('\n')
        const songObj = {}
        
        const titleBreak = fileArray.findIndex(el => el === '')
        const creditsBreak = fileArray.findLastIndex(el => el === '')
        
        songObj.title = fileArray[titleBreak - 1]
        songObj.authors = fileArray[creditsBreak + 1]
        songObj.cclinum = fileArray.find(el => el.includes('CCLI Song'))
        songObj.cclilic = fileArray.find(el => el.includes('CCLI License'))
        songObj.copyright = fileArray.find(el => el.includes('Words') || el.includes('Music'))
        songObj.verses = []

        let lyricsArray = fileArray.slice(titleBreak + 1, creditsBreak)

        do {
            songObj.verses.push(getVerses(0, lyricsArray))
        } while (lyricsArray.findIndex(el => el === '') !== -1)

        function getVerses(start, arr) {
            const verseBreak = arr.findIndex(el => el === '')
            const lyrics = arr.slice(start,verseBreak)
            
            for (let i = 0; i <= verseBreak; i++) arr.shift()

            lyrics.forEach(line => line.replaceAll(/.,:;/g,''));
            
            return {type: lyrics[0], lyrics: lyrics.slice(1)}
        }

        return songObj
    } catch (e) {
        console.log(e)
    }
}

const postLyrics = async(event) => {
    try {
        const fileContents = await handleUpload(event)
        await createDoc(fileContents)
    } catch (e) {
        console.log(e)
    }
}

// Creates new document from object

const createDoc = async(file) => {
    try {
        const res = await fetch('/songs/postSongs', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'parentSongFromJSFile': file.parentSong,
                'titleFromJSFile': file.title,
                'authorsFromJSFile': file.authors,
                'ccliNumFromJSFile': file.cclinum,
                'ccliLicFromJSFile': file.cclilic,
                'copyrightFromJSFile': file.copyright,
                'versesFromJSFile': file.verses,
            })
        })
        const data = await res.json()
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}

const listSongs = async() => {
    const selectPrimary = document.getElementById('selectPrimary')
    
    for (let i = 1; i < selectPrimary.children.length; i++) {
        selectPrimary.removeChild(selectPrimary.children[i])
    }
    
    try {
        const res = await fetch('/songs/getSongs')
        const data = await res.json()
        
        for (song of data) {
            const optionSong = document.createElement('option')
            document.getElementById('selectPrimary').appendChild(optionSong)
            optionSong.innerHTML = song.title
            optionSong.value = song._id
        }

        document.getElementById('selectPrimary').children.selectedIndex = 0
    } catch (e) {
        console.log(e)
    }
}

const getSelected = async(event) => {
    const selectedSection = event.target.parentElement
    const songId = event.target.value
    
    try {
        const res = await fetch('/songs/getSelected?' + new URLSearchParams({'id': songId}))
        const data = await res.json()
        
        showSong(data.selected, selectedSection)
        if (data.alternates.length > 0) {
            listAlternates(data.alternates)
        }
    } catch (e) {
        emptySongContainer(selectedSection)
    }
}

const showSong = (data, section) => {
    const sectionSong = section.querySelector('.songDisplay')
    
    const songHeader = sectionSong.querySelector('.songHeader')
    songHeader.replaceChildren()
    
    const songLyrics = sectionSong.querySelector('.songLyrics')
    songLyrics.replaceChildren()

    const songTitle = document.createElement('h2')
    songTitle.className = 'title'
    songTitle.innerHTML = data.title
    songHeader.appendChild(songTitle)
    
    const songAuthors = document.createElement('p')
    songAuthors.className = 'authors'
    songAuthors.innerHTML = data.authors
    songHeader.appendChild(songAuthors)
    
    const songCCLI = document.createElement('p')
    songCCLI.className = 'ccli'
    songHeader.appendChild(songCCLI)
    
    const songCCLINum = document.createElement('span')
    songCCLINum.className = 'cclinum'
    songCCLINum.innerHTML = data.cclinum
    songCCLI.appendChild(songCCLINum)
    songCCLI.innerHTML += ', '
    
    const songCCLILic = document.createElement('span')
    songCCLILic.className = 'cclilic'
    songCCLILic.innerHTML = data.cclilic
    songCCLI.appendChild(songCCLILic)
    
    const songCopyright = document.createElement('p')
    songCopyright.className = 'copyright'
    songCopyright.innerHTML = data.copyright
    songHeader.appendChild(songCopyright)
    
    data.verses.forEach(verse => {
        const sectionVerse = document.createElement('section')
        sectionVerse.className = verse.type.includes('Chorus') ? verse.type.toLowerCase() : 'verse'
        songLyrics.appendChild(sectionVerse)

        verse.lyrics.forEach((lyric,i) => {
            const divLyric = document.createElement('div')
            divLyric.className = i === 0 ? 'firstLine' : 'line'
            
            const pLyric = document.createElement('p')
            pLyric.className = i === 0 ? 'firstLine' : 'line'
            pLyric.innerHTML = lyric
            sectionVerse.appendChild(divLyric).appendChild(pLyric)
            if (i===0 && !verse.type.includes('Verse')) pLyric.insertAdjacentHTML('afterend',`<span class='${verse.type.toLowerCase()}'>${verse.type}</span>`)
        })
    })
}

const listAlternates = (data) => {
    const defaultAltOption = document.getElementById('selectAlternate').firstElementChild
    
    document.getElementById('selectAlternate').replaceChildren()
    document.getElementById('selectAlternate').appendChild(defaultAltOption)
    
    for (alternate of data) {
        const optionAlternate = document.createElement('option')
        optionAlternate.innerHTML = alternate.title
        optionAlternate.value = alternate._id
        document.getElementById('selectAlternate').appendChild(optionAlternate)
    }
}

const emptySongContainer = (section) => {
    if (section.id === 'primary') {
        location.reload()
    } else {
        const altOptions = document.getElementById('selectAlternate').children
        document.getElementById('selectAlternate').replaceChildren(...altOptions)
        document.getElementById('selectAlternate').selectedIndex = 0

        const arraySongAlternate = document.getElementById('songAlternate').children
        for (section of arraySongAlternate) {
            section.replaceChildren()
        }
    }
}

const editSelectedSong = (data) => {
    document.getElementById('editTitle').value = data.title
    document.getElementById('editAuthors').value = data.authors
    document.getElementById('copyCCLINum').innerHTML = data.cclinum
    document.getElementById('copyCCLILic').innerHTML = data.cclilic
    document.getElementById('editCopyright').value = data.copyright

    document.getElementById('editLyrics').replaceChildren()
    
    data.verses.forEach(el => {
        const divVerse = document.createElement('div')
        divVerse.className = 'divVerse'
        document.getElementById('editLyrics').appendChild(divVerse)
        
        const sectionType = document.createElement('section')
        sectionType.className = 'sectionType'
        divVerse.appendChild(sectionType)
        
        const inputType = document.createElement('input')
        inputType.className = 'inputType'
        inputType.value = el.type
        sectionType.appendChild(inputType)
        
        const sectionLyrics = document.createElement('section')
        sectionLyrics.className = 'sectionLyrics'
        divVerse.appendChild(sectionLyrics)
        
        el.lyrics.forEach(lyric => {
            const divLyric = document.createElement('div')
            divLyric.className = 'divLyric'
            sectionLyrics.appendChild(divLyric)

            const inputLyric = document.createElement('input')
            inputLyric.className = 'inputLyric'
            divLyric.appendChild(inputLyric)
            inputLyric.value = lyric
            
            const faLyric = document.createElement('div')
            faLyric.className = 'faLyric'
            faLyric.innerHTML = '<i class="fa-solid fa-up-long up"></i><i class="fa-solid fa-down-long down"></i><i class="fa-solid fa-plus add"></i><i class="fa-regular fa-trash-can del"></i>'
            divLyric.appendChild(faLyric)
        })

        const faVerse = document.createElement('div')
        faVerse.className = 'faVerse'
        faVerse.innerHTML = '<i class="fa-solid fa-up-long up"></i><i class="fa-solid fa-down-long down"></i><i class="fa-solid fa-plus add"></i><i class="fa-regular fa-trash-can del"></i>'
        divVerse.appendChild(faVerse)
    })
}

const editSong = async(event) => {
    const idPrimary = document.getElementById('selectPrimary').value
    const idAlternate = document.getElementById('selectAlternate').value
    
    const whichSongId = idAlternate !== '' ? idAlternate : idPrimary

    try {
        const res = await fetch('/songs/getSelected?' + new URLSearchParams({'id': whichSongId}))
        const data = await res.json()
        editSelectedSong(data.selected)
    } catch (e) {
        console.log(e)
    }

    document.getElementById('editor').classList.remove('hidden')
    if (idAlternate !== '') {
        document.getElementById('btnUpdate').classList.remove('hidden')
    }
}

const discardChanges = () => {
    document.getElementById('editor').classList.add('hidden')
}

const docObject = async() => {
    const songObj = {}
    songObj.verses = []

    songObj.parentSong = document.getElementById('selectPrimary').value
    songObj.title = document.getElementById('editTitle').value
    songObj.authors = document.getElementById('editAuthors').value
    songObj.cclinum = document.getElementById('copyCCLINum').innerHTML
    songObj.cclilic = document.getElementById('copyCCLILic').innerHTML
    songObj.copyright = document.getElementById('editCopyright').value

    const arrayVerses = document.getElementById('editLyrics').children

    for (divVerse of arrayVerses) {
        const lyricObj = {}
        lyricObj.lyrics = []
        
        lyricObj.type = divVerse.querySelector('.inputType').value
        
        const sectionLyrics = divVerse.querySelector('.sectionLyrics').children

        for (divLyric of sectionLyrics) {
            lyricObj.lyrics.push(divLyric.querySelector('.inputLyric').value)
        }
        
        songObj.verses.push(lyricObj)
    }

    return songObj
}

const createVersion = async () => {
    const songObj = await docObject()
    await createDoc(songObj)
}

const updateVersion = async () => {
    try{
        const songId = document.getElementById('selectAlternate').value
        const songObj = await docObject()
        
        const res = await fetch('/songs/updateVersion', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'idFromJSFile': songId,
                'titleFromJSFile': songObj.title,
                'authorsFromJSFile': songObj.authors,
                'copyrightFromJSFile': songObj.copyright,
                'versesFromJSFile': songObj.verses,
            })
        })
        const data = await res.json()
        
        showSong(data.update, document.getElementById('alternate'))
        listAlternates(data.alternates)
    }catch(err){
        console.log(err)
    }
}

// Event Listeners

window.addEventListener('load', listSongs)
    
document.getElementById('btnFileUpload').addEventListener('click', postLyrics)

document.getElementById('selectPrimary').addEventListener('change', getSelected)

document.getElementById('selectAlternate').addEventListener('change', getSelected)

document.getElementById('btnEditSong').addEventListener('click', editSong)

document.getElementById('btnDiscard').addEventListener('click', discardChanges)

document.getElementById('btnCreate').addEventListener('click',createVersion)

document.getElementById('btnUpdate').addEventListener('click',updateVersion)