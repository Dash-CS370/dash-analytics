import * as dfd from 'danfojs';
//import assert from "assert";



// When a Bar Graph widget is to be generated, this is called to prepare the data
export function generateBarChart(dataframe: dfd.DataFrame): any {
    try {

        const ctypes = (dataframe.ctypes as any) as { [key: string]: string };

        for (let ctypesKey in ctypes) {
            console.log(ctypesKey)
        }

        // TODO - under construction
        // assert the DF has 2 columns
        // check the types the col -> either both categorical or one is numerical
        const containsNumericalColumn = true;

        // if one of the columns is numerical
        if (containsNumericalColumn) {
            return mixedBarGraphDf(dataframe); // 1 numerical column with 1 categorical column
        } else {
            return homogenousBarGraph(dataframe); // 1 categorical with 1 categorical column
        }

    } catch (error) {
        console.log(error);
    }
}



function mixedBarGraphDf(dataframe: dfd.DataFrame) {
    const grouped = dataframe.groupby(["brand"]); // group by categorical column
    // Choose operation to be performed (mean)
    const averagesByCategories = grouped.col(["displacement"]).mean(); // select numerical col
    console.log(averagesByCategories);
}


function homogenousBarGraph(dataframe: dfd.DataFrame) {
    const grouped = dataframe.groupby(["brand"]); // group by categorical column
    // Choose operation to be performed ()
    const averagesByCategories = grouped.col(["displacement"]).mean(); // select numerical col
    console.log(averagesByCategories);
}
