import { Router } from "express";
import { checkMemberId } from "../middlewares/memberValidators.js";
import { WishlistController } from "../controllers/WishlistController.js";
import { checkProductIdInQuery } from "../middlewares/productValidators.js";
const router = Router();
const wishlistController = new WishlistController();
/** URL: localhost:xxxx/api/wishlist/{...}
 * Lấy danh sách wishlist bằng member id
 * - {...} là member ID, ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/api/wishlist/:id", checkMemberId, async (req, res) => {
    await wishlistController.getWishlist(req, res);
});
/** URL: localhost:xxxx/api/wishlist/{...}?productId={...}
 * Thêm 1 product vào wishlist của 1 member thông qua productID và memberID
 * - {...} là member ID, ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 * - "productId" là id của product, không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.post("/api/wishlist/:id", checkMemberId, checkProductIdInQuery, async (req, res) => {
    await wishlistController.addProductToWishlist(req, res);
    // chờ ông nhật xong login/logout thì cập nhật bảo mật kiểm tra JWT sau
});
/** URL: localhost:xxxx/api/wishlist/{...}?productId={...}
 * Xóa 1 product khỏi wishlist của 1 member thông qua productID và memberID
 * - {...} là member ID, ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 * - "productId" là id của product, không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.delete("/api/wishlist/:id", checkMemberId, checkProductIdInQuery, async (req, res) => {
    await wishlistController.removeProductFromWishlist(req, res);
    // chờ ông nhật xong login/logout thì cập nhật bảo mật kiểm tra JWT sau
});
// export router
export { router as wishlistRoutes };
