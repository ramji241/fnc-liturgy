const express = require('express')
const router = express.Router()
// const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const builderController = require('../controllers/builder') 
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/getLiturgy', builderController.getLiturgy)
router.post('/postLiturgy', builderController.postLiturgy)
router.put('/putLiturgy', builderController.putLiturgy)

// router.get('/login', authController.getLogin)
// router.post('/login', authController.postLogin)
// router.get('/logout', authController.logout)
// router.get('/signup', authController.getSignup)
// router.post('/signup', authController.postSignup)

module.exports = router