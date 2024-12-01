import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

export const CartController = {
  // Ver carrito
  async viewCart(req, res) {
    const cartId = req.params.id;
    try {
      const cart = await Cart.findById(cartId).populate("products.product");
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.render("cart/cart", { cart }); // Renderizar vista 'cart/cart.handlebars'
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error obteniendo el carrito: ${error.message}` });
    }
  },

  // Agregar producto al carrito
  async addProductToCart(req, res) {
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

      const productInCart = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      res.redirect(`/cart/${cartId}`);
    } catch (error) {
      res.status(500).json({
        error: `Error añadiendo el producto al carrito: ${error.message}`,
      });
    }
  },

  // Eliminar producto del carrito
  async removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const updatedProducts = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      if (updatedProducts.length === cart.products.length) {
        return res
          .status(404)
          .json({ error: "Producto no encontrado en el carrito" });
      }

      cart.products = updatedProducts;
      await cart.save();
      res.redirect(`/cart/${cartId}`);
    } catch (error) {
      res.status(500).json({
        error: `Error eliminando el producto del carrito: ${error.message}`,
      });
    }
  },

  // Vaciar carrito
  async clearCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      cart.products = [];
      await cart.save();
      res.redirect(`/cart/${cartId}`);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error vaciando el carrito: ${error.message}` });
    }
  },
};
