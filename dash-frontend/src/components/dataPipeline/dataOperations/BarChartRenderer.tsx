import * as dfd from 'danfojs';

// When a Bar Graph widget is to be generated, this is called to prepare the data
export function generateBarChart(dataframe: dfd.DataFrame): any {

    // Find index of the one (only) categorical column
    // Make a list of the other cols (should all be numerical)

    let categorical_column = "";
    let numerical_columns : string[] = [];

    // Check the data types of the columns to determine if they're categorical or numerical
    dataframe.columns.forEach((col) => {
        const column_type = dataframe.column(col).dtype; // Get data type of the column

        if (["string", "object"].includes(column_type)) {
            if (categorical_column === "") {
                categorical_column = col; // Assign first categorical column
            } else {
                throw new Error("DataFrame should contain only one categorical column");
            }
        } else if (["float32", "float64", "int32", "int64"].includes(column_type)) {
            numerical_columns.push(col); // Collect numerical columns
        }
    });

    if (numerical_columns.length === 0 && numerical_columns.length !== dataframe.columns.length - 1) {
        throw new Error("Numerical columns found in the DataFrame does not match correct quantity");
    }

    if (categorical_column === null) throw new Error("No categorical column found in the DataFrame");

    return preparedBarGraphDf(dataframe, categorical_column, numerical_columns); // 1 numerical column with 1 or more categorical column
}



// Choose operation to be performed (mean)
function preparedBarGraphDf(dataframe: dfd.DataFrame, categorical_column: string, numerical_columns: string[]) {
    const grouped = dataframe.groupby([categorical_column]); // group by categorical column
    console.log(grouped.col(numerical_columns).mean()); // TODO remove
    return grouped.col(numerical_columns).mean(); // select numerical columns
}