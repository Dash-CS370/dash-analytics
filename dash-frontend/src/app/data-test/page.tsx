'use client';

import styles from '@/app/data-test/page.module.css';
import { useState } from 'react';
import * as dfd from 'danfojs';
import {
    normalize,
    standardize,
    calculateDelta,
    calculatePercentageChange,
    percentOfTotal,
    logarithmicScaling,
    squareRootTransform,
    rollingAverage,
    rollingMedian,
    discretizeColumn,
    processAndSliceDF,
} from '@/components/dataPipeline/dataOperations/operations';

export default function DataTest() {
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const f = event.target.files?.[0];
        if (!f) {
            return;
        }

        dfd.readCSV(f).then((df) => {
            standardize(df).then((standerdizedDF) => {
                console.log('StanderdizedDF df:');
                standerdizedDF.print();
            });
            console.log(df);
        });

        dfd.readCSV(f).then((df) => {
            normalize(df).then((normalizedDF) => {
                console.log('Normalized df:');
                normalizedDF.print();
            });
            console.log(df);
        });

        dfd.readCSV(f).then((df) => {
            calculateDelta(df).then((calculatedDeltaDF) => {
                console.log('CalculatedDelta df:');
                calculatedDeltaDF.print();
            });
            console.log(df);
        });

        dfd.readCSV(f).then((df) => {
            calculatePercentageChange(df).then(
                (calculatePercentageChangeDF) => {
                    console.log('calculatePercentageChange df:');
                    calculatePercentageChangeDF.print();
                },
            );
            console.log(df);
        });

        dfd.readCSV(f).then((df) => {
            percentOfTotal(df).then((percentOfTotalDF) => {
                console.log('percentOfTotal df:');
                percentOfTotalDF.print();
            });
            console.log(df);
        });

        dfd.readCSV(f).then((df) => {
            logarithmicScaling(df).then((logarithmicScalingDF) => {
                console.log('logarithmicScaling df:');
                logarithmicScalingDF.print();
            });
            console.log(df);
        });

        dfd.readCSV(f).then((df) => {
            squareRootTransform(df).then((squareRootTransformDF) => {
                console.log('squareRootTransform df:');
                squareRootTransformDF.print();
            });
            console.log(df);
        });
    };

    return (
        <main className={styles.main}>
            <input
                type="file"
                id="fileUpload"
                accept=".csv"
                onChange={handleFileSelect}
                required
            />
        </main>
    );
}
