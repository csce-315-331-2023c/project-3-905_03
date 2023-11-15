import { ExcessData } from './ReportTypes';
import { BarChart } from '@mui/x-charts';

const ExcessInventoryChart = ({ data }: { data: ExcessData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    console.log("Sales Performance: ", data);

    return (
        <BarChart
            dataset={data}
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
