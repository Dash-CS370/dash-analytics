// Based on the Col's the User 'Throws Away' when Labeling Features & any Feature Renaming
// Drop and then Save Final --> Upload to S3

import * as dfd from 'danfojs';

export async function userClean(
    dataframe: dfd.DataFrame,
    columns_to_drop: string[],
): Promise<dfd.DataFrame> {
    // Try to Drop Col's
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
