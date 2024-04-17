// Takes in File

import * as dfd from 'danfojs';
import {userClean} from "./user_clean";

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

                const drop_rows_df = upload_data.dropNa(); // Drops Rows w/ NaN's

                console.log(drop_rows_df.shape[0])
                console.log(drop_rows_df.shape[1])

                // GROUP BY AND SEE THE OUT
                let drop_rows_dF = await userClean(drop_rows_df, ["mpg", "rep78", "headroom", "trunk",
                "weight", "length", "turn", "displacement", "gear_ratio", "make"]);

                const grouped_df = drop_rows_dF.groupby(["brand"]);
                // @ts-ignore
                const mean_price_df = grouped_df.mean();
                mean_price_df.print();

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