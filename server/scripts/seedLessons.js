require("dotenv").config();

const mongoose = require("mongoose");
const Course = require("../src/models/course.model");
const Lesson = require("../src/models/lesson.model");

const courseLessons = {
  "Java Programming - Beginner to Advanced": [
    {
      moduleTitle: "Java Fundamentals",
      title: "Introduction to Java and Setup",
      description: "Understand Java, JDK, JRE, JVM and set up your development environment.",
      content: "Java is an object-oriented programming language. The JVM executes Java bytecode, the JRE provides the runtime environment, and the JDK includes development tools. Install a JDK and configure IntelliJ IDEA or VS Code. Write and execute your first Hello World program.",
      durationMinutes: 20,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "Java Fundamentals",
      title: "Variables, Data Types and Operators",
      description: "Learn Java variables, primitive data types and operators.",
      content: "Java primitive types include byte, short, int, long, float, double, char and boolean. Variables store values. Operators include arithmetic, relational, logical and assignment operators. Practice declaring variables and evaluating expressions.",
      durationMinutes: 25,
      order: 2
    },
    {
      moduleTitle: "Object-Oriented Programming",
      title: "Classes, Objects and Inheritance",
      description: "Understand the core concepts of object-oriented programming.",
      content: "A class defines the structure and behavior of objects. Objects are instances of classes. Inheritance allows one class to reuse another class's properties and methods. Also explore encapsulation, polymorphism and abstraction through simple Java examples.",
      durationMinutes: 35,
      order: 3
    }
  ],

  "Spring Boot and Microservices Masterclass": [
    {
      moduleTitle: "Spring Boot Fundamentals",
      title: "Introduction to Spring Boot",
      description: "Understand Spring Boot architecture and project setup.",
      content: "Spring Boot simplifies Spring application development through auto-configuration, starter dependencies and embedded servers. Create a project using Spring Initializr and explore the main application class and application.properties.",
      durationMinutes: 25,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "REST API Development",
      title: "Building REST APIs with Spring Boot",
      description: "Create REST endpoints using Spring MVC.",
      content: "Use @RestController to create REST controllers. Map HTTP methods using @GetMapping, @PostMapping, @PutMapping and @DeleteMapping. Use request bodies, path variables and response entities to build CRUD endpoints.",
      durationMinutes: 35,
      order: 2
    },
    {
      moduleTitle: "Microservices Architecture",
      title: "Microservices Communication",
      description: "Learn how independent services communicate.",
      content: "Microservices divide an application into independently deployable services. Services can communicate synchronously through REST APIs or asynchronously through message brokers. Understand service boundaries, API contracts, failure handling and service discovery.",
      durationMinutes: 40,
      order: 3
    }
  ],

  "Python Programming from Scratch": [
    {
      moduleTitle: "Python Basics",
      title: "Introduction to Python",
      description: "Set up Python and write your first program.",
      content: "Python is a high-level programming language known for readable syntax. Install Python and configure an editor. Run your first print statement and understand indentation, comments and basic program execution.",
      durationMinutes: 20,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "Python Basics",
      title: "Variables, Data Types and Collections",
      description: "Work with Python variables and built-in collections.",
      content: "Learn integers, floats, strings and booleans. Explore lists, tuples, sets and dictionaries. Practice accessing, updating and iterating through collection elements.",
      durationMinutes: 30,
      order: 2
    },
    {
      moduleTitle: "Functions and OOP",
      title: "Functions and Object-Oriented Programming",
      description: "Organize Python programs using functions and classes.",
      content: "Functions are defined using def and can accept parameters and return values. Classes define objects using attributes and methods. Explore constructors, inheritance and encapsulation through practical examples.",
      durationMinutes: 35,
      order: 3
    }
  ],

  "React.js Frontend Development": [
    {
      moduleTitle: "React Fundamentals",
      title: "Introduction to React",
      description: "Understand React and create your first application.",
      content: "React is a JavaScript library for building user interfaces. Learn about components, JSX and the virtual DOM. Set up a React project and render your first component.",
      durationMinutes: 25,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "Components and Hooks",
      title: "Props, State and React Hooks",
      description: "Manage component data and application state.",
      content: "Props pass data between components, while state stores data that changes over time. Learn useState for state management and useEffect for handling side effects. Practice building interactive components.",
      durationMinutes: 35,
      order: 2
    },
    {
      moduleTitle: "API Integration",
      title: "Connecting React with REST APIs",
      description: "Fetch and display backend data in React.",
      content: "Use fetch or Axios to communicate with REST APIs. Understand loading states, error handling and JSON responses. Build a component that retrieves and displays data from a backend endpoint.",
      durationMinutes: 30,
      order: 3
    }
  ],

  "Node.js and Express Backend Development": [
    {
      moduleTitle: "Node.js Fundamentals",
      title: "Introduction to Node.js",
      description: "Understand Node.js and its runtime architecture.",
      content: "Node.js executes JavaScript outside the browser using the V8 engine. Learn about npm, modules, package.json and asynchronous programming. Create and run your first Node.js application.",
      durationMinutes: 25,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "Express REST APIs",
      title: "Building APIs with Express",
      description: "Create HTTP endpoints using Express.",
      content: "Express is a lightweight Node.js web framework. Configure an Express server, define routes, handle requests and responses, and organize endpoints using routers and controllers.",
      durationMinutes: 35,
      order: 2
    },
    {
      moduleTitle: "Backend Integration",
      title: "Middleware, Authentication and MongoDB",
      description: "Connect databases and secure backend routes.",
      content: "Middleware processes requests before they reach route handlers. Learn request validation, error-handling middleware and JWT authentication. Connect Express to MongoDB using Mongoose and implement basic CRUD operations.",
      durationMinutes: 40,
      order: 3
    }
  ],

  "SQL and Database Management": [
    {
      moduleTitle: "SQL Fundamentals",
      title: "Introduction to Relational Databases",
      description: "Understand tables, rows, columns and relational database concepts.",
      content: "A relational database organizes data into tables. Learn primary keys, foreign keys, relationships and basic database operations. Explore how SQL is used to query and manage structured data.",
      durationMinutes: 20,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "SQL Queries",
      title: "SELECT, JOIN and Aggregate Queries",
      description: "Retrieve and analyze data using SQL.",
      content: "Use SELECT, WHERE, ORDER BY and GROUP BY to query data. Learn INNER JOIN and LEFT JOIN to combine related tables. Practice COUNT, SUM, AVG, MIN and MAX aggregate functions.",
      durationMinutes: 35,
      order: 2
    },
    {
      moduleTitle: "Database Design",
      title: "Normalization and Indexing",
      description: "Design efficient databases and improve query performance.",
      content: "Normalization reduces data duplication and update anomalies. Learn first, second and third normal forms. Indexes help databases locate records faster, but excessive indexing can increase write costs.",
      durationMinutes: 30,
      order: 3
    }
  ],

  "Data Structures and Algorithms in Java": [
    {
      moduleTitle: "Linear Data Structures",
      title: "Arrays and Strings",
      description: "Learn array operations and common string problems.",
      content: "Arrays store elements in contiguous indexed positions. Learn traversal, insertion, deletion and searching. Explore strings, character arrays, two pointers and sliding window techniques.",
      durationMinutes: 30,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "Linear Data Structures",
      title: "Linked Lists, Stacks and Queues",
      description: "Understand common linear data structures.",
      content: "A linked list stores elements in nodes connected by references. A stack follows Last In First Out, while a queue follows First In First Out. Implement these structures in Java and understand their common use cases.",
      durationMinutes: 40,
      order: 2
    },
    {
      moduleTitle: "Algorithms",
      title: "Searching, Sorting and Complexity Analysis",
      description: "Learn algorithms and analyze their efficiency.",
      content: "Study linear search, binary search, bubble sort, merge sort and quicksort. Understand time and space complexity using Big O notation. Compare algorithm performance on different input sizes.",
      durationMinutes: 40,
      order: 3
    }
  ],

  "System Design for Backend Developers": [
    {
      moduleTitle: "System Design Fundamentals",
      title: "Introduction to System Design",
      description: "Understand scalability, availability and system requirements.",
      content: "System design defines how software components work together. Learn functional and non-functional requirements, scalability, availability, reliability and performance. Start with simple client-server architecture.",
      durationMinutes: 25,
      order: 1,
      isPreview: true
    },
    {
      moduleTitle: "Backend Architecture",
      title: "Load Balancing, Caching and Databases",
      description: "Explore common backend scalability techniques.",
      content: "Load balancers distribute incoming traffic across servers. Caching reduces repeated database queries and improves response time. Understand relational and NoSQL databases, replication and partitioning.",
      durationMinutes: 40,
      order: 2
    },
    {
      moduleTitle: "Distributed Systems",
      title: "Message Queues and Distributed Systems",
      description: "Understand asynchronous communication and distributed architecture.",
      content: "Message queues enable asynchronous communication between services. Learn producers, consumers, topics, partitions and retries. Explore consistency, fault tolerance, idempotency and the role of distributed systems.",
      durationMinutes: 40,
      order: 3
    }
  ]
};

async function seedLessons() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    let added = 0;
    let existing = 0;

    for (const [courseTitle, lessons] of Object.entries(courseLessons)) {
      const course = await Course.findOne({ title: courseTitle });

      if (!course) {
        console.log(`COURSE NOT FOUND: ${courseTitle}`);
        continue;
      }

      console.log(`\nProcessing: ${courseTitle}`);

      for (const lessonData of lessons) {
        const alreadyExists = await Lesson.findOne({
          course: course._id,
          title: lessonData.title
        });

        if (alreadyExists) {
          existing++;
          console.log(`ALREADY EXISTS: ${lessonData.title}`);
          continue;
        }

        await Lesson.create({
          ...lessonData,
          course: course._id,
          videoUrl: "",
          isPublished: true
        });

        added++;
        console.log(`ADDED: ${lessonData.title}`);
      }
    }

    console.log("\nLesson seeding completed.");
    console.log(`New lessons added: ${added}`);
    console.log(`Already existing: ${existing}`);
    console.log(`Total processed: ${added + existing}`);
  } catch (error) {
    console.error("Lesson seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedLessons();
