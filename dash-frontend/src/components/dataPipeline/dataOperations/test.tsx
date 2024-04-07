import React, { useEffect } from 'react';
import * as dfd from 'danfojs';
import { normalize } from './operations';

const TestNormalize = () => {
  useEffect(() => {
    // Create a simple DataFrame
    const sampleData = {
      'Column1': [10, 20, 30, 40, 50],
    };
    const df = new dfd.DataFrame(sampleData);

    // Apply the normalize function
    normalize(df).then(normalizedDf => {
      console.log("Normalized DataFrame:");
      normalizedDf.print(); // Using Danfo.js's print function for nicer console output
    });
  }, []);

  return (
    <div>
      <h1>Testing Normalize Function</h1>
      <p>Check the console for the normalized DataFrame result.</p>
    </div>
  );
};

export default TestNormalize;
