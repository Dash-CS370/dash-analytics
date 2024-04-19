// Takes User Upload DF & Drops Rows w/ NaNs

import * as dfd from 'danfojs';

export async function standardClean(file: File): Promise<dfd.DataFrame> {
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
                const drop_rows_df = upload_data.dropna(); // Drops Rows w/ NaN's

                resolve(drop_rows_df);
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
