const dfd = require("danfojs-node");
const {
  standardize,
  normalize,
  calculateDelta,
  calculatePercentageChange,
  percentOfTotal,
  logarithmicScaling,
  squareRootTransform
} = require('./operation'); 

async function test() {
  const data = {
    column1: [10, 20, 30, 40, 50]
  };

  // Create DataFrame from original data
  let originalDf = new dfd.DataFrame(data);

  console.log("Original DataFrame:");
  await originalDf.print();

  // standardization 
  let standardizedDf = await standardize(originalDf);
  console.log("\nDataFrame after standardization:");
  await standardizedDf.print();

  // normalization 
  let normalizedDf = await normalize(originalDf);
  console.log("\nDataFrame after normalization:");
  await normalizedDf.print();

  // CalculateDelta 
  let deltaDf = await calculateDelta(originalDf);
  console.log("\nDataFrame after calculating delta:");
  await deltaDf.print();

  // Calculate Percentage Change 
  let pctChangeDf = await calculatePercentageChange(originalDf);
  console.log("\nDataFrame after calculating percentage change:");
  await pctChangeDf.print();

  // Calculate Percent of Total 
  let percentTotalDf = await percentOfTotal(originalDf);
  console.log("\nDataFrame after calculating percent of total:");
  await percentTotalDf.print();

  // Apply logarithmic scaling
  let logScaledDf = await logarithmicScaling(originalDf);
  console.log("\nDataFrame after logarithmic scaling:");
  await logScaledDf.print();

  // Apply square root transformation 
  let sqrtTransformedDf = await squareRootTransform(originalDf);
  console.log("\nDataFrame after square root transform:");
  await sqrtTransformedDf.print();
}

test();
