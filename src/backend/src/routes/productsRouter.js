import { Router } from "express";

import { checkPSearchString } from "../middlewares/validators.js";
import { getProducts } from "../services/productsServices.js";

const router = Router();

/* Search product, lấy data trong query của URL: api/product/search?n={...}
* Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ product
*/
router.get("/search", checkPSearchString, async (req, res) => {
    const name = req.query.n;
    
    const products = await getProducts(name);
    res.status(200).send(products);
});



// export router
export default router;