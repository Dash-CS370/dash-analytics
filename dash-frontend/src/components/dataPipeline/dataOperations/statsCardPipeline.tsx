import * as dfd from 'danfojs';

export function generateStatsCard(dataframe_column: dfd.Series): any {
    return new Promise((resolve, reject) => {
        try {
            if (dataframe_column.dtype == 'string') { // if non-numerical values (string)
                try {
                    analyzeCategoricalColumn(dataframe_column);
                } catch (error) {
                    console.error("Error calculating mean price:", error);
                }
            } else {
                try {
                    analyzeNumericalColumn(dataframe_column);
                } catch (error) {
                    console.error("Error calculating:", error)
                }
            }

        } catch (error) {
            console.log(error)
        }
    });
}


// takes in Series of categorical data, outputs dictionary of percentages of whole
export async function analyzeCategoricalColumn(categorical_column: dfd.Series) {

    const totalCount = categorical_column.size;
    const categoryCounts = categorical_column.valueCounts();
    const categoryPercentages: number[] = categoryCounts.div(totalCount).mul(100).values.map((value) => {
        //@ts-ignore
        return Number(value.toFixed(2))
    });

    const categoriesAndStats : [string, number][] = categoryCounts.index.map((category: string | number, index: number): [string, number] => {
        return [String(category), categoryPercentages[index]]; // Use sorted percentages
    });

    let sortedCategoriesAndStats = categoriesAndStats.sort((a, b) => b[1] - a[1]);

    let categoricalStats = sortedCategoriesAndStats.map((pair) => {
        return [pair[0], `${pair[1]}%`]
    })

    console.log("Sorted Categories and Percentages:", categoricalStats);
}




// takes in Series of numerical data, outputs dictionary of stats
export async function analyzeNumericalColumn(numerical_column: dfd.Series) {
    // Sort the numerical column to calculate quartiles
    const sortedValues = numerical_column.sortValues({ ascending: true }).values;

    const mean = numerical_column.mean();
    const median = numerical_column.median();
    const mode = numerical_column.mode();
    const min = numerical_column.min();
    const max = numerical_column.max();

    // Calculate quartiles
    const q1 = Number(sortedValues[Math.floor(sortedValues.length / 4)]); // First quartile
    const q3 = Number(sortedValues[Math.ceil((sortedValues.length * 3) / 4)]); // Third quartile

    const IQR : number = q3 - q1; // Interquartile range
    const lowerBound = q1 - 1.5 * IQR; // Lower bound for outliers
    const upperBound = q3 + 1.5 * IQR; // Upper bound for outliers

    // @ts-ignore
    const outliers = sortedValues.filter((v: number) => v < lowerBound || v > upperBound);

    return {
        mean, //number
        median, //number
        min, //number
        max, //number
    };

}
