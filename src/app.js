import express from "express";
import { connect } from "http2";

const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const path = require("path");

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = require("socket.io")(server);
const connectDB = require("./src/db");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));
connectDB();

//Middleware
app.use(express.json());
//Metodo POST
app.use(express.urlencoded({ extended: true }));

// Rutas para products
const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);
app.use("/", viewRoutes);
// Rutas para carts
const cartsRouter = require("./routes/carts");
app.use("/api/carts", cartsRouter);

io.on("connection", (socket) => {
  console.log("Cliente conectado");
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

//Puerto del servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
