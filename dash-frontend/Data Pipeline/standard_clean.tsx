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
                console.log(upload_data.shape[0])
                console.log(upload_data.shape[1])
                console.log(upload_data.head(5))

                const drop_rows = upload_data.dropNa(); // Drops Rows w/ NaN's

                console.log(drop_rows.shape[0])
                console.log(drop_rows.shape[1])
                console.log(drop_rows.head(5))

                resolve(drop_rows);
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