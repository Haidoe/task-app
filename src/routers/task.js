const express = require("express");
const router = new express.Router();

const Task = require("../models/task");
const auth = require("../middlewares/auth");

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });

    await task.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  const limit = req.query.limit ? parseInt(req.query.limit) : 2;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * limit;
  const sort = {};

  if (req.query.sortBy) {
    const [sortBy, direction] = req.query.sortBy.split(":");
    sort[sortBy] = direction === "desc" ? -1 : 1;
  }

  const options = { limit, skip, sort };

  try {
    await req.user.populate({ path: "tasks", match, options }).execPopulate();

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    res.status(400).send("Error: Invalid update inputs.");
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send("");
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
