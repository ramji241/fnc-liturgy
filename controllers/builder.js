const Liturgy = require('../models/Liturgy')

module.exports = {
    getLiturgy: async (req,res)=>{
        try{
            orderOfWorship = await Liturgy.findOne({date: new Date(req.query.date)},{order: true}).sort({elementOrder: 1})
            res.render('builder.ejs', {date: new Date(req.query.date), order: orderOfWorship.order})
        }catch(err){
            orderOfWorship = await Liturgy.findOne({isDefault: true},{order: true}).sort({elementOrder: 1})
            res.render('builder.ejs', {date: req.query.date, order: orderOfWorship.order})
        }
    },
    postLiturgy: async (req, res)=>{
        console.log(req.body.orderFromJSFile)
        try{
            await Liturgy.create({
                date: req.body.dateFromJSFile,
                schedule: undefined,
                order: req.body.orderFromJSFile
            })
            res.json('Posted Liturgy!')
        }catch(err){
            console.log(err)
        }
    },
    // markComplete: async (req, res)=>{
    //     try{
    //         await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
    //             completed: true
    //         })
    //         console.log('Marked Complete')
    //         res.json('Marked Complete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    // markIncomplete: async (req, res)=>{
    //     try{
    //         await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
    //             completed: false
    //         })
    //         console.log('Marked Incomplete')
    //         res.json('Marked Incomplete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    // deleteTodo: async (req, res)=>{
    //     console.log(req.body.todoIdFromJSFile)
    //     try{
    //         await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
    //         console.log('Deleted Todo')
    //         res.json('Deleted It')
    //     }catch(err){
    //         console.log(err)
    //     }
    // }
}    