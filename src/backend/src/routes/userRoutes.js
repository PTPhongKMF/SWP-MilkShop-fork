import express from 'express';
import { UserController } from '../controllers/userController.js';
import { OrderController } from '../controllers/orderController.js';
import { PreorderController } from '../controllers/PreorderController.js';
import dotenv from 'dotenv';
import { checkAuthenticated } from '../middlewares/authMiddleware.js';
import { checkUserId } from '../middlewares/userValidators.js';
import { checkPaginationQuery } from '../middlewares/utilsMiddleware.js';
import { checkChangePassword, checkImageUpload } from '../middlewares/validationMiddleware.js';
import multer from 'multer';

dotenv.config();

const router = express.Router();
const upload = multer();

const userController = new UserController();
const orderController = new OrderController();
const preorderController = new PreorderController();

router.get('/:userId', userController.getUserInfo);
router.put('/:userId', upload.single('profilePicture'), checkImageUpload, userController.updateUserInfo);
router.post('/change-password', checkAuthenticated, checkChangePassword, userController.changePassword);

/** /api/user/{..userId..}/order-history?limit={...}&page={...}&sort={...}
 * Lấy toàn bộ lịch sử mua hàng order của 1 user
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/:userId/order-history", checkAuthenticated, checkUserId, checkPaginationQuery, async (req, res) => {
    await orderController.getUserOrderHistory(req, res);
})

/** /api/user/{..userId..}/preorder-history?limit={...}&page={...}&sort={...}
 * Lấy toàn bộ lịch sử mua hàng pre-order của 1 user
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/:userId/preorder-history", checkAuthenticated, checkUserId, checkPaginationQuery, async (req, res) => {
    await preorderController.getUserPreorderHistory(req, res);
})

export { router as userRoutes };