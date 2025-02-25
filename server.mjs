import express from "express";
import productsRoute from "./api/products.mjs";
import ordersRoute from "./api/orders.mjs";
import signupRoute from "./api/signup.mjs";
import loginRoute from "./api/login.mjs";
import eventLogger from "./util/eventLogger.mjs";
import { errorHandler, ReqError } from "./util/errorHandler.mjs";

// Initialize Express
const app = express();

// Establish server port
const PORT = process.env.PORT || 3500;

// Custom request logger middleware
app.use(eventLogger);

// Built in middleware to parse JSON data in request bodies
app.use(express.json());

// Built in middleware to serve static files
app.use(express.static("public"));

// Api routes. Uses external routers.
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);

// 404 catcher. Catches any requests not picked up by our route handlers.
app.all("*", (req, res, next) => {
  // const error = new Error("Not found");
  // error.status = 404;
  // next(error);
  throw new ReqError(404, "Not Found");
});

// Error handler returns error in json format
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
