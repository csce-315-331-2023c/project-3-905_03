import { BarChart } from '@mui/x-charts';
import { InventoryUsageData } from "./ReportTypes";


const InventoryUsageChart = ({ data }: { data: InventoryUsageData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    console.log("Inventory Usage Chart: ", data);

    return (
        <BarChart
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