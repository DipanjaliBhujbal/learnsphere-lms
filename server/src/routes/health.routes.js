const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check LearnSphere API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LearnSphere API is running",
  });
});

module.exports = router;