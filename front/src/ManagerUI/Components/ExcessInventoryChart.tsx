import { ExcessData } from './ReportTypes';
import { BarChart } from '@mui/x-charts';

/**
 * `ExcessInventoryChart` is a React component that displays a bar chart of excess inventory.
 * 
 * @remarks
 * This component takes an array of excess inventory data and maps it to a format suitable for the `BarChart` component.
 * If there is no data, it displays a message saying "No data available".
 * The chart has two series: 'Total Sales' and 'Inventory Qty', and the x-axis is the stock ID.
 * 
 * @param data - The excess inventory data
 * 
 * @returns The rendered `ExcessInventoryChart` component or a message if there is no data
 */
const ExcessInventoryChart = ({ data }: { data: ExcessData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }
    console.log("Excess Chart: ", data);
    const chartData = data.map((item) => ({
        sold_quantity: item.sold_quantity,
        stock_quantity: item.stock_quantity,
        stock_id: item.stock_id,
    }));

    return (
        <BarChart
            dataset={chartData}
            width={1440}
            height={800}
            series={[
                { dataKey: 'sold_quantity', label: 'Total Sales' },
                { dataKey: 'stock_quantity', label: 'Inventory Qty' }
            ]}
            xAxis={[{ dataKey: 'stock_id', scaleType: 'band' }]}

        />
    );
};

export default ExcessInventoryChart;
