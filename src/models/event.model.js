const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    eventName: {
      type: String,
      lowercase: true,
      trim: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventMonth: {
      type: Number,
      min: 1,
      max: 12,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

eventSchema.index({ eventDate: 1, eventName: 1 }, { unique: true });

// Set the `toJSON` and `toObject` transformation options
eventSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.eventName) {
      ret.eventName =
        ret.eventName.charAt(0).toUpperCase() + ret.eventName.slice(1);
    }
    return ret;
  },
});

eventSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.eventName) {
      ret.eventName =
        ret.eventName.charAt(0).toUpperCase() + ret.eventName.slice(1);
    }
    return ret;
  },
});

const Event = model("Event", eventSchema);

Event.ensureIndexes();
module.exports = Event;
