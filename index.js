const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

var cron = require("node-cron");
//all my arrays will get sent into an object to the frontend
let arrayEasyData = [
  4, 3, 2, 1, 4, 3, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 3, 2, 1, 4, 4, 1, 2, 3, 2, 1,
  4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 3, 4, 1, 2,
]; // Store the generated array to serve to the frontend
let arrayMedData = [
  3, 4, 2, 1, 5, 6, 7, 3, 1, 5, 7, 6, 4, 2, 2, 3, 4, 6, 7, 1, 5, 6, 4, 3, 2, 7,
  1, 5, 7, 4, 6, 2, 5, 1, 3, 2, 6, 1, 4, 5,
]; // Store the generated array to serve to the frontend
let arrayHardData = [
  2, 1, 11, 10, 6, 9, 4, 7, 5, 3, 12, 8, 2, 10, 5, 7, 6, 3, 4, 1, 8, 12, 11, 9,
  7, 5, 1, 9, 3, 12, 11, 10, 8, 6, 4, 2, 5, 7, 6, 1,
]; // Store the generated array to serve to the frontend
let arrayAgainstEasyData = [2, 3, 4, 5, 1];
let arrayAgainstMedData = [2, 6, 3, 4, 8, 5, 1, 7];
let arrayAgainstHardData = [1, 3, 9, 11, 7, 12, 6, 2, 5, 10, 8, 4]; // Store the generated array to serve to the frontend

let counter = 1;

const makeArray = async (count, max) => {
  let newArray = [];
  //i want unique until the count is hit and then I want it to start again
  let allNumbers = Array.from({ length: max - 1 }, (_, i) => i + 1); // Generate numbers from 1 to max-1

  while (newArray.length < count - 1) {
    // Adjusted to match your original `for` loop
    // keep creating a random number
    // Shuffle the array of numbers when starting a new cycle
    allNumbers = allNumbers.sort(() => Math.random() - 0.5);
    //while that number is less then the max it can push into the array
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

// Schedule the function to run every 24 hours
cron.schedule("* * * * *", async () => {
  counter += 1;
  console.log("Generating new array...");
  arrayEasyData = await makeArray(40, 5); // Example: Generate an array with 12 numbers, max value 5
  arrayMedData = await makeArray(40, 8);
  arrayHardData = await makeArray(40, 13);

  arrayAgainstEasyData = await makeArray(5, 5); // Example: Generate an array with 10 numbers, max value 100
  arrayAgainstMedData = await makeArray(8, 8); // Example: Generate an array with 10 numbers, max value 100
  arrayAgainstHardData = await makeArray(40, 13); // Example: Generate an array with 10 numbers, max value 100
});

// API endpoint to serve the data
app.get("/", (req, res) => {
  res.json([
    arrayEasyData,
    arrayMedData,
    arrayHardData,
    arrayAgainstEasyData,
    arrayAgainstMedData,
    arrayAgainstHardData,
    counter,
  ]);
});

//all you see at the moment is this in your browser
app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});
