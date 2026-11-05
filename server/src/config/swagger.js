const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// Route files containing Swagger API documentation
const routeFiles = [
  path.resolve(__dirname, "../routes/health.routes.js"),
  path.resolve(__dirname, "../routes/user.routes.js"),
  path.resolve(__dirname, "../routes/course.routes.js"),
  path.resolve(__dirname, "../routes/enrollment.routes.js"),
  path.resolve(__dirname, "../routes/lesson.routes.js"),
  path.resolve(__dirname, "../routes/progress.routes.js"),
  path.join(__dirname, "../routes/review.routes.js"),
];

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "LearnSphere LMS API",
      version: "1.0.0",
      description: "API documentation for LearnSphere LMS",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
    },
  },

  apis: routeFiles,

  failOnErrors: true,
};

// Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(options);

// Display registered Swagger routes
console.log("Swagger files:", routeFiles);
console.log(
  "Swagger paths:",
  Object.keys(swaggerSpec.paths || {})
);

module.exports = swaggerSpec;
