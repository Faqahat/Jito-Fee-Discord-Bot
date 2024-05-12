import { IRow, IAverageRow } from "./types";
import { data, formatNumber } from "./data";
import fs from "fs";

export var averages: { [key: string]: IAverageRow | null } = {};
export function calculateAverages() {
  averages["5m"] = calculateAverage(data, 5);
  averages["20m"] = calculateAverage(data, 20);
  averages["30m"] = calculateAverage(data, 30);
  averages["60m"] = calculateAverage(data, 59);

  const logData = Object.entries(averages)
    .map(([period, average]) => `${period}: ${JSON.stringify(average)}`)
    .join("\n");

  fs.appendFile("./logs/averages.txt", logData + "\n", (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
    return averages;
  });
}

export function calculateAverage(
  data: IRow[],
  minutes: number
): IAverageRow | null {
  const now = new Date();
  const past = new Date(now.getTime() - minutes * 60 * 1000);
  const earliestDataPoint = new Date(data[data.length - 1].timestamp);

  if (past < earliestDataPoint) {
    const diffMinutes = Math.round(
      (now.getTime() - earliestDataPoint.getTime()) / 60000
    );
    console.log(
      `Cannot calculate average for ${minutes} minutes (${minutes}m) because the data only goes back to ${earliestDataPoint.toISOString()} (${diffMinutes}m).`
    );
    return null;
  }
  const filteredData = data.filter((row) => new Date(row.timestamp) >= past);
  console.log(filteredData);
  const average: IAverageRow = {
    period: `${minutes}m`,
    startTime: past.toISOString(),
    endTime: now.toISOString(),
    twentyfive: 0,
    fifty: 0,
    seventyfive: 0,
    ninetyfive: 0,
    ninetynine: 0,
    ema50: 0,
  };
  if (filteredData.length > 0) {
    filteredData.forEach((row) => {
      average.twentyfive += row.twentyfive;
      average.fifty += row.fifty;
      average.seventyfive += row.seventyfive;
      average.ninetyfive += row.ninetyfive;
      average.ninetynine += row.ninetynine;
      average.ema50 += row.ema50;
    });
    average.twentyfive = formatNumber(average.twentyfive / filteredData.length);
    average.fifty = formatNumber(average.fifty / filteredData.length);
    average.seventyfive = formatNumber(
      average.seventyfive / filteredData.length
    );
    average.ninetyfive = formatNumber(average.ninetyfive / filteredData.length);
    average.ninetynine = formatNumber(average.ninetynine / filteredData.length);
    average.ema50 = formatNumber(average.ema50 / filteredData.length);
  }
  console.log(average);
  return average;
}
export function getTransactionChance(value: number): number {
  // Get the current time minus 4 minutes
  const fourMinutesAgo = Date.now() - 3 * 60 * 1000;

  // Filter the data to only include entries from the last 4 minutes
  const lastFourMinutesData = data.filter(
    (entry) => Date.parse(entry.timestamp) >= fourMinutesAgo
  );

  // Define the percentiles and their corresponding values
  const percentiles = [
    { percentile: 25, value: lastFourMinutesData[0].twentyfive },
    { percentile: 50, value: lastFourMinutesData[0].fifty },
    { percentile: 75, value: lastFourMinutesData[0].seventyfive },
    { percentile: 95, value: lastFourMinutesData[0].ninetyfive },
    { percentile: 99, value: lastFourMinutesData[0].ninetynine },
  ];

  // Find the two percentiles that the input value is between
  let lowerPercentile, upperPercentile;
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (value >= percentiles[i].value && value <= percentiles[i + 1].value) {
      lowerPercentile = percentiles[i];
      upperPercentile = percentiles[i + 1];
      break;
    }
  }

  // If the input value is not between any two percentiles, it is below the 25th percentile
  if (!lowerPercentile || !upperPercentile) {
    // If the input value is greater than the maximum value in the data, return 100
    if (value > percentiles[percentiles.length - 1].value) {
      return 100.0;
    }
    // If the input value is less than the 25th percentile, return -1
    else {
      return -1.0;
    }
  }

  // Calculate the exact percentile by linear interpolation
  const slope =
    (upperPercentile.percentile - lowerPercentile.percentile) /
    (upperPercentile.value - lowerPercentile.value);
  const exactPercentile =
    lowerPercentile.percentile + slope * (value - lowerPercentile.value);

  // Return the message
  return parseFloat(exactPercentile.toFixed(0));
}
