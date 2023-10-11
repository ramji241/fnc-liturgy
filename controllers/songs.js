const Songs = require('../models/Songs')

module.exports = {
    getSongs: async (req, res) => {
        try {
            songs = await Songs.find().sort({title: 1})
            res.render('songs.ejs', songs)
        } catch (err) {
            console.log(err)
        }
    },
    postSongs: async (req, res)=>{
        try{
            await Songs.create({
                isOriginal: req.body.isOriginalFromJSFile,
                title: req.body.titleFromJSFile,
                authors: req.body.authorsFromJSFile,
                cclinum: req.body.ccliNumFromJSFile,
                cclilic: req.body.ccliLicFromJSFile,
                copyright: req.body.copyrightFromJSFile,
                verses: req.body.versesFromJSFile
            })
            res.json('Posted Song!')
        }catch(err){
            console.log(err)
        }
    },
    getSelected: async (req, res) => {
        try {
            selected = await Songs.findById(req.query.id)
            res.send({selected})
        } catch (err) {
            console.log(err)
        }
    }
}