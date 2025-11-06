import express from "express";
import Event from "../models/eventModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const events = await Event.find({ userId: req.user.id });
  res.json(events);
});

router.post("/", protect, async (req, res) => {
  const { title, startTime, endTime } = req.body;
  const event = await Event.create({ title, startTime, endTime, userId: req.user.id });
  res.json(event);
});

router.patch("/:id", protect, async (req, res) => {
  const { status } = req.body;
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status },
    { new: true }
  );
  res.json(event);
});

export default router;
