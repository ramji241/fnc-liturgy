const Liturgy = require('../models/Liturgy')

module.exports = {
    getLiturgy: async (req,res)=>{
        let orderOfWorship = [
            {_id: 'default-00', elementType: 'Scripture', elementSubtype: 'Memory Verse', elementRef: undefined, elementOrder: 0}, 
            {_id: 'default-01', elementType: 'Scripture', elementSubtype: 'Call to Worship', elementRef: undefined, elementOrder: 1}, 
            {_id: 'default-02', elementType: 'Song', elementSubtype: 'Songs of Adoration', elementRef: undefined, elementOrder: 2}, 
            {_id: 'default-03', elementType: 'Scripture', elementSubtype: 'Conviction of Sin', elementRef: undefined, elementOrder: 3}, 
            {_id: 'default-04', elementType: 'Scripture', elementSubtype: 'Assurance of Pardon', elementRef: undefined, elementOrder: 4}, 
            {_id: 'default-05', elementType: 'Song', elementSubtype: 'Songs of Praise', elementRef: undefined, elementOrder: 5}, 
            {_id: 'default-06', elementType: 'Scripture', elementSubtype: 'Invitation to Pray', elementRef: undefined, elementOrder: 6}, 
            {_id: 'default-07', elementType: 'Scripture', elementSubtype: 'Reading of the Word', elementRef: undefined, elementOrder: 7}, 
            {_id: 'default-08', elementType: 'Song', elementSubtype: 'Songs of Thanksgiving', elementRef: undefined, elementOrder: 8}
        ]
        // let orderOfWorship = []
        try{
            if (req.body.date) {
                orderOfWorship = await Liturgy.find(lookupDate).sort({elementOrder: 1})   
            }
            res.render('builder.ejs', {order: orderOfWorship})
        }catch(err){
            console.log(err)
        }
    },
    postLiturgy: async (req, res)=>{
        console.log(req.body.orderFromJSFile)
        try{
            await Liturgy.create({
                date: req.body.date,
                schedule: undefined,
                order: req.body.orderFromJSFile
            })
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