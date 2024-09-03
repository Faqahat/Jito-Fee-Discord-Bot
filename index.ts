import { fetchData } from "./data";
import { calculateAverages, calculateAverage } from "./averages";
import { startDiscordBot } from "./discord";
import cron from "node-cron";
import { IRow } from "./types";

const url =
  "https://jito-labs.metabaseapp.com/api/public/dashboard/016d4d60-e168-4a8f-93c7-4cd5ec6c7c8d/dashcard/154/card/188?parameters=%5B%5D";

// Refresh data and recalculate averages every 1 minute
cron.schedule("* * * * *", () => {
  fetchData(url).then(calculateAverages);
});

(async () => {
  let data: IRow[] = await fetchData(url);
  calculateAverages();
  //calculateAverage(data, 4);
  startDiscordBot();
})();
