const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    moduleTitle: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ course: 1, moduleTitle: 1, order: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
