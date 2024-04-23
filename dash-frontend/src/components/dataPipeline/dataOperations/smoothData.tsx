import { DataFrame, toJSON } from 'danfojs';
import {DataItem } from "@/components/widgets/WidgetTypes";

function determineRowCount(df: DataFrame): number {
    return df.shape[0];
}

function calculateSliceInterval(
    rowCount: number,
    threshold: number,
    minInterval: number,
): number {
    if (rowCount <= threshold) {
        return minInterval;
    } else {
        return Math.ceil(rowCount / threshold);
    }
}

function sliceDF(df: DataFrame, n: number): DataFrame {
    if (!df || !df.shape || df.shape[0] === 0) {
        console.log(new Error('Invalid or empty DataFrame'));
        return DataFrame.prototype;
    }
    if (n <= 0) {
        console.log(new Error('Interval n must be greater than 0'));
        return DataFrame.prototype;
    }
    n = Math.round(n);
    const indices: number[] = [];
    for (let i = 0; i < df.shape[0]; i += n) {
        indices.push(i);
    }

    return df.iloc({ rows: indices });
}

export function processAndSliceDF(
    data: DataItem[],
    threshold: number,
    minInterval: number,
): DataItem[] {
    const df = new DataFrame(data);
    const rowCount = determineRowCount(df);

    if (rowCount <= threshold) {
        return data;
    }
    const sliceInterval = calculateSliceInterval(
        rowCount,
        threshold,
        minInterval,
    );

    const slicedDF = sliceDF(df, sliceInterval);
    return toJSON(slicedDF) as DataItem[];
}
