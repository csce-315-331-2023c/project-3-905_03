import { BarChart } from '@mui/x-charts';
import { FreqPairsData } from "./ReportTypes";

/**
 * `FreqPairsChart` is a React component that displays a bar chart of frequently paired items.
 * 
 * @remarks
 * This component takes an array of frequently paired items data and maps it to a format suitable for the `BarChart` component.
 * If there is no data, it displays a message saying "No data available".
 * The chart has one series: 'Occurences', and the x-axis is the pair of items.
 * 
 * @param data - The frequently paired items data
 * 
 * @returns The rendered `FreqPairsChart` component or a message if there is no data
 */
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
