const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const fs = require("fs");
app.use(cors());
app.use(express.json());

const { schedule } = require("node-cron");

// Define your arrays incase the cron schedule hasn't ran
let arrayEasyData = [
  4, 3, 2, 1, 4, 3, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 3, 2, 1, 4, 4, 1, 2, 3, 2, 1,
  4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 3, 4, 1, 2,
];
// Define your arrays incase the cron schedule hasn't ran
let arrayMedData = [
  3, 4, 2, 1, 5, 6, 7, 3, 1, 5, 7, 6, 4, 2, 2, 3, 4, 6, 7, 1, 5, 6, 4, 3, 2, 7,
  1, 5, 7, 4, 6, 2, 5, 1, 3, 2, 6, 1, 4, 5,
];
// Define your arrays incase the cron schedule hasn't ran
let arrayHardData = [
  2, 1, 11, 10, 6, 9, 4, 7, 5, 3, 12, 8, 2, 10, 5, 7, 6, 3, 4, 1, 8, 12, 11, 9,
  7, 5, 1, 9, 3, 12, 11, 10, 8, 6, 4, 2, 5, 7, 6, 1,
];
// Define your arrays incase the cron schedule hasn't ran
let arrayAgainstEasyData = [2, 3, 4, 5, 1];
// Define your arrays incase the cron schedule hasn't ran
let arrayAgainstMedData = [2, 6, 3, 4, 8, 5, 1, 7];
// Define your arrays incase the cron schedule hasn't ran
let arrayAgainstHardData = [1, 3, 9, 11, 7, 12, 6, 2, 5, 10, 8, 4];
//start the counter at 1
let counter = 1;

// Load counter value on server start
const loadCounter = () => {
  try {
    if (fs.existsSync("counter.txt")) {
      const data = fs.readFileSync("counter.txt", "utf8");
      counter = parseInt(data, 10) || 1;
      console.log("Counter loaded:", counter);
    } else {
      console.log("Counter file does not exist. Starting from 1.");
    }
  } catch (error) {
    console.error("Error loading counter:", error.message);
  }
};

// Save counter value
const saveCounter = () => {
  try {
    fs.writeFileSync("counter.txt", counter.toString(), "utf8");
    console.log("Counter saved:", counter);
  } catch (error) {
    console.error("Error saving counter:", error.message);
  }
};
// Function to generate arrays
const makeArray = async (count, max) => {
  let newArray = [];
  let allNumbers = Array.from({ length: max - 1 }, (_, i) => i + 1);

  while (newArray.length < count - 1) {
    allNumbers = allNumbers.sort(() => Math.random() - 0.5);
    for (let num of allNumbers) {
      if (newArray.length < count) {
        newArray.push(num);
      } else {
        break;
      }
    }
  }
  return newArray;
};

// Schedule the function to run every 24 hours. create array for different diffculties
schedule("* * * * *", async () => {
  counter += 1;
  saveCounter();
  console.log("Generating new arrays...");
  arrayEasyData = await makeArray(40, 5);
  arrayMedData = await makeArray(40, 8);
  arrayHardData = await makeArray(40, 13);
  arrayAgainstEasyData = await makeArray(5, 5);
  arrayAgainstMedData = await makeArray(8, 8);
  arrayAgainstHardData = await makeArray(12, 13);
});

// API endpoint to serve different data based on `level` query parameter
app.get("/", (req, res) => {
  const { level } = req.query;
  //if level is 1 than take the easy arrays
  if (level === "level1") {
    // If `level1` is selected, send easy data
    return res.json({
      level: "level1",
      arrayLarge: arrayEasyData,
      arraySmall: arrayAgainstEasyData,
      counter: counter,
    });
  }
  //if level is 2 take the medium arrays
  if (level === "level2") {
    // If `level2` is selected, send medium data
    return res.json({
      level: "level2",
      arrayLarge: arrayMedData,
      arraySmall: arrayAgainstMedData,
    });
  }
  //if level is 3 use the hard arrays
  if (level === "level3") {
    // If `level3` is selected, send hard data
    return res.json({
      level: "level3",
      arrayLarge: arrayHardData,
      arraySmall: arrayAgainstHardData,
    });
  }
  //if level is 4 use the hard array but make sure it is labeled as level 4 because the equations are set up differently
  if (level === "level4") {
    // If `level3` is selected, send hard data
    return res.json({
      level: "level4",
      arrayLarge: arrayHardData,
      arraySmall: arrayAgainstHardData,
    });
  }

  // If no valid level is specified, return a default response
  return res.json({
    message: "Please specify a valid level (level1, level2, or level3).",
  });
});

// All arrays and counter as a default response
app.get("/", (req, res) => {
  res.json({
    arrayEasyData,
    arrayMedData,
    arrayHardData,
    arrayAgainstEasyData,
    arrayAgainstMedData,
    arrayAgainstHardData,
  });
});

//get only the counter for the homepage
app.get("/counter", (req, res) => {
  res.json({
    counter,
  });
});

// Initialize the counter
loadCounter();

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});
