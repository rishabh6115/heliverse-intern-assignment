const express = require("express");
const app = express();

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

const { notFound, errorHandler } = require("./Middleware/ErrorHandler");

dotenv.config();

app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log(process.env.NODE_ENV);
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is runningjnj..");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
