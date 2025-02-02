import { body, query, check, validationResult, matchedData, param } from 'express-validator';
import multer from 'multer';

// kiểm tra id data đầu vào cho blog
export async function checkBlogId(req, res, next) {
    await param("id")
        .trim()
        .exists().withMessage("ID is required!")
        .notEmpty().withMessage("ID can not be blank!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

// kiểm tra data đầu vào cho search blog 
export async function checkBlogSearch(req, res, next) {
    await query("content")
        .default("")
        .trim()
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    
    Object.assign(req.query, matchedData(req));
    next();
}

export async function checkPaginationQueryForBlog(req, res, next) {
    await query("limit")
    .default("20")
    .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("invalid limit input! limit must be an integer number and no less than 1")
    .trim()
    .escape()
    .run(req);

await query("page")
    .default("1")
    .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("invalid page input! page must be an integer number and no less than 1")
    .trim()
    .escape()
    .run(req);

const sortList = ["newest", "oldest"];
await query("sort")
    .default("newest")
    .trim()
    .escape()
    .toLowerCase()
    .isIn(sortList).withMessage(`invalid sort input! sort can only be: ${sortList.join(", ")}`)
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    
    Object.assign(req.query, matchedData(req));
    next();
}

export async function checkBlogData(req, res, next){
    await body("title")
    .exists().withMessage('Title is required')
    .notEmpty().withMessage('Title cannot be empty')
    .trim()
    .run(req);

    await body("content")
    .exists().withMessage('Content is required')
    .notEmpty().withMessage('Content cannot be empty')
    .trim()
    .run(req);

    await body("productList")
    .exists().withMessage('Product list is required')
    .notEmpty().withMessage('Product list cannot be empty')
    .trim()
    .escape()
    .customSanitizer((value) =>
        value.split(",").map(product => product.trim())
    )
    .isArray({ min: 1 }).withMessage("Product list must be a list (example: P001, P002,...) and consisted of at least 1 product")
    .run(req);

    await check("file")
    .custom((value) => {
        if (!req.file) throw new Error;
        else return true;
    }).withMessage("Image is required")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    
    Object.assign(req.body, matchedData(req));
    next();
}

export async function checkBlogUpdateData(req, res, next){
    await body("title")
    .optional({ values: "falsy" })
    .trim()
    .run(req);

    await body("content")
    .optional({ values: "falsy" })
    .trim()
    .run(req);

    await body("productList")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .customSanitizer((value) =>
        value.split(",").map(product => product.trim())
    )
    .isArray({ min: 1 }).withMessage("Product list must be a list (example: P001, P002,...) and consisted of at least 1 product")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    
    Object.assign(req.query, matchedData(req));
    next();
}

export async function multerBlogFileErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size limit exceeded, we only allowed 15MB below' });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
}