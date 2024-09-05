import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", { title: "home view" });
});

export default router;
