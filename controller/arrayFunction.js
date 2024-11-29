let arrayEasyData = []; // Store the generated array to serve to the frontend
let arrayMedData = []; // Store the generated array to serve to the frontend
let arrayHardData = []; // Store the generated array to serve to the frontend
let arrayExtraData = []; // Store the generated array to serve to the frontend
let arrayAgainstData = []; // Store the generated array to serve to the frontend

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
  console.log("Generating new array...");
  arrayEasyData = await makeArray(12, 5); // Example: Generate an array with 12 numbers, max value 5
  arrayMedData = await makeArray(12, 8);
  arrayHardData = await makeArray(12, 10);
  arrayExtraData = await makeArray(12, 13);
  arrayAgainstData = await makeArray(12, 13); // Example: Generate an array with 10 numbers, max value 100
  // console.log(
  //   "different levels of arrays:",
  //   arrayEasyData,
  //   arrayMedData,
  //   arrayHardData,
  //   arrayExtraData,
  //   " the array they are times against: ",
  //   arrayAgainstData
  // );
});
