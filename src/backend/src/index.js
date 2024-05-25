import express from "express";
import productsRouter from "./routes/productsRouter.js";

const PORT = 8080; // tùy chọn cổng kết nối localhost:xxxx

const app = express(); // khởi chạy express
app.use(express.json()); // dùng json

/***** API có bảo mật ********/


/***** API không bảo mật ****/

// API liên quan đến product
app.use("/api/products", productsRouter);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bắt error bị lọt qua các check
app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).send({
        status: "error",
        statusCode,
        message,
    });
});

// đảm bảo server khởi chạy
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});