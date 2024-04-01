// Takes in File

import * as dfd from 'danfojs';

export async function standardClean(file: File): Promise<dfd.DataFrame> {
    // Promise DF or File?
    return new Promise((resolve, reject) => {
        const file_reader = new FileReader();

        file_reader.onload = async (event) => {
            const file_data = event.target?.result as string;
            // Checks if File is Empty
            if (!file_data) {
                reject('Uploaded File is Empty');
                return;
            }

            try {
                const upload_data = await dfd.readCSV(file); //Reads in CSV
                const drop_rows = upload_data.dropna(); // Drops Rows w/ NaN's
                const cols_drop = drop_rows.columns.filter((col: string) =>
                    drop_rows[col].isna().all(),
                );
                const standardForm = drop_rows.drop(cols_drop, { axis: 1 });

                resolve(standardForm);
            } catch (error) {
                reject(error);
            }
        };

        file_reader.onerror = (error) => {
            reject(error);
        };

        file_reader.readAsText(file);
    });
}
