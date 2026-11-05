const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require("../validators/user.validator");

const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new student account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Dipanjali
 *               lastName:
 *                 type: string
 *                 example: Bhujbal
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email is already registered
 */
router.post(
  "/auth/register",
  registerValidator,
  validate,
  userController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to a LearnSphere account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Account deactivated
 */
router.post(
  "/auth/login",
  loginValidator,
  validate,
  userController.login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Account deactivated
 */
router.get(
  "/auth/me",
  protect,
  userController.getMe
);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Dipanjali
 *               lastName:
 *                 type: string
 *                 example: Bhujbal
 *               bio:
 *                 type: string
 *                 example: Backend developer interested in building scalable applications.
 *               profileImage:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.put(
  "/auth/profile",
  protect,
  updateProfileValidator,
  validate,
  userController.updateProfile
);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid current password or authentication required
 *       404:
 *         description: User not found
 */
router.put(
  "/auth/change-password",
  protect,
  changePasswordValidator,
  validate,
  userController.changePassword
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Generate a new access token using a refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *       403:
 *         description: Account deactivated
 */
router.post(
  "/auth/refresh",
  userController.refreshToken
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from a LearnSphere account
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  "/auth/logout",
  userController.logout
);

module.exports = router;
