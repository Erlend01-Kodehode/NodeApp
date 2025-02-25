import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(418).json({
    message: "Products here",
    youAttempted: `${req.method} at ${req.url}`,
  });
});

export default router;
