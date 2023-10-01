const express = require('express')
const router = express.Router()
const builderController = require('../controllers/builder') 
// const { ensureAuth } = require('../middleware/auth')

// router.get('/', ensureAuth, todosController.getTodos)
router.get('/', builderController.buildLiturgy)

// router.post('/createTodo', todosController.createTodo)

// router.put('/markComplete', todosController.markComplete)

// router.put('/markIncomplete', todosController.markIncomplete)

// router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router