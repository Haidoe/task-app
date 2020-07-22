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

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      res.status(404).send();
    }

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    res.status(400).send("Error: Invalid update inputs.");
  }

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).send("");
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
