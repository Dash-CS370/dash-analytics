import { DataFrame, readCSV } from 'danfojs';

// cleans CSV on initial upload

export async function cleanOnUpload(file: File): Promise<DataFrame> {
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
                const upload_data = await readCSV(file); //Reads in CSV
                resolve(upload_data.dropNa());  // Drops Rows w/ NaN's
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
