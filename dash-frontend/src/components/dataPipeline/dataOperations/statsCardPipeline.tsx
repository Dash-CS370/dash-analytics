import * as dfd from 'danfojs';
import { DataFrame } from 'danfojs';
import { ArrayType1D, ArrayType2D } from "danfojs/dist/danfojs-base/shared/types";

export interface CategoricalStatsCard{
    categories: ArrayType1D | ArrayType2D;
    categorical_distributions: ArrayType1D | ArrayType2D;
}

export async function generateStatsCard(dataframe_column: dfd.Series): Promise<dfd.DataFrame> {
    // Promise DF or File?
    return new Promise((resolve, reject) => {
        try {
            if (dataframe_column.dtype == 'string') { // if non-numerical values (string)
                const grouped = dataframe_column.groupby();

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



// takes in Dataframe of categorical data, outputs dictionary of percentages of whole
export async function analyzeCategoricalColumn(categorical_column: dfd.Series) {
    const totalCount = categorical_column.size;
    console.log(totalCount)

    const categoryCounts = categorical_column.valueCounts();
    console.log(categoryCounts)

    const categoryPercentages = categoryCounts.div(totalCount).mul(100).values
    console.log(categoryPercentages)

    const sortedCategories = categoryCounts.sortValues();
    const mostFrequentCategory = sortedCategories.max();
    console.log("Most Frequent Category:", mostFrequentCategory);
    const leastFrequentCategory = sortedCategories.min();
    console.log("Least Frequent Category:", leastFrequentCategory)

    const categoricalStatsCard : CategoricalStatsCard = {
        categories : categorical_column.unique().values,
        categorical_distributions : categoryPercentages,
    }
}

