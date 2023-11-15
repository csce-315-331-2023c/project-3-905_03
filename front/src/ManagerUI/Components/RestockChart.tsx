import { BarChart } from '@mui/x-charts';
import { RestockData } from './ReportTypes';

const RestockChart = ({ data }: { data: RestockData[] }) => {
    const chartData = data.map((item) => ({
        stock_item: item.stock_item,
        stock_quantity: item.stock_quantity,
        max_amount: item.max_amount,
    }));

    return (
        <>
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
        </>
    );
};

export default RestockChart;

