const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

var cron = require("node-cron");
//all my arrays will get sent into an object to the frontend
let arrayEasyData = []; // Store the generated array to serve to the frontend
let arrayMedData = []; // Store the generated array to serve to the frontend
let arrayHardData = []; // Store the generated array to serve to the frontend
let arrayExtraData = []; // Store the generated array to serve to the frontend
let allArraysTogether = [
  4, 3, 2, 1, 4, 3, 2, 1, 2, 3, 1, 4, 3, 2, 4, 1, 4, 2, 3, 1, 4, 1, 5, 2, 6, 3,
  7, 7, 4, 1, 5, 3, 2, 6, 7, 4, 1, 5, 3, 2, 1, 7, 4, 5, 6, 2, 9, 3, 8, 7, 3, 1,
  8, 9, 2, 4, 5, 6, 1, 6, 2, 12, 10, 11, 4, 5, 9, 1, 8, 6, 3, 7, 2, 7, 12, 10,
  11, 4, 5, 9,
]; //add the 4 arrays together
let arrayAgainstData = [1, 3, 9, 11, 7, 12, 6, 2, 5, 10, 8, 4]; // Store the generated array to serve to the frontend
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

const addArrays = async () => {
  if (
    arrayEasyData !== "" &&
    arrayMedData !== "" &&
    arrayHardData !== "" &&
    arrayExtraData !== ""
  ) {
    //add all arrays together into one array
    const mergeArrays = arrayEasyData.concat(
      arrayMedData,
      arrayHardData,
      arrayExtraData
    );
    return mergeArrays;
  } else {
    console.log("there is no info in the needed arrays.");
  }
};

// Schedule the function to run every 24 hours
cron.schedule("0 0 * * *", async () => {
  counter += 1;
  console.log("Generating new array...");
  arrayEasyData = await makeArray(20, 5); // Example: Generate an array with 12 numbers, max value 5
  arrayMedData = await makeArray(20, 8);
  arrayHardData = await makeArray(20, 10);
  arrayExtraData = await makeArray(20, 13);
  arrayAgainstData = await makeArray(12, 13); // Example: Generate an array with 10 numbers, max value 100
  allArraysTogether = await addArrays();
});

// API endpoint to serve the data
app.get("/", (req, res) => {
  res.json([allArraysTogether, arrayAgainstData, counter]);
});

//all you see at the moment is this in your browser
app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});
