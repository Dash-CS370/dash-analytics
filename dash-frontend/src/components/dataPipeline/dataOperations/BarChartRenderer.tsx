import * as dfd from 'danfojs';

// When a Bar Graph widget is to be generated, this is called to prepare the data
export function generateBarChart(dataframe: dfd.DataFrame): any {
    // Find index of the one (only) categorical column
    // Make a list of the other cols (should all be numerical)

    let categorical_column = '';
    let numerical_columns: string[] = [];

    // Check the data types of the columns to determine if they're categorical or numerical
    dataframe.columns.forEach((col) => {
        const column_type = dataframe.column(col).dtype; // Get data type of the column

        if (['string', 'object'].includes(column_type)) {
            if (categorical_column === '') {
                categorical_column = col; // Assign first categorical column
            } else {
                throw new Error(
                    'DataFrame should contain only one categorical column',
                );
            }
        } else if (
            ['float32', 'float64', 'int32', 'int64'].includes(column_type)
        ) {
            numerical_columns.push(col); // Collect numerical columns
        }
    });

    if (
        numerical_columns.length === 0 &&
        numerical_columns.length !== dataframe.columns.length - 1
    ) {
        throw new Error(
            'Numerical columns found in the DataFrame does not match correct quantity',
        );
    }

    if (categorical_column === null)
        throw new Error('No categorical column found in the DataFrame');

    return preparedBarGraphDf(dataframe, categorical_column, numerical_columns); // 1 numerical column with 1 or more categorical column
}

// Choose operation to be performed (mean)
function preparedBarGraphDf(
    dataframe: dfd.DataFrame,
    categorical_column: string,
    numerical_columns: string[],
) {

    console.log(dataframe.head(5));
    for (const numerical_column of numerical_columns) {
        dataframe.column(numerical_column).asType("float32", { inplace: true });
    }
    console.log(dataframe.head(5));

    // Group by the categorical column and calculate the mean for the specified numerical columns
    const grouped = dataframe.groupby([categorical_column]);
    const mean_df = grouped.col(numerical_columns).mean();
    mean_df.print()

    // Rename the columns to remove the '_mean' suffix
    const new_column_names: { [key: string]: string } = {}; // Explicit type declaration
    console.log(mean_df.columns)
    mean_df.columns.forEach(col => {
        new_column_names[col] = col.replace("_mean", ""); // remove '_mean' suffix
    });
    console.log(mean_df.columns)

    mean_df.rename(new_column_names, { inplace: true }); // apply the new names

    return mean_df; // return the modified DataFrame
}