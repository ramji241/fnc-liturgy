const { ReturnDocument } = require('mongodb')
const Songs = require('../models/Songs')

module.exports = {
    loadDirectory: (req, res) => {
        res.render('songs.ejs')
    },
    getSongs: async (req, res) => {
        try {
            songList = await Songs.find({$or: [{parentSong: {$exists: false}}, {parentSong: null}]}).sort({title: 1})
            res.send(songList)
        } catch (err) {
            console.log(err)
        }
    },
    postSongs: async (req, res) => {
        try{
            await Songs.create({
                parentSong: req.body.parentSongFromJSFile,
                title: req.body.titleFromJSFile,
                authors: req.body.authorsFromJSFile,
                cclinum: req.body.ccliNumFromJSFile,
                cclilic: req.body.ccliLicFromJSFile,
                copyright: req.body.copyrightFromJSFile,
                verses: req.body.versesFromJSFile
            })
            res.json('Posted Song!')
        } catch (err) {
            console.log(err)
        }
    },
    getSelected: async (req, res) => {
        try {
            selected = await Songs.findById(req.query.id)
            alternates = await Songs.find({parentSong: req.query.id})
            res.send({selected, alternates})
        } catch (err) {
            res.sendStatus(400)
        }
    },
    updateVersion: async (req, res)=>{
        try{
            update = await Songs.findOneAndUpdate(
                {_id: req.body.idFromJSFile},
                {
                    title: req.body.titleFromJSFile,
                    authors: req.body.authorsFromJSFile,
                    copyright: req.body.copyrightFromJSFile,
                    verses: req.body.versesFromJSFile
                },
                {returnDocument: 'after'}
            )
            alternates = await Songs.find({parentSong: update.parentSong})
            res.send({update, alternates})
        }catch(err){
            console.log(err)
        }
    },
}