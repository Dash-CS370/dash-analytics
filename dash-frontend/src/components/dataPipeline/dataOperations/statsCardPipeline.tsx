import { Series } from 'danfojs';

export function generateStatsCard(
    dataframe_column: Series,
): [string, string | number][] {
    // Categorical column
    if (dataframe_column.dtype == 'string') {
        try {
            return analyzeCategoricalColumn(dataframe_column);
        } catch (error) {
            console.error('Error calculating numerical stats:', error);
        }
    } else {
        // Numerical column
        try {
            return analyzeNumericalColumn(dataframe_column);
        } catch (error) {
            console.error('Error calculating categorical stats:', error);
            return [];
        }
    }

    return [];
}

// Takes in Series of categorical data, outputs dictionary of percentages of whole
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
    numerical_column.asType('float32', { inplace: true });

    const mean = numerical_column.mean();
    const median = numerical_column.median();
    const min = numerical_column.min();
    const max = numerical_column.max();

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
        if (numStr.length > 6) {
            // Truncate the number to the first six digits
            const offset = numStr[0] === '-' ? 1 : 0;
            numStr = numStr.slice(0, 6 + offset);
        }
        const truncatedNum = parseFloat(numStr);
        return [label, truncatedNum];
    });
}
