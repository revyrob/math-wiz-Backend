const makeArray = async (count, max) => {
  let newArray = [];
  for (let i = 1; i < count; i++) {
    let newNum;
    do {
      newNum = Math.floor(Math.random() * max);
    } while (newNum === 0); // Keep regenerating new numbers until it's not zero
    newArray.push(newNum);
  }
  return newArray;
};
