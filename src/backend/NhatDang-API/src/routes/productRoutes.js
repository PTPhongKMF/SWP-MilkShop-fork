const express = require('express');
const { getAllProducts, getProductById } = require('../services/productService');
const router = express.Router();

router.get('/', (req, res) => {
    getAllProducts((err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(products);
    });
});

router.get('/:productId', (req, res) => {
    const { productId } = req.params;
    getProductById(productId, (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        if (product.status) return res.status(product.status).json({ message: product.message });
        res.status(200).json(product);
    });
});

module.exports = router;
