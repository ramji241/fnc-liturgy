const Liturgy = require('../models/Liturgy')

module.exports = {
    getLiturgy: async (req,res)=>{
        try{
            orderOfWorship = await Liturgy.findOne({date: new Date(req.query.date)},{order: true}).sort({elementOrder: 1})
            res.render('builder.ejs', {default: orderOfWorship.isDefault, id: orderOfWorship._id, date: req.query.date, order: orderOfWorship.order}) // dateFormat(orderOfWorship.date, 'yyyy-mm-dd') blanks out the order of worship?
        }catch(err){
            orderOfWorship = await Liturgy.findOne({isDefault: true},{order: true}).sort({elementOrder: 1})
            res.render('builder.ejs', {default: orderOfWorship.isDefault, id: undefined, date: req.query.date, order: orderOfWorship.order})
        }
    },
    postLiturgy: async (req, res)=>{
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
    putLiturgy: async (req, res)=>{
        try{
            let updateDefault = ''
            if (req.body.defOrderFromJSFile) {
                await Liturgy.findOneAndUpdate(
                    {isDefault: true},
                    {order: req.body.defOrderFromJSFile}
                )
                updateDefault = ' and the Default Liturgy'
            }
            await Liturgy.findOneAndUpdate(
                {_id: req.body.idFromJSFile},
                {order: req.body.orderFromJSFile}
            )
            res.json(`Updated Liturgy${updateDefault}!`)
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