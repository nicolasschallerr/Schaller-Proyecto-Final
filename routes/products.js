import express from "express";
import { Product } from "./models/Product";
const router = express.Router();

// GET todos los productos con filtros, paginación y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { category: query } : {}; // Filtro por categoría (si query está presente)
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort:
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}, // Ordenar por precio si sort está presente
    };

    const products = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? page - 1 : null,
      nextPage: products.hasNextPage ? page + 1 : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${page - 1}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${page + 1}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// GET un producto por ID
router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: `Error al obtener el producto: ${error.message}`,
    });
  }
});

// POST un nuevo producto con validación
router.post("/", async (req, res) => {
  const { title, price, thumbnail, category } = req.body;

  try {
    const newProduct = new Product({
      title,
      price,
      thumbnail: thumbnail || "/images/thumbnails/default.png",
      category: category || "General",
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error guardando el producto: ${error.message}` });
  }
});

export default router;
