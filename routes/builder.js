const express = require('express')
const router = express.Router()
const builderController = require('../controllers/builder') 
// const builder = require('../controllers/builder')
// const { ensureAuth } = require('../middleware/auth')

// router.get('/', ensureAuth, todosController.getTodos)

router.get('/getLiturgy', builderController.getLiturgy)

router.post('/postLiturgy', builderController.postLiturgy)

router.put('/putLiturgy', builderController.putLiturgy)

// router.put('/markIncomplete', todosController.markIncomplete)

// router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router