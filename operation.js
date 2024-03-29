const dfd = require("danfojs-node");

// standardize
// normalize
// calculate-delta
// calculate_percentage_change 
// percent_of_total
// logarithmic_scaling
// square_root_transform

/**
 * Standardizes the single column in the DataFrame
 * @param {DataFrame} df 
 * @returns The DataFrame with the standardized column
 */
async function standardize(df) {
    const column = df.columns[0]; 
    const colSeries = df[column];
    const mean = await colSeries.mean();
    const std = await colSeries.std();
    const standardizedColumn = colSeries.sub(mean).div(std);
    return new dfd.DataFrame({ [column]: standardizedColumn.values });
}

/**
 * Normalizes the single column in the DataFrame to the range 0-1
 * @param {DataFrame} df 
 * @returns The DataFrame with the normalized column
 */
async function normalize(df) {
    const column = df.columns[0]; 
    const colSeries = df[column];
    const min = await colSeries.min();
    const max = await colSeries.max();
    const normalizedColumn = colSeries.sub(min).div(max - min);
    const formattedData = normalizedColumn.values.map(value => ({ [column]: value }));
    return new dfd.DataFrame(formattedData);
}


/**
 * Calculates the difference between each element and the previous element
 * @param {DataFrame} df 
 * @returns The DataFrame with the delta column
 */
async function calculateDelta(df) {
    const column = df.columns[0];
    const values = df[column].values;
    let deltaValues = new Array(values.length);
    deltaValues[0] = 0; 
    for (let i = 1; i < values.length; i++) {
        deltaValues[i] = values[i] - values[i - 1];
    }
    return new dfd.DataFrame({ [column]: deltaValues });
}

/**
 * Calculates the percentage change between each element and the previous element
 * @param {DataFrame} df 
 * @returns The DataFrame with the percentage change column
 */
async function calculatePercentageChange(df) {
    const column = df.columns[0]; 
    const values = df[column].values;
    let pctChangeValues = new Array(values.length);
    pctChangeValues[0] = 0; 
    for (let i = 1; i < values.length; i++) {
        if (values[i - 1] !== 0) { 
            pctChangeValues[i] = ((values[i] - values[i - 1]) / values[i - 1]) * 100;
        } else { // division by 0
            pctChangeValues[i] = NaN; 
        }
    }
    return new dfd.DataFrame({ [column]: pctChangeValues });
}


/**
 * Calculates the percentage of each element to the sum of the single column
 * @param {DataFrame} df 
 * @returns The DataFrame with the percent of total column
 */
async function percentOfTotal(df) {
    const column = df.columns[0];
    const colSeries = df[column];
    const totalSum = await colSeries.sum();
    const percentOfTotalValues = colSeries.div(totalSum).mul(100).values;
    let reshapedData = percentOfTotalValues.map(value => ({ [column]: value }));
    const newDataFrame = new dfd.DataFrame(reshapedData);
    return newDataFrame;
}



/**
 * Applies logarithmic scaling
 * @param {DataFrame} df
 * @returns The DataFrame with the logarithmically scaled column
 */
async function logarithmicScaling(df) {
    const column = df.columns[0]; 
    const values = df[column].values;
    const logScaledValues = values.map(value => Math.log(value));
    const newDataFrame = new dfd.DataFrame({ [column]: logScaledValues });
    return newDataFrame;
}


/**
 * Applies square root transformation 
 * @param {DataFrame} df 
 * @returns The DataFrame with the square root transformed column
 */

async function squareRootTransform(df) {
    const column = df.columns[0]; 
    const values = df[column].values;
    const sqrtTransformedValues = values.map(value => Math.sqrt(value));
    const newDataFrame = new dfd.DataFrame({ [column]: sqrtTransformedValues });
    return newDataFrame;
}


// Export the functions
module.exports = {
    standardize,
    normalize,
    calculateDelta,
    calculatePercentageChange,
    percentOfTotal,
    logarithmicScaling,
    squareRootTransform
};

