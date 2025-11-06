import express from "express";
import Event from "../models/eventModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const swapRequests = [];

router.get("/swappable-slots", protect, async (req, res) => {
  const slots = await Event.find({ status: "SWAPPABLE", userId: { $ne: req.user.id } });
  res.json(slots);
});

router.post("/swap-request", protect, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const mySlot = await Event.findById(mySlotId);
  const theirSlot = await Event.findById(theirSlotId);

  if (!mySlot || !theirSlot) return res.status(404).json({ message: "Slots not found" });
  if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
    return res.status(400).json({ message: "Both slots must be swappable" });

  mySlot.status = theirSlot.status = "SWAP_PENDING";
  await mySlot.save();
  await theirSlot.save();

  const swapRequest = {
    id: Date.now(),
    requester: req.user.id,
    requestedFrom: theirSlot.userId,
    mySlotId,
    theirSlotId,
    status: "PENDING",
  };
  swapRequests.push(swapRequest);
  res.json({ message: "Swap request created", swapRequest });
});

router.post("/swap-response/:id", protect, async (req, res) => {
  const { accept } = req.body;
  const swapRequest = swapRequests.find((r) => r.id == req.params.id);
  if (!swapRequest) return res.status(404).json({ message: "Swap not found" });

  const mySlot = await Event.findById(swapRequest.mySlotId);
  const theirSlot = await Event.findById(swapRequest.theirSlotId);

  if (accept) {
    const tempUser = mySlot.userId;
    mySlot.userId = theirSlot.userId;
    theirSlot.userId = tempUser;
    mySlot.status = theirSlot.status = "BUSY";
    swapRequest.status = "ACCEPTED";
  } else {
    mySlot.status = theirSlot.status = "SWAPPABLE";
    swapRequest.status = "REJECTED";
  }

  await mySlot.save();
  await theirSlot.save();

  res.json({ message: "Swap response recorded", swapRequest });
});

export default router;
