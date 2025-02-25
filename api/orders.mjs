import express from "express";
const router = express.Router();

import { ReqError } from "../util/errorHandler.mjs";
import {
  addOrders,
  deleteOrder,
  getOrder,
  getOrders,
  getOrdersCategory,
  updateOrder,
} from "../util/dbQueries.mjs";

router.all("/", (req, res) => {
  if (req.method === "GET") {
    const { category } = req.query;
    let data;

    if (category) {
      data = getOrdersCategory(category.toLowerCase());
    } else {
      data = getOrders();
    }

    res.status(200).json({
      data: data,
    });
  } else if (req.method === "POST") {
    addOrders(req.body);

    res.status(201).json({
      message: "Order added successfully",
      order: req.body,
    });
  } else {
    throw new ReqError(405, `${req.method} is not supported`);
  }
});

router.all("/:orderId", (req, res) => {
  let message, data;
  let { orderId } = req.params;
  if (req.method === "GET") {
    data = getOrder(orderId);
    if (data) {
      message = `Successfully fetched data with ID: ${orderId}`;
    } else {
      throw new ReqError(404, `Order with ID: ${orderId} does not exist.`);
    }
  } else if (req.method === "DELETE") {
    data = getOrder(orderId);
    if (data) {
      deleteOrder(orderId);
      message = `Successfully deleted order with ID: ${orderId}`;
    } else {
      throw new ReqError(404, `Order with ID: ${orderId} does not exist.`);
    }
  } else if (req.method === "PUT") {
    const { name, category, stock, price } = req.body;
    const checkOrder = getOrder(orderId);
    if (checkOrder) {
      updateOrder(name, category, stock, price, orderId);
      message = `Successfully updated order with ID: ${orderId}`;
      data = {
        oldVersion: checkOrder,
        newVersion: req.body,
      };
    } else {
      throw new ReqError(404, `Order with ID: ${orderId} does not exist.`);
    }
  } else {
    throw new ReqError(405, `${req.method} is not supported`);
  }
  res.status(200).json({
    orderId: orderId,
    message: message,
    data: data,
  });
});

export default router;
