const getSongList = async() => {
    for (let i = 1; i < document.querySelector('#songSelect').children.length; i++) {
        document.querySelector('#songSelect').removeChild(document.querySelector('#songSelect').children[i])
    }
    
    try {
        const res = await fetch('/songs/getSongs')
        const data = await res.json()
        
        for (each of data) {
            const eachSong = document.createElement('option')
            document.querySelector('#songSelect').appendChild(eachSong)
            eachSong.innerHTML = each.title
            eachSong.value = each._id
        }

        document.querySelector('#songSelect').children.selectedIndex = 0
    } catch (e) {
        console.log(e)
    }
}

const readUploadedFileAsText = (inputFile) => {
    const temporaryFileReader = new FileReader()

    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort()
            reject(new DOMException("Problem parsing input file."))
        }

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result)
        }

        temporaryFileReader.readAsText(inputFile)
    })
}

const handleUpload = async(event) => {
    const file = event.target.previousElementSibling.files[0]

    try {
        const fileContents = await readUploadedFileAsText(file)
        
        const fileArray = fileContents.split('\n')
        const lyrics = {}
        
        const titleBreak = fileArray.findIndex(el => el === '')
        const creditsBreak = fileArray.findLastIndex(el => el === '')
        
        lyrics.title = fileArray[titleBreak - 1]
        lyrics.authors = fileArray[creditsBreak + 1]
        lyrics.cclinum = fileArray.find(el => el.includes('CCLI Song'))
        lyrics.cclilic = fileArray.find(el => el.includes('CCLI License'))
        lyrics.copyright = fileArray.find(el => el.includes('Words') || el.includes('Music'))
        lyrics.verses = []

        let lyricsArray = fileArray.slice(titleBreak + 1, creditsBreak)

        do {
            lyrics.verses.push(getVerses(0, lyricsArray))
        } while (lyricsArray.findIndex(el => el === '') !== -1)

        function getVerses(start, arr) {
            const verseBreak = arr.findIndex(el => el === '')
            const verseText = arr.slice(start,verseBreak)
            
            for (let i = 0; i <= verseBreak; i++) {
                arr.shift()
            }

            verseText.forEach(el => {
                el.replaceAll(/.,:;/g,'')
            });
            
            return {type: verseText[0], lyrics: verseText.slice(1)}
        }

        return lyrics
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

const getSelected = async(event) => {
    const selectedSection = event.target.parentElement
    const songId = event.target.value

    try {
        const res = await fetch('/songs/getSelected?' + new URLSearchParams({'id': songId}))
        const data = await res.json()
        
        getSelectedSong(data.selected, selectedSection)
        if (data.alternates.length > 0) {
            getAlternates(data.alternates)
        }
    } catch (e) {
        emptySongContainer(selectedSection)
    }
}

const getSelectedSong = (data, section) => {
    const lyricsSection = section.querySelector('.showLyrics')
    const songHeader = lyricsSection.querySelector('.songHeader')
    const songLyrics = lyricsSection.querySelector('.songLyrics')
    
    songHeader.replaceChildren()
    songLyrics.replaceChildren()

    const newTitle = document.createElement('h2')
    songHeader.appendChild(newTitle)
    newTitle.className = 'title'
    newTitle.innerHTML = data.title
    
    const newAuthors = document.createElement('p')
    songHeader.appendChild(newAuthors)
    newAuthors.className = 'authors'
    newAuthors.innerHTML = data.authors
    
    const newCcli = document.createElement('p')
    const newCcliNum = document.createElement('span')
    const newCcliLic = document.createElement('span')
    songHeader.appendChild(newCcli)
    newCcli.appendChild(newCcliNum)
    newCcli.appendChild(newCcliLic)
    newCcli.className = 'ccli'
    newCcliNum.className = 'cclinum'
    newCcliLic.className = 'cclilic'
    newCcliNum.innerHTML = data.cclinum
    newCcliLic.innerHTML = data.cclilic
    
    const newCopyright = document.createElement('p')
    songHeader.appendChild(newCopyright)
    newCopyright.className = 'copyright'
    newCopyright.innerHTML = data.copyright
    
    data.verses.forEach(el => {
        const newVerse = document.createElement('section')
        if (el.type.includes('Chorus')) {
            newVerse.className = el.type.toLowerCase()
        } else {
            newVerse.className = 'verse'
        }
        songLyrics.appendChild(newVerse)

        el.lyrics.forEach((lyric,i) => {
            const newDiv = document.createElement('div')
            const newLine = document.createElement('p')

            if (i===0 ) {
                newDiv.className = 'firstLine'
                newLine.className = 'firstLine'
            } else {
                newLine.className = 'line'
            }
            
            newVerse.appendChild(newDiv).appendChild(newLine)
            newLine.innerHTML = lyric

            if (i===0 && !el.type.includes('Verse')) {
                newLine.insertAdjacentHTML('afterend',`<span class='${el.type.toLowerCase()}'>${el.type}</span>`)
            }

        })
    })
}

const getAlternates = (data) => {
    const altOptions = document.querySelector('#altSelect').children
    
    for (let i = 1; i < altOptions.length; i++) {
        document.querySelector('#altSelect').children[i].removeChild()
    }
    
    for (each of data) {
        const eachAlternate = document.createElement('option')
        document.querySelector('#altSelect').appendChild(eachAlternate)
        eachAlternate.innerHTML = each.title
        eachAlternate.value = each._id
    }
}

const emptySongContainer = (section) => {
    if (section.className === 'primarySongDisplay') {
        location.reload()
    } else {
        const altOptions = document.querySelector('#altSelect').children
        for (child of section.children) {
            if (child.id === 'altSelect') {
                child.replaceChildren(...altOptions)
                child.selectedIndex = 0
            } else {
                for (elements of child.children) {
                    elements.replaceChildren()
                }
            }
        }
    }
}

const editSelectedSong = (data) => {
    document.querySelector('.editVerses').replaceChildren()
    document.querySelector('.editTitle').value = data.title
    document.querySelector('.editAuthors').value = data.authors
    document.querySelector('.copyCclinum').innerHTML = data.cclinum
    document.querySelector('.copyCclilic').innerHTML = data.cclilic
    document.querySelector('.editCopyright').value = data.copyright

    data.verses.forEach(el => {
        const faDiv_type = document.createElement('div')
        faDiv_type.innerHTML = '<i class="fa-solid fa-up-long up"></i><i class="fa-solid fa-down-long down"></i><i class="fa-solid fa-plus add"></i><i class="fa-regular fa-trash-can del"></i>'
        faDiv_type.className = 'container'
    
        const editVerse = document.createElement('section')
        editVerse.className = 'editVerse'
        const editVerse_type = document.createElement('section')
        editVerse_type.className = 'editVerse_type'
        const editVerse_lyrics = document.createElement('section')
        editVerse_lyrics.className = 'editVerse_lyrics'

        document.querySelector('.editVerses').appendChild(editVerse)
        editVerse.appendChild(editVerse_type)
        editVerse.appendChild(editVerse_lyrics)

        const editVerse_typeDiv = document.createElement('div')
        const inputVerse_type = document.createElement('input')
        inputVerse_type.value = el.type
        editVerse_typeDiv.appendChild(inputVerse_type)
        editVerse_typeDiv.appendChild(faDiv_type)
        editVerse_type.appendChild(editVerse_typeDiv)
        
        el.lyrics.forEach((lyric,i) => {
            const faDiv_lyric = document.createElement('div')
            faDiv_lyric.innerHTML = '<i class="fa-solid fa-up-long up"></i><i class="fa-solid fa-down-long down"></i><i class="fa-solid fa-plus add"></i><i class="fa-regular fa-trash-can del"></i>'
            faDiv_lyric.className = 'container'
    
            const editVerse_lyricsDiv = document.createElement('div')
            const inputVerse_lyric = document.createElement('input')
            editVerse_lyricsDiv.appendChild(inputVerse_lyric)
            editVerse_lyricsDiv.appendChild(faDiv_lyric)
            editVerse_lyrics.appendChild(editVerse_lyricsDiv)
            
            inputVerse_lyric.value = lyric
        })
    })
}

const editSongLyrics = async(event) => {
    const whichSongId = document.querySelector('#altSelect').value !== '' ? document.querySelector('#altSelect').value : document.querySelector('#songSelect').value

    try {
        const res = await fetch('/songs/getSelected?' + new URLSearchParams({'id': whichSongId}))
        const data = await res.json()
        editSelectedSong(data.selected)
    } catch (e) {
        console.log(e)
    }

    document.querySelector('.editor').classList.remove('hidden')
    if (document.querySelector('#altSelect').value !== '') {
        document.querySelector('.updateVersion').classList.remove('hidden')
    }
}

const discardChanges = () => {
    document.querySelector('.editor').classList.add('hidden')
}

const docObject = async() => {
    const tempObj = {}
    tempObj.verses = []

    tempObj.parentSong = document.querySelector('#songSelect').value
    tempObj.title = document.querySelector('.editTitle').value
    tempObj.authors = document.querySelector('.editAuthors').value
    tempObj.cclinum = document.querySelector('.copyCclinum').innerHTML
    tempObj.cclilic = document.querySelector('.copyCclilic').innerHTML
    tempObj.copyright = document.querySelector('.editCopyright').value

    const verseArr = document.querySelector('.editVerses').children

    for (child of verseArr) {
        const lyricObj = {}
        const eachVerseArr = child.children

        for (each of eachVerseArr) {
            if (each.className === 'editVerse_type') {
                lyricObj.type = each.firstElementChild.value
            } else {
                eachLyricArr = each.children
                lyricObj.lyrics = []
                for (lyric of eachLyricArr) {
                    lyricObj.lyrics.push(lyric.value)
                }
            }
        }

        tempObj.verses.push(lyricObj)
    }

    return tempObj
}

const createVersion = async () => {
    const tempObj = await docObject()
    await createDoc(tempObj)
}

const updateVersion = async () => {
    try{
        const songId = document.querySelector('#altSelect').value
        const tempObj = await docObject()
        
        const res = await fetch('/songs/updateVersion', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'idFromJSFile': songId,
                'titleFromJSFile': tempObj.title,
                'authorsFromJSFile': tempObj.authors,
                'copyrightFromJSFile': tempObj.copyright,
                'versesFromJSFile': tempObj.verses,
            })
        })
        const data = await res.json()
        console.log(data)
    }catch(err){
        console.log(err)
    }
}

window.addEventListener('load', getSongList)
    
document.querySelector('.submit').addEventListener('click', postLyrics)

document.querySelector('#songSelect').addEventListener('change', getSelected)

document.querySelector('#altSelect').addEventListener('change', getSelected)

document.querySelector('.editSongLyrics').addEventListener('click', editSongLyrics)

document.querySelector('.discardChanges').addEventListener('click', discardChanges)

document.querySelector('.createVersion').addEventListener('click',createVersion)

document.querySelector('.updateVersion').addEventListener('click',updateVersion)