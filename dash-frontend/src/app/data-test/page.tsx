'use client';

import styles from '@/app/data-test/page.module.css';
import { useState } from 'react';
import * as dfd from 'danfojs';
import { normalize } from '@/components/dataPipeline/dataOperations/operations';

export default function DataTest() {
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const f = event.target.files?.[0];
        if (!f) {
            return;
        }

        dfd.readCSV(f).then((df) => {
            // test functions
            normalize(df).then((normalizedDF) => {
                console.log('Normalized df:');
                normalizedDF.print();
            });
            // print using console.log()
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
