import express from "express";
import { Cart } from "./models/Cart";
import { Product } from "./models/Product";

const router = express.Router();

// OBTENER carrito por ID
router.get("/:id", async (req, res) => {
  const cartId = req.params.id;
  try {
    const cart = await Cart.findById(cartId).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({
      error: `Error obteniendo el carrito: ${error.message}`,
    });
  }
});

// POST para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save(); // Guardar el nuevo carrito en la base de datos
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({
      error: `Error creando el carrito: ${error.message}`,
    });
  }
});

// POST para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await Cart.findById(cartId);
    const product = await Product.findById(productId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity += 1; // Aumentar la cantidad si ya existe
    } else {
      cart.products.push({ product: productId, quantity: 1 }); // Agregar producto al carrito
    }

    await cart.save(); // Guardar cambios en el carrito
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({
      error: `Error añadiendo el producto al carrito: ${error.message}`,
    });
  }
});

// DELETE para eliminar un producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Filtrar el producto para eliminarlo del carrito
    const updatedProducts = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    if (updatedProducts.length === cart.products.length) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products = updatedProducts; // Asignar el carrito actualizado
    await cart.save(); // Guardar cambios en el carrito
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      error: `Error eliminando el producto del carrito: ${error.message}`,
    });
  }
});

// DELETE para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = []; // Vaciar todos los productos en el carrito
    await cart.save(); // Guardar cambios en el carrito
    res.status(200).json({ message: "Carrito vacío correctamente" });
  } catch (error) {
    res.status(500).json({
      error: `Error vaciando el carrito: ${error.message}`,
    });
  }
});

export default router;
