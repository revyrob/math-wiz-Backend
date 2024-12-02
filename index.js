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
let allArraysTogether = []; //add the 4 arrays together
let arrayAgainstData = []; // Store the generated array to serve to the frontend
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
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// Schedule the function to run every 24 hours
cron.schedule("* * * * *", async () => {
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
