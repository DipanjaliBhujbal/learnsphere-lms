const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: 3000,
    },

    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    requirements: [{
      type: String,
      trim: true,
    }],

    whatYouWillLearn: [{
      type: String,
      trim: true,
    }],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ instructor: 1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
