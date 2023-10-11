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
        const res = await fetch('/postSongs', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'isOriginalFromJSFile': true,
                'titleFromJSFile': fileContents.title,
                'authorsFromJSFile': fileContents.authors,
                'ccliNumFromJSFile': fileContents.cclinum,
                'ccliLicFromJSFile': fileContents.cclilic,
                'copyrightFromJSFile': fileContents.copyright,
                'versesFromJSFile': fileContents.verses,
            })
        })
        const data = await res.json()
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}

const getSelected = async(event) => {
    try {
        const songId = document.querySelector('#songSelect').value
        const res = await fetch('/getSelected?' + new URLSearchParams({'id': songId}))
        const data = await res.json()
        console.log(data.selected)
        document.querySelector('.title').innerHTML = data.selected.title
        document.querySelector('.authors').innerHTML = data.selected.authors
        document.querySelector('.cclinum').innerHTML = data.selected.cclinum
        document.querySelector('.cclilic').innerHTML = data.selected.cclilic
        document.querySelector('.copyright').innerHTML = data.selected.copyright
        data.selected.verses.forEach(el => {
            const newVerse = document.createElement('section')
            if (el.type.includes('Chorus')) {
                newVerse.className = el.type.toLowerCase()
            } else {
                newVerse.className = 'verse'
            }
            document.querySelector('.lyrics').appendChild(newVerse)
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
    } catch (e) {
        console.log(e)
    }
}

document.querySelector('.submit').addEventListener('click', postLyrics)

document.querySelector('#songSelect').addEventListener('change', getSelected)
