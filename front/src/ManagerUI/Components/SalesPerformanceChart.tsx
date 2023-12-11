import { BarChart } from '@mui/x-charts';
import { SalesPerformanceData } from "./ReportTypes";

/**
 * `SalesPerformanceChart` is a React component that displays a bar chart of sales performance data.
 * 
 * @remarks
 * This component takes an array of sales performance data and maps it to a format suitable for the `BarChart` component.
 * If there is no data, it displays a message saying "No data available".
 * The chart has one series: 'Total Sales', and the x-axis is the served item.
 * 
 * @param data - The sales performance data
 * 
 * @returns The rendered `SalesPerformanceChart` component or a message if there is no data
 */
const SalesPerformanceChart = ({ data }: { data: SalesPerformanceData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    // @ts-ignore
    const chartData = data.map((item) => ({
        num_sales: item.num_sales,
        served_item: item.served_item,

    }));

    console.log("Sales Performance: ", data);

    return (
        <BarChart
            // @ts-ignore
            dataset={data}
            width={1440}
            height={800}
            series={[
                { dataKey: 'number_of_sales', label: 'Total Sales' },
            ]}
            xAxis={[{ dataKey: 'served_item', scaleType: 'band' }]}
  
        />
    );
};

export default SalesPerformanceChart;
