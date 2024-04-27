import { DataFrame } from 'danfojs';

// Takes in a danfo dataframe and a list of columns to drop
// Returns a new dataframe with the columns dropped
export function dropColumns(
    dataframe: DataFrame,
    columns_to_drop: string[],
): DataFrame {
    if (dataframe.shape[0] === 0) {
        throw new Error('Uploaded Dataframe is empty.');
    }

    const finalClean = dataframe.drop({ columns: columns_to_drop });

    if (finalClean.shape[0] === 0) {
        throw new Error(
            'No Data Left in Dataframe After Performing these Drops',
        );
    } else {
        return finalClean;
    }
}
