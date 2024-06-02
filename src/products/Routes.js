const express = require("express");
const Product = require("./Modal");
const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
  var query = {};
  let { q } = req.query;

  if (q !== "") {
    query = { $or: [{ model_number: q }, { service_tag: q }] };
  } else {
    query = {};
  }
  try {
    const products = await Product.find(query);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
