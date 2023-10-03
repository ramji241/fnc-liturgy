const Liturgy = require('../models/Liturgy')

module.exports = {
    getLiturgy: async (req,res)=>{
        let orderOfWorship = [
            {elementType: 'Memory Verse', elementRef: undefined, elementOrder: 0}, 
            {elementType: 'Call to Worship', elementRef: undefined, elementOrder: 1}, 
            {elementType: 'Songs of Adoration', elementRef: undefined, elementOrder: 2}, 
            {elementType: 'Conviction of Sin', elementRef: undefined, elementOrder: 3}, 
            {elementType: 'Assurance of Pardon', elementRef: undefined, elementOrder: 4}, 
            {elementType: 'Songs of Praise', elementRef: undefined, elementOrder: 5}, 
            {elementType: 'Invitation to Pray', elementRef: undefined, elementOrder: 6}, 
            {elementType: 'Reading of the Word', elementRef: undefined, elementOrder: 7}, 
            {elementType: 'Songs of Thanksgiving', elementRef: undefined, elementOrder: 8}
        ]
        try{
            if (req.body.date) {
                orderOfWorship = await Liturgy.find(lookupDate).sort({elementOrder: 1})
            }
            res.render('builder.ejs', {order: orderOfWorship})
        }catch(err){
            console.log(err)
        }
    },
    // createTodo: async (req, res)=>{
    //     try{
    //         await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id})
    //         console.log('Todo has been added!')
    //         res.redirect('/todos')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
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