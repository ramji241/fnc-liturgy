const mongoose = require('mongoose')

const ElementSchema = new mongoose.Schema(
  {
    elementType: {
      type: String,
      required: true
    },
    elementSubtype: {
      type: String,
      required: false,
      default: undefined
    },
    elementRef: {
      type: String,
      required: true
    },
    elementOrder: {
      type: Number,
      required: true
    }
  }
)

// const OrderSchema = new mongoose.Schema(
//   {
//     elements: {
//       type: [ElementSchema]
//     }
//   }
// )

const ScheduleSchema = new mongoose.Schema(
  {
    idWorshipLeader: {
      type: String,
      required: false,
    },
    idPraiseLeader: {
      type: String,
      required: false,
    },
    idPreacher: {
      type: String,
      required: false,
    },
    idAVTech: {
      type: String,
      required: false,
    },
    idMealPlanner: {
      type: String,
      required: false,
    },
    idSetup: {
      type: String,
      required: false,
    },
    idTeardown: {
      type: String,
      required: false,
    }
  }
)

const LiturgySchema = new mongoose.Schema(
  {
    isDefault: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      required: true
    },
    schedule: {
      type: ScheduleSchema,
      default: undefined
    },
    order: {
      type: [ElementSchema]
    }
  },
  {
    collection: 'liturgies'
  }
)

module.exports = mongoose.model('Liturgy', LiturgySchema)
