importScripts('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js');

self.onmessage = function (event) {
  const fileContent = event.data;
  const results = [];
  const chunkSize = 100; // Number of rows to process at a time
  const totalRows = fileContent.split('\n').length; // Count total rows

  Papa.parse(fileContent, {
    complete: (parsedResults) => {
      const rows = parsedResults.data;

      // Function to process chunks
      const processChunk = (start) => {
        const end = Math.min(start + chunkSize, totalRows);
        for (let index = start; index < end; index++) {
          const row = rows[index];
          const value = parseFloat(row[0]); // Assuming single-column CSV
          if (!isNaN(value)) {
            results.push([index, value]);
          }
        }

        // Send progress update
        const progress = ((end / totalRows) * 100);
        self.postMessage({ progress, data: results });

        // If there are more rows to process, continue with the next chunk
        if (end < totalRows) {
          setTimeout(() => processChunk(end), 0); // Use setTimeout to allow the UI to remain responsive
        } else {
          // Notify completion with final data
          self.postMessage({ progress: 100, data: results });
        }
      };

      // Start processing the first chunk
      processChunk(0);
    },
    error: (error) => {
      console.error("Parsing error:", error);
      self.postMessage({ error: error });
    },
  });
};
