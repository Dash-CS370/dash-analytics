import * as dfd from 'danfojs';
//import assert from "assert";


// When a Bar Graph widget is to be generated, this is called to prepare the data
export function generateBarChart(dataframe: dfd.DataFrame): any {
    try {
        // TODO - under construction
        // check the types the col -> either both categorical or one is numerical
        // find index of the one and only categorical col
        // make a list of the other col names that are numerical
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

        if (numerical_columns.length === 0) console.log("No numerical columns found in the DataFrame");
        if (categorical_column === null) console.log("No categorical column found in the DataFrame");

        console.log(categorical_column);
        console.log(numerical_columns);

        return preparedBarGraphDf(dataframe, "categorical", ["numerical"]); // 1 numerical column with 1 categorical column

    } catch (error) {
        console.log(error);
    }
}



// Choose operation to be performed (mean)
function preparedBarGraphDf(dataframe: dfd.DataFrame, categorical_column: string, numerical_columns: string[]) {
    const grouped = dataframe.groupby([categorical_column]); // group by categorical column
    const bar_graph_df = grouped.col(numerical_columns).mean(); // select numerical col
    console.log(bar_graph_df);
    return bar_graph_df;
}
