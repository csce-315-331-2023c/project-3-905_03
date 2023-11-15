import { ExcessData } from './ReportTypes';
import { BarChart } from '@mui/x-charts';

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
