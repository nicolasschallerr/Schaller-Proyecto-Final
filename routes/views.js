const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/home", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/productos.json"), "utf-8")
  );
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/productos.json"), "utf-8")
  );
  res.render("realTimeProducts", { products });
});

module.exports = router;
