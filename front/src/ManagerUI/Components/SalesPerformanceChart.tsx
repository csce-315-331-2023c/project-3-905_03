import { BarChart } from '@mui/x-charts';
import { SalesPerformanceData } from "./ReportTypes";


const SalesPerformanceChart = ({ data }: { data: SalesPerformanceData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    const chartData = data.map((item) => ({
        num_sales: item.num_sales,
        served_item: item.served_item,

    }));

    console.log("Sales Performance: ", data);

    return (
        <BarChart
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
