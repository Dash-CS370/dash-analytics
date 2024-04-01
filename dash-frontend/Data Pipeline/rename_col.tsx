//  RENAME FUNCTIONALITY - from Label Column Description Screen (Only Called if User Renames A Feature)

import * as dfd from 'danfojs';

export async function rename_col(
    original_col_name: string,
    new_col_name: string,
    dataframe: dfd.DataFrame,
): Promise<dfd.DataFrame> {
    // Renaming Columns
    dataframe.rename({ original_col_name: new_col_name }, { inplace: true });
    return dataframe;
}
