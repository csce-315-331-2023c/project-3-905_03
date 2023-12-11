import { BarChart } from '@mui/x-charts';
import { RestockData } from './ReportTypes';

/**
 * `RestockChart` is a React component that displays a bar chart of restock data.
 * 
 * @remarks
 * This component takes an array of restock data and maps it to a format suitable for the `BarChart` component.
 * The chart has two series: 'Stock Quantity' and 'Max Amount', and the x-axis is the stock item.
 * 
 * @param data - The restock data
 * 
 * @returns The rendered `RestockChart` component
 */
const RestockChart = ({ data }: { data: RestockData[] }) => {

    console.log("Restock Chart: ", data);
    const chartData = data.map((item) => ({
        stock_item: item.stock_item,
        stock_quantity: item.stock_quantity,
        max_amount: item.max_amount,
    }));

    return (
        <BarChart
            dataset={chartData}
            width={1440}
            height={800}
            series={[
                { dataKey: 'stock_quantity', label: 'Stock Quantity' },
                { dataKey: 'max_amount', label: 'Max Amount' },
            ]}
            xAxis={[{ dataKey: 'stock_item', scaleType: 'band' }]}
        />
    );
};

export default RestockChart;

