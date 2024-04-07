import * as dfd from 'danfojs';
import { DataFrame } from 'danfojs';

// standardize
// normalize
// calculate_delta
// calculate_percentage_change
// percent_of_total
// logarithmic_scaling
// square_root_transform
// rolling_average
// rolling_median
// discretize_column

// TODO slice: select every n rows (>10K rows). ReLU
export async function standardize(df: DataFrame): Promise<DataFrame> {
    let scaler = new dfd.StandardScaler();
    scaler.fit(df);
    let standardized_df: DataFrame = scaler.transform(df);
    return standardized_df;
}

/**
 * Normalizes the single column in the DataFrame to the range 0-1
 * @param {DataFrame} df
 * @returns The DataFrame with the normalized column
 */
export async function normalize(df: DataFrame): Promise<DataFrame> {
    let scaler = new dfd.MinMaxScaler();
    scaler.fit(df);
    let normalized_df = scaler.transform(df);
    return normalized_df;
}

/**
 * Calculates the difference between each element and the previous element
 * @param {DataFrame} df
 * @returns The DataFrame with the delta column
 */
export async function calculateDelta(df: DataFrame): Promise<DataFrame> {
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
export async function calculatePercentageChange(
    df: DataFrame,
): Promise<DataFrame> {
    const column = df.columns[0];
    const values = df[column].values;
    let pctChangeValues = new Array(values.length);
    pctChangeValues[0] = 0;
    for (let i = 1; i < values.length; i++) {
        if (values[i - 1] !== 0) {
            pctChangeValues[i] =
                ((values[i] - values[i - 1]) / values[i - 1]) * 100;
        } else {
            // division by 0
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
export async function percentOfTotal(df: DataFrame): Promise<DataFrame> {
    const column = df.columns[0];
    const colSeries = df[column];
    const totalSum = await colSeries.sum();
    const percentOfTotalColumn = colSeries.div(totalSum).mul(100);
    const newDataFrame = new dfd.DataFrame({
        [column]: percentOfTotalColumn.values,
    });
    return newDataFrame;
}

/**
 * Applies logarithmic scaling
 * @param {DataFrame} df
 * @returns The DataFrame with the logarithmically scaled column
 */
export async function logarithmicScaling(df: DataFrame): Promise<DataFrame> {
    const column: string = df.columns[0];
    const values: number[] = df[column].values as number[];
    const logScaledValues = values.map((value: number) => Math.log(value));
    const newDataFrame = new dfd.DataFrame({ [column]: logScaledValues });
    return newDataFrame;
}

/**
 * Applies square root transformation
 * @param {DataFrame} df
 * @returns The DataFrame with the square root transformed column
 */

export async function squareRootTransform(df: DataFrame): Promise<DataFrame> {
    const column = df.columns[0];
    const values: number[] = df[column].values as number[];
    const sqrtTransformedValues = values.map((value: number) =>
        Math.sqrt(value),
    );
    const newDataFrame = new dfd.DataFrame({ [column]: sqrtTransformedValues });
    return newDataFrame;
}

/**
 * Calculates the moving average over a specified window of rows for each column
 * @param {DataFrame} df
 * @param {number} windowSize
 * @returns The DataFrame with rolling averages for each column
 */
export async function rollingAverage(
    df: DataFrame,
    windowSize: number,
): Promise<DataFrame> {
    let results: Record<string, number[]> = {};
    const calculateMovingAverage = (
        values: number[],
        windowSize: number,
    ): number[] => {
        let movingAverages: number[] = [];
        for (let i = 0; i < values.length; i++) {
            if (i + 1 < windowSize) {
                let windowValues = values.slice(0, i + 1);
                let sum = windowValues.reduce(
                    (a: number, b: number) => a + b,
                    0,
                );
                movingAverages.push(sum / (i + 1));
            } else {
                let windowValues = values.slice(i + 1 - windowSize, i + 1);
                let sum = windowValues.reduce(
                    (a: number, b: number) => a + b,
                    0,
                );
                movingAverages.push(sum / windowSize);
            }
        }
        return movingAverages;
    };
    for (let column of df.columns) {
        let columnData = df[column].values as number[];
        if (columnData.every((value) => typeof value === 'number')) {
            results[column] = calculateMovingAverage(columnData, windowSize);
        } else {
            results[column] = columnData.slice();
        }
    }
    return new dfd.DataFrame(results);
}

/**
 * Calculates the moving median over a specified window of rows for each column
 * @param {DataFrame} df
 * @returns The DataFrame with
 */
export async function rollingMedian(
    df: DataFrame,
    windowSize: number,
): Promise<DataFrame> {
    let results: Record<string, Array<number>> = {};
    const calculateMedian = (values: number[]) => {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values.length % 2 !== 0
            ? values[mid]
            : (values[mid - 1] + values[mid]) / 2.0;
    };
    for (let column of df.columns) {
        let columnData = df[column].values;
        if (typeof columnData[0] === 'number') {
            let medians = [];
            for (let i = 0; i < columnData.length; i++) {
                if (i + 1 < windowSize) {
                    medians.push(NaN);
                } else {
                    let windowValues = columnData.slice(
                        i + 1 - windowSize,
                        i + 1,
                    );
                    medians.push(calculateMedian(windowValues));
                }
            }
            results[column] = medians;
        } else {
            results[column] = columnData.slice();
        }
    }
    return new dfd.DataFrame(results);
}

/**
 * Splits a numerical column into bins or ranges, essential for histograms
 * @param {DataFrame} df
 * @returns The DataFrame with
 */
export async function discretizeColumn(
    df: DataFrame,
    numBins: number,
): Promise<DataFrame> {
    const column = df.columns[0];
    let colData = df[column].values as number[];
    let min = df[column].min();
    let max = df[column].max();
    let binWidth = (max - min) / numBins;
    const getBinIndex = (value: number) => {
        let adjustedValue = value === min ? value + 1e-9 : value;
        return Math.ceil((adjustedValue - min) / binWidth);
    };
    let binnedData = colData.map((value) => getBinIndex(value));
    df.addColumn('Binned Data', binnedData, { inplace: true });
    return df;
}
async function determineRowCount(df: DataFrame): Promise<number> {
    return Promise.resolve(df.shape[0]);
}

async function calculateSliceInterval(
    rowCount: number,
    threshold: number,
    minInterval: number,
): Promise<number> {
    if (rowCount <= threshold) {
        return minInterval;
    } else {
        // scaling with square root
        let scalingFactor = Math.sqrt(rowCount - threshold);
        return Math.max(minInterval, scalingFactor);

        // // linear scaling constant
        // const scalingConstant = 0.01;
        // let scalingFactor = scalingConstant * (rowCount - threshold);
        // return Math.max(minInterval, Math.round(scalingFactor));
    }
}

async function sliceDF(df: DataFrame, n: number): Promise<DataFrame> {
    return new Promise((resolve, reject) => {
        if (!df || !df.shape || df.shape[0] === 0) {
            reject(new Error('Invalid or empty DataFrame'));
            return;
        }
        if (n <= 0) {
            reject(new Error('Interval n must be greater than 0'));
            return;
        }
        n = Math.round(n);
        const indices: number[] = [];
        for (let i = 0; i < df.shape[0]; i += n) {
            indices.push(i);
        }
        const slicedDF = df.iloc({ rows: indices });
        resolve(slicedDF);
    });
}

export async function processAndSliceDF(
    df: DataFrame,
    threshold: number,
    minInterval: number,
): Promise<DataFrame> {
    try {
        const rowCount = await determineRowCount(df);
        if (rowCount <= threshold) {
            console.log('Row count is below threshold');
            return df;
        }
        const sliceInterval = await calculateSliceInterval(
            rowCount,
            threshold,
            minInterval,
        );
        console.log(`Slicing every ${sliceInterval} rows.`);
        const slicedDF = await sliceDF(df, sliceInterval);
        console.log(`CSV slicing completed. New DataFrame:`);
        return slicedDF;
    } catch (error) {
        console.error('An error occurred:', error);
        return df;
    }
}