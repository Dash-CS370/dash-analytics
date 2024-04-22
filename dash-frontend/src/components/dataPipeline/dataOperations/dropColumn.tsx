import * as dfd from 'danfojs';

// Takes in a danfo dataframe and a list of columns to drop
// Returns a new dataframe with the columns dropped
export function dropColumns(
    dataframe: dfd.DataFrame,
    columns_to_drop: string[],
): dfd.DataFrame {
    // Try to Drop Col's
    console.log(dataframe.shape[1]);

    if (dataframe.shape[0] === 0) {
        throw new Error('Uploaded Dataframe is empty.');
    }

    const finalClean = dataframe.drop({ columns: columns_to_drop });

    if (finalClean.shape[0] === 0) {
        throw new Error(
            'No Data Left in Dataframe After Performing these Drops',
        );
    } else {
        console.log(finalClean.shape[1]);
        return finalClean;
    }
}
