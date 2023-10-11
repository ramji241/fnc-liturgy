const mongoose = require('mongoose')

const VerseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    lyrics: {
      type: Array,
      required: true
    }
  }
)

const SongSchema = new mongoose.Schema(
  {
    isOriginal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    authors: {
      type: String,
      required: false
    },
    copyright: {
      type: String,
      required: false
    },
    cclinum: {
      type: String,
      required: false
    },
    cclilic: {
      type: String,
      required: false
    },
    verses: {
      type: [VerseSchema]
    }
  },
  {
    collection: 'songs'
  }
)

module.exports = mongoose.model('Songs', SongSchema)
