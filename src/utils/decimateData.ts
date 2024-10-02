export function decimateData(data: Array<[number, number]>, maxPoints: number) {
  console.log("inside decimateData...")
  if (data.length <= maxPoints) return data; // Return original data if less than maxPoints
  
  const decimated: Array<[number, number]> = [];
  const bucketSize = data.length / maxPoints;

  for (let i = 0; i < data.length; i += bucketSize) {
    const roundedIndex = Math.floor(i); // Ensure we get valid indexes within bounds
    decimated.push(data[roundedIndex]);
  }

  // Ensure the last data point is included
  if (data[data.length - 1] !== decimated[decimated.length - 1]) {
    decimated.push(data[data.length - 1]);
  }

  return decimated;
}
