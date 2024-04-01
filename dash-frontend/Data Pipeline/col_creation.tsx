// Based on GPT Outputs... Pull Specific Col's from
// Convert to Individual 1xN DF that are then Passed to the Data Operations

// Takes in DF... Returns 'Dictionary' with each of the Isolated DF's

import * as dfd from 'danfojs';

// Interface for Dictionary Structure Storing all 1xN DF's
interface isolated_dataframes {
    [key: string]: dfd.DataFrame; //Key --> Col Name, Value --> DataFrame
}

export async function col_df_create(
    dataframe: dfd.DataFrame,
    columns_to_use: string[],
): Promise<isolated_dataframes> {
    if (dataframe.shape[0] === 0) {
        throw new Error('Uploaded Dataframe is empty.');
    }

    const df_isolated: isolated_dataframes = {}; // Initializing Dictionary

    // Creating Individual DF's
    for (const column of columns_to_use) {
        const col_df = new dfd.DataFrame({
            column: dataframe.get(column).values,
        });

        // Adds to Dict
        df_isolated[column] = col_df;
    }

    return df_isolated;
}
