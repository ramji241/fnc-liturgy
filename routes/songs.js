const express = require('express')
const router = express.Router()
const songsController = require('../controllers/songs')

router.get('/songDirectory', songsController.loadDirectory)
router.post('/postSongs', songsController.postSongs)
// router.get('/getSongs', songsController.getSongs)

module.exports = router