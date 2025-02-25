import express from "express";
import productsRoute from "../api/productsRoute.mjs";
import eventLogger from "../eventLogger.mjs";

const app = express();

const PORT = process.env.PORT || 3500;

app.use(eventLogger);

app.use(express.static("public"));

app.use("/api/products", productsRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
