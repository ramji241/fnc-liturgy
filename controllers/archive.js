const Liturgy = require('../models/Liturgy')

module.exports = {
    getArchive: async (req,res)=>{
        try{
            docs = await Liturgy.find({$or: [{isDefault: {$exists: false}}, {isDefault: false}]}).sort({date: 1})
            res.render('archive.ejs', docs)
        }catch(err){
            console.log(err)
        }
    },
}