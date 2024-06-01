import { poolConnect, connection } from "../utils/dbConnection.js";


export class ProductService {
    // Lấy thông tin của 1 product bằng ID
    async getProduct(id) {
        const [product] = await poolConnect.query('SELECT * FROM product WHERE ProductID = ?', [id]);
        return product;
    }

    // tìm product trong database bằng name
    async searchProducts(name) {
        const search = `%${name}%`;
        const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        return products;
    }

    // 
    getAllProducts = (callback) => {
        const query = 'SELECT * FROM PRODUCT';
        connection.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    };

}