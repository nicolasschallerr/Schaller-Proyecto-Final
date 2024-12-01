import { Product } from "./models/Product.js";
import mongoose from "mongoose";

export const ProductController = {
  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      // Construcción de filtros dinámicos
      let filter = {};
      if (query) {
        filter = {
          $or: [
            { category: { $regex: query, $options: "i" } },
            { stock: query === "available" ? { $gt: 0 } : undefined },
          ],
        };
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort:
          sort === "asc"
            ? { price: 1 }
            : sort === "desc"
            ? { price: -1 }
            : undefined,
        lean: true,
      };

      const result = await Product.paginate(filter, options);

      const response = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: result.hasNextPage
          ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
          : null,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  async viewProduct(req, res) {
    const productId = req.params.id;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.render("product/product", { product });
    } catch (error) {
      res.status(500).json({
        error: `Error obteniendo el producto: ${error.message}`,
      });
    }
  },
};
