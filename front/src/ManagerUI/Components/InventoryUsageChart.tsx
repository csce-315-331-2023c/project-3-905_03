import { BarChart } from '@mui/x-charts';
import { InventoryUsageData } from "./ReportTypes";

/**
 * `InventoryUsageChart` is a React component that displays a bar chart of inventory usage.
 * 
 * @remarks
 * This component takes an array of inventory usage data and maps it to a format suitable for the `BarChart` component.
 * If there is no data, it displays a message saying "No data available".
 * The chart has one series: 'Usage Count', and the x-axis is the stock ID.
 * 
 * @param data - The inventory usage data
 * 
 * @returns The rendered `InventoryUsageChart` component or a message if there is no data
 */
const InventoryUsageChart = ({ data }: { data: InventoryUsageData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    console.log("Inventory Usage Chart: ", data);

    return (
        <BarChart
            // @ts-ignore
            dataset={data}
            width={1440}
            height={800}
            series={[
                { dataKey: 'usage_count', label: 'Usage Count' },
            ]}
            xAxis={[{ dataKey: 'stock_id', scaleType: 'band' }]}
        />
    );
};

export default InventoryUsageChart;