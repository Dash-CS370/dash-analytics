// Takes in File

import * as dfd from 'danfojs';
import { DataFrame } from 'danfojs';
import {userClean} from "./user_clean";

export async function standardClean(file: File): Promise<dfd.DataFrame> {
    // Promise DF or File?
    return new Promise((resolve, reject) => {
        const file_reader = new FileReader();

        file_reader.onload = async (event) => {
            const file_data = event.target?.result as string;
            // Checks if File is Empty
            if (!file_data) {
                reject('Uploaded File is Empty');
                return;
            }

            try {
                const upload_data = await dfd.readCSV(file); //Reads in CSV

                const drop_rows_df = upload_data.dropNa(); // Drops Rows w/ NaN's

                console.log("Clean DF columns:", drop_rows_df.columns);
                const ctypes = (drop_rows_df.ctypes as any) as { [key: string]: string };
                console.log("Column types:", ctypes);

                const priceSeries = drop_rows_df['make'];
                const priceDtype = priceSeries.dtype;
                console.log("Price column data type:", priceDtype);
                if (priceDtype === 'float32' || priceDtype === 'int32') { // if numerical values
                    const grouped = drop_rows_df.groupby(["brand"]);
                    console.log("Grouped by 'brand':", grouped);
                    try {
                        const meanPrice = grouped.mean();
                        console.log("Mean price DataFrame:");
                        meanPrice.print();
                        const priceStats = await analyzeNumericalColumn(meanPrice, 'price_mean'); // get dictionary
                        console.log("Price stats:", priceStats);
                    } catch (error) {
                        console.error("Error calculating mean price:", error);
                    }
                } else {
                    const grouped = drop_rows_df.groupby(["brand"]);
                    try {
                        const brandcounts = grouped.count();
                        brandcounts.print();
                        const brandStats = await analyzeCategoricalColumn(brandcounts, 'brand', 'make_count'); // get dictionary
                        console.log("Make stats:", brandStats);
                    } catch (error) {
                        console.error("Error calculating:", error)
                    }
                }

                resolve(drop_rows_df);
            } catch (error) {
                reject(error);
            }
        };

        file_reader.onerror = (error) => {
            reject(error);
        };

        file_reader.readAsText(file);
    });
}

// takes in dataframe if numerical data, outputs dictionary of stats
export async function analyzeNumericalColumn(df: DataFrame, columnName: string) {
    const column = df[columnName];
    const dtype = column.dtype;

    const mean = column.mean();
    const mode = column.mode()[0];
    const median = column.median();
    const min = column.min();
    const max = column.max();

    const sorted = column.sortValues();
    const values = sorted.values;

    const q1 = values[Math.floor((values.length / 4))];
    const median2 = values.length % 2 === 0 ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2 : values[Math.floor(values.length / 2)];
    const q3 = values[Math.ceil((values.length * (3 / 4)))];

    const IQR = q3 - q1;
    const lowerBound = q1 - 1.5 * IQR;
    const upperBound = q3 + 1.5 * IQR;

    const outliers = values.filter((v: number) => v < lowerBound || v > upperBound);

    return { mean, mode, median, min, max, outliers };
}

// takes in dataframe if categorical data, outputs dictionary of percentages of whole
export async function analyzeCategoricalColumn(df: DataFrame, groupByColumnName: string, countColumnName: string) {
    const column = df[countColumnName];
    const dtype = column.dtype;

    const brands = df[groupByColumnName].values;
    const makeCounts = df[countColumnName].values;
    const totalMakeCount = makeCounts.reduce((acc: number, val: number) => acc + val, 0);
    const categoryPercentages: { [brand: string]: number } = {};

    brands.forEach((brand: string, index: number) => {
        const makeCount = makeCounts[index];
        categoryPercentages[brand] = (makeCount / totalMakeCount) * 100;
    });
    return categoryPercentages;
}
