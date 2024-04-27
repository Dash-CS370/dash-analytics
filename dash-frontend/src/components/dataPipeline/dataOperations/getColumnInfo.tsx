import { ColumnInfo } from '@/components/pages/dashboards/NewProject/NewProject';
import * as dfd from 'danfojs';

export async function getColumnInfo(file: File): Promise<ColumnInfo[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            const csv_text = event.target?.result as string;
            if (!csv_text) {
                reject('No file content');
                return;
            }

            try {
                dfd.readCSV(file)
                    .then((df) => {
                        const columns = df.columns;
                        const dtypes = df.dtypes;

                        const columnInfoArray: ColumnInfo[] = columns.map(
                            (colName, index) => ({
                                colName,
                                dataType: dtypes[index] || 'unknown',
                                description: '',
                                userType: '',
                            }),
                        );
                        resolve(columnInfoArray);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (e) => {
            reject(e);
        };

        reader.readAsText(file);
    });
}
