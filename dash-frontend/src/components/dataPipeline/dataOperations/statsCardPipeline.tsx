import { DataItem } from '@/components/widgets/WidgetTypes';
import { Series } from 'danfojs';

export function generateStatsCard(
    dataframe_column: Series,
): [string, string | number][] {
    // Categorical column
    if (dataframe_column.dtype == 'string') {
        try {
            return analyzeCategoricalColumn(dataframe_column);
        } catch (error) {
            console.error('Error calculating mean price:', error);
        }
    } else {
        // Numerical column
        try {
            return analyzeNumericalColumn(dataframe_column);
        } catch (error) {
            console.error('Error calculating:', error);
            return [];
        }
    }

    return [];
}

// takes in Series of categorical data, outputs dictionary of percentages of whole
function analyzeCategoricalColumn(
    categorical_column: Series,
): [string, string][] {
    const totalCount = categorical_column.size;
    const categoryCounts = categorical_column.valueCounts();
    const categoryPercentages: number[] = categoryCounts
        .div(totalCount)
        .mul(100)
        .values.map((value) => {
            //@ts-ignore
            return Number(value.toFixed(2));
        });

    const categoriesAndStats: [string, number][] = categoryCounts.index.map(
        (category: string | number, index: number): [string, number] => {
            return [String(category), categoryPercentages[index]]; // Use sorted percentages
        },
    );

    let sortedCategoriesAndStats = categoriesAndStats.sort(
        (a, b) => b[1] - a[1],
    );

    return sortedCategoriesAndStats.map((pair) => {
        return [pair[0], `${pair[1]}%`];
    });
}

// takes in Series of numerical data, outputs dictionary of stats
function analyzeNumericalColumn(numerical_column: Series): [string, number][] {
    // Sort the numerical column to calculate quartiles
    const sortedValues = numerical_column.sortValues({
        ascending: true,
    }).values;

    const mean = numerical_column.mean();
    const median = numerical_column.median();
    const min = numerical_column.min();
    const max = numerical_column.max();

    // Calculate quartiles
    /*
    const q1 = Number(sortedValues[Math.floor(sortedValues.length / 4)]); // First quartile
    const q3 = Number(sortedValues[Math.ceil((sortedValues.length * 3) / 4)]); // Third quartile
    const IQR : number = q3 - q1; // Interquartile range
    const lowerBound = q1 - 1.5 * IQR; // Lower bound for outliers
    const upperBound = q3 + 1.5 * IQR; // Upper bound for outliers
    // @ts-ignore
    const outliers = sortedValues.filter((v: number) => v < lowerBound || v > upperBound);
    */

    return truncateNumbers([
        ['Mean', mean], //number
        ['Median', median], //number
        ['Min', min], //number
        ['Max', max], //number
    ]);
}

// truncates a list of numbers to 8 digits
function truncateNumbers(numbers: [string, number][]): [string, number][] {
    return numbers.map((pair) => {
        const [label, num] = pair;
        let numStr = num.toString();
        if (numStr.length > 8) {
            // Truncate the number to the first six digits
            const offset = numStr[0] === '-' ? 1 : 0;
            numStr = numStr.slice(0, 8 + offset);
        }
        const truncatedNum = parseFloat(numStr);
        return [label, truncatedNum];
    });
}
