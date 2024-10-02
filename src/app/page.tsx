"use client";
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import dynamic from 'next/dynamic';
import '../app/globals.css'; // Adjust the path if necessary
import GranularityControl from '../components/GranularityControl'; // Import the GranularityControl component

const TimeSeriesChart = dynamic(() => import('../components/TimeSeriesChart'), { ssr: false });

const HomePage: React.FC = () => {
  const [data, setData] = useState<Array<[number, number]>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0); // State to track progress
  const [granularity, setGranularity] = useState<number>(1); // State for controlling granularity

  const handleFileSelected = (file: File) => {
    console.log('File selected inside page.tsx:', file.name);
    setUploadedFile(file);
  };

  const handleParseFile = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }

    console.log("Parsing file...");
    setLoading(true);
    setData([]); // Reset data before parsing
    setProgress(0); // Reset progress

    const fileContent = await readFileAsText(uploadedFile);

    // Use a web worker for parsing to avoid blocking the UI
    const worker = new Worker(new URL('../workers/csvParser.js', import.meta.url));

    worker.postMessage(fileContent);

    worker.onmessage = (event) => {
      console.log("event received from worker");
      if (event.data.progress !== undefined) {
        setProgress(event.data.progress); // Update progress
      }
      if (event.data.data) {
        setData(event.data.data);
      }
      if (event.data.error) {
        console.error("Worker error:", event.data.error);
      }

      // If progress is 100, stop loading
      if (event.data.progress === 100) {
        setLoading(false);
        worker.terminate(); // Terminate the worker after processing
      }
    };

    worker.onerror = (error) => {
      console.error("Worker error:", error);
      setLoading(false);
      worker.terminate(); // Terminate the worker on error
    };
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file content."));
        }
      };

      reader.onerror = (error) => {
        reject(new Error(`File reading error: ${error}`));
      };

      reader.readAsText(file);
    });
  };

  // Function to handle granularity change
  const handleGranularityChange = (granularity: number) => {
    console.log('Granularity changed to:', granularity);
    setGranularity(granularity);
  };

  return (
    <div className="container mx-auto p-6 md:p-8 w-full flex flex-wrap flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Time Series Data Visualization</h1>

      {/* File Upload Component */}
      <FileUpload onFileSelected={handleFileSelected} />

      {/* Parse CSV Button */}
      <button 
        onClick={handleParseFile}
        className={`mt-6 rounded p-2 mb-8 transition duration-300 
                    ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} 
                    text-white font-semibold parseButton`}
        disabled={loading}
      >
        {loading ? "Parsing..." : "Parse CSV"}
      </button>

      {/* Loader with Progress Percentage */}
      {loading && (
        <div className="my-4 text-center">
          <div className="loader text-blue-500">Loading...</div>
          <div className="mt-2">{Math.round(progress)}%</div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Granularity Control */}
      <GranularityControl onGranularityChange={handleGranularityChange} />

      {/* Display the chart or no data message */}
      {data.length > 0 ? (
        <div className="mt-4">
          <TimeSeriesChart data={data} granularity={granularity} /> {/* Pass granularity to chart */}
        </div>
      ) : (
        <p className="text-center text-gray-500">No data to display.</p>
      )}
    </div>
  );
};

export default HomePage;
