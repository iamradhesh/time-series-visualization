# Time Series Data Visualization with CSV Parsing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

This project visualizes time series data from uploaded CSV files. The CSV files are parsed using a web worker to ensure smooth user experience even with large files. The parsed data is displayed as a time series chart using a dynamic component.

## Features

- **CSV Upload**: Upload a CSV file with time series data.
- **Web Worker Integration**: Parsing is handled in the background using a web worker to prevent the UI from freezing on large files.
- **Progress Tracking**: Display a progress bar showing the parsing percentage.
- **Dynamic Chart**: The parsed data is displayed in a dynamic time series chart.
- **Responsive Design**: Styled using Tailwind CSS for a mobile-friendly interface.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
