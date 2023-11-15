import { BarChart } from '@mui/x-charts';
import { FreqPairsData } from "./ReportTypes";


const FreqPairsChart = ({ data }: { data: FreqPairsData[] }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    console.log("Freq Pairs Input: ", data);

    return (
        <BarChart
            dataset={data}
            width={1440}
            height={800}
            series={[
                { dataKey: 'occurences', label: 'Occurences' },
            ]}
            xAxis={[{ dataKey: 'item1', scaleType: 'band' }, { dataKey: 'item2', scaleType: 'band' }]}

        />
    );
};

export default FreqPairsChart;
