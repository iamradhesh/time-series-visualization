import React, { useState, useRef } from 'react';
import '../app/globals.css';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>(''); // State for the selected file name

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const isCSV = file.type === 'text/csv' || 
                    file.type === 'application/csv' || 
                    file.type === 'text/plain' || 
                    file.name.endsWith('.csv'); 

      if (!isCSV) {
        alert("Please upload a valid CSV file.");
        return;
      }

      setSelectedFileName(file.name); // Set the selected file name
      onFileSelected(file); // Pass the file to parent component

      // Clear the input field so the same file can be re-uploaded
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="file-upload-wrapper my-4">
      <label className="custom-file-upload">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden-input"
          ref={fileInputRef}
        />
        <span className="custom-file-label">
          {selectedFileName ? selectedFileName : "Choose a file"}
        </span>
      </label>
    </div>
  );
};

export default FileUpload;
