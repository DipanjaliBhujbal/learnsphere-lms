require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");

const courses = [
  {
    title: "Java Programming - Beginner to Advanced",
    description: "Master Java programming from fundamentals to object-oriented programming, collections, exception handling, and modern Java concepts.",
    category: "Programming",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo1516321318423-f06f85e504b3",
    requirements: ["Basic computer knowledge", "Interest in programming"],
    whatYouWillLearn: ["Java fundamentals", "Object-oriented programming", "Collections framework", "Exception handling"]
  },
  {
    title: "Spring Boot and Microservices Masterclass",
    description: "Build production-style backend applications using Spring Boot, REST APIs, Spring Data JPA, authentication, and microservices fundamentals.",
    category: "Backend Development",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo1555066931-4365d14bab8c",
    requirements: ["Basic Java knowledge", "Understanding of REST APIs"],
    whatYouWillLearn: ["Spring Boot application development", "REST API development", "Spring Data JPA", "Microservices fundamentals"]
  },
  {
    title: "Python Programming from Scratch",
    description: "Learn Python through practical examples covering syntax, data structures, functions, object-oriented programming, and file handling.",
    category: "Programming",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo1526379095098-d400fd0bf935",
    requirements: ["Basic computer knowledge"],
    whatYouWillLearn: ["Python syntax", "Lists and dictionaries", "Functions and modules", "Object-oriented programming"]
  },
  {
    title: "React.js Frontend Development",
    description: "Learn to build interactive web applications using React components, hooks, state management, routing, and API integration.",
    category: "Frontend Development",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo1498050108023-c5249f4df085",
    requirements: ["HTML and CSS basics", "JavaScript fundamentals"],
    whatYouWillLearn: ["React components", "Props and state", "React hooks", "API integration"]
  },
  {
    title: "Node.js and Express Backend Development",
    description: "Develop backend applications with Node.js and Express, including REST APIs, middleware, authentication, and MongoDB integration.",
    category: "Backend Development",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo1515879218367-8466d910aaa4",
    requirements: ["JavaScript fundamentals", "Basic programming knowledge"],
    whatYouWillLearn: ["Node.js fundamentals", "Express REST APIs", "Middleware and authentication", "MongoDB integration"]
  },
  {
    title: "SQL and Database Management",
    description: "Learn relational databases, SQL queries, joins, aggregations, indexing, normalization, and database design through practical exercises.",
    category: "Database",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo1544383835-bda2bc66a55d",
    requirements: ["Basic computer knowledge"],
    whatYouWillLearn: ["SQL queries", "Joins and subqueries", "Database normalization", "Indexes and optimization"]
  },
  {
    title: "Data Structures and Algorithms in Java",
    description: "Strengthen problem-solving skills with arrays, strings, linked lists, stacks, queues, trees, graphs, sorting, and searching.",
    category: "Data Structures and Algorithms",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo1516116216624-53e697fedbea",
    requirements: ["Basic Java programming"],
    whatYouWillLearn: ["Arrays and strings", "Linked lists and trees", "Graphs and recursion", "Sorting and searching algorithms"]
  },
  {
    title: "System Design for Backend Developers",
    description: "Understand scalable backend architecture, caching, load balancing, databases, message queues, API design, and distributed systems.",
    category: "System Design",
    level: "advanced",
    thumbnail: "https://images.unsplash.com/photo1451187580459-43490279c0fa",
    requirements: ["Backend development experience", "Understanding of REST APIs", "Basic database knowledge"],
    whatYouWillLearn: ["Scalable architecture", "Caching and load balancing", "Database design", "Distributed systems fundamentals"]
  }
];

async function seedCourses() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const instructor = await User.findOne({
      role: { $in: ["instructor", "admin"] },
      isActive: { $ne: false }
    }).select("_id firstName lastName email role");

    if (!instructor) {
      throw new Error("No active instructor/admin account found. Create or promote an instructor first.");
    }

    console.log(
      `Using instructor: ${instructor.firstName} ${instructor.lastName}`
    );

    let inserted = 0;
    let existing = 0;

    for (const course of courses) {
      const result = await Course.updateOne(
        { title: course.title },
        {
          $setOnInsert: {
            ...course,
            instructor: instructor._id,
            price: 0,
            status: "published",
            enrollmentCount: 0,
            averageRating: 0
          }
        },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
        console.log(`ADDED: ${course.title}`);
      } else {
        existing++;
        console.log(`ALREADY EXISTS: ${course.title}`);
      }
    }

    console.log("\nCourse seeding completed.");
    console.log(`New courses added: ${inserted}`);
    console.log(`Already existing: ${existing}`);
    console.log(`Total processed: ${courses.length}`);
  } catch (error) {
    console.error("Course seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCourses();
