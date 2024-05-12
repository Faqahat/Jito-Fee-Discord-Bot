import axios from "axios";
import { IRow } from "./types";

export var data: IRow[] = [];

export async function fetchData(url: string): Promise<IRow[]> {
  try {
    const response = await axios.get(url);
    const formattedData: IRow[] = response.data.data.rows.map(
      (row: (string | number)[]) => {
        return {
          timestamp: row[0] as string,
          twentyfive: formatNumber(row[1] as number),
          fifty: formatNumber(row[2] as number),
          seventyfive: formatNumber(row[3] as number),
          ninetyfive: formatNumber(row[4] as number),
          ninetynine: formatNumber(row[5] as number),
          ema50: formatNumber(row[6] as number),
        };
      }
    );
    data = formattedData;
    return formattedData;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return []; // Return an empty array in case of error
  }
}

export function formatNumber(num: number): number {
  let formatted = num.toFixed(5);
  while (formatted.includes(".") && formatted.endsWith("0")) {
    formatted = formatted.slice(0, -1);
  }
  const decimalPart = formatted.split(".")[1];
  if (decimalPart && decimalPart.replace(/0/g, "").length < 2) {
    formatted = (num + 0.00001).toFixed(5);
  }
  return parseFloat(formatted);
}
