import express from "express";
const router = express.Router();

import { ReqError } from "../util/errorHandler.mjs";
import jwtValidator from "../util/jwtValidator.mjs";
import {
  getProducts,
  getCategory,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../util/dbQueries.mjs";

router.all("/", jwtValidator, (req, res) => {
  if (req.method === "GET") {
    // let data = products;

    // const { category } = req.query;

    // if (category) {
    //   data = products.filter(
    //     (products) => products.category.toLowerCase() === category.toLowerCase()
    //   );
    // }

    const { category } = req.query;

    // Init variable to hold data
    let data;

    // Fill data with content dependant on whether a query for category was made
    if (category) {
      data = getCategory(category.toLowerCase());
    } else {
      data = getProducts();
    }

    res.status(200).json({
      data: data,
    });
  } else if (req.method === "POST") {
    addProduct(req.body);

    res.status(201).json({
      message: "Product added successfully.",
      addedProduct: req.body,
    });
  } else {
    // const error = new Error(
    //   `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    // );
    // error.status = 405;
    // throw error;
    throw new ReqError(
      405,
      `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    );
  }
});

router.all("/:productId", (req, res) => {
  let message, data;
  const { productId } = req.params;
  if (req.method === "GET") {
    data = getProduct(productId);
    if (data) {
      message = `Successfully fetched data for product ${productId}`;
    } else {
      throw new ReqError(404, `Product with ID ${productId} does not exist.`);
    }
  } else if (req.method === "DELETE") {
    data = getProduct(productId);
    if (data) {
      deleteProduct(productId);
      message = `Successfully deleted product with ID ${productId}`;
    } else {
      throw new ReqError(404, `Product with ID ${productId} does not exist.`);
    }
  } else if (req.method === "PUT") {
    const { name, category, stock, price } = req.body;
    const checkProduct = getProduct(productId);
    if (checkProduct) {
      updateProduct(name, category, stock, price, productId);
      message = `Successfully updated product with ID ${productId}`;
      data = {
        oldVersion: checkProduct,
        newVersion: req.body,
      };
    } else {
      throw new ReqError(404, `Product with ID ${productId} does not exist.`);
    }
  } else {
    throw new ReqError(
      405,
      `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    );
  }
  res.status(200).json({
    productId: productId,
    message: message,
    data: data,
  });
});

export default router;

// CRUD - Create, Read, Update, Delete
