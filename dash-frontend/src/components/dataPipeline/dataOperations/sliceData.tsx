import { DataFrame } from 'danfojs';
import * as dfd from 'danfojs';
import {logarithmicScaling} from "@/components/dataPipeline/dataOperations/operations";

async function determineRowCount(df: DataFrame): Promise<number> {
    return Promise.resolve(df.shape[0]);
}

async function calculateSliceInterval(rowCount: number, threshold: number, minInterval: number): Promise<number> {
    if (rowCount <= threshold) {
        return minInterval;
    } else {
        // scaling with square root
        // let scalingFactor = Math.sqrt(rowCount - threshold);
        let scalingFactor = Math.ceil(rowCount / threshold);
        // return Math.max(minInterval, scalingFactor);
        return scalingFactor;
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
        slicedDF.print();
        resolve(slicedDF);
    });
}

export async function processAndSliceDF(df: DataFrame, threshold: number, minInterval: number): Promise<DataFrame> {
    try {
        const rowCount = await determineRowCount(df);
        if (rowCount <= threshold) {
            console.log("Row count is below threshold")
            return df;
        }
        const sliceInterval = await calculateSliceInterval(rowCount, threshold, minInterval);
        console.log(`Slicing every ${sliceInterval} rows.`);
        const slicedDF = await sliceDF(df, sliceInterval);
        console.log(`CSV slicing completed. New DataFrame:`);
        return slicedDF;
    } catch (error) {
        console.error('An error occurred:', error);
        return df
    }
}

dfd.readCSV("csvData/newcsv.csv").then((df) => {
            processAndSliceDF(df, 3000, 1).then((slicedDF) => {
                console.log('sliced df:');
                slicedDF.print();
            });
            console.log(df);
        });

//
// const testData = {
//     "column1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//     "column2": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
//   };
//
// const df = new DataFrame(testData);
//
// const inputCsvPath = 'csvData/500000sales.csv'; // Update this path to your input CSV file
// const threshold = 8000;
// const minInterval = 1;
//
// processAndSliceDF(df, threshold, minInterval)
//     .then(slicedDF => {
//         console.log("DataFrame after processing and slicing:");
//         slicedDF.print();
//     })
//     .catch(console.error);
