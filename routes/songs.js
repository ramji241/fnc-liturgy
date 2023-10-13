const express = require('express')
const router = express.Router()
const songsController = require('../controllers/songs')

router.get('/', songsController.loadDirectory)
router.get('/getSongs', songsController.getSongs)
router.get('/getSelected', songsController.getSelected)
router.post('/postSongs', songsController.postSongs)
router.put('/updateVersion', songsController.updateVersion)

module.exports = router