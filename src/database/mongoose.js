const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("ERR:", err));
