// After Operations are Performed on DF's (Individual Col's)... Remerge into 1 'Final DF' used for Visualizations

import * as dfd from 'danfojs';

export async function finalDF_create(df_dictionary: {
    [key: string]: dfd.DataFrame;
}): Promise<dfd.DataFrame> {
    if (Object.keys(df_dictionary).length === 0) {
        throw new Error('Nothing to merge.');
    }

    let finalDF: dfd.DataFrame | undefined = undefined; // Initializing Final DF

    // Creating Individual DF's
    for (const col in df_dictionary) {
        // Loop through every value in dict and make into 1 df... key is col name and value is the col values
        const col_df = df_dictionary[col];

        if (!finalDF) {
            // If FinalDF is not yet started (still empty/undefined)
            finalDF = col_df.copy();
        } else {
            finalDF = finalDF.concat(col_df, { axis: 1 });
        }
    }

    if (!finalDF) {
        throw new Error('Final Dataframe could not be created.');
    }

    return finalDF;
}
