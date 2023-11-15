import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from '@mui/material/Button';
import '../Styles/ManagerAnalytics.css';
import { ReportData, ReportTypeToStateKeyMap } from './ReportTypes';
import RestockChart from './RestockChart';
import SalesPerformanceChart from './SalesPerformanceChart';
import ExcessInventoryChart from './ExcessInventoryChart';
import InventoryUsageChart from './InventoryUsageChart';
import FreqPairsChart from './FreqPairsChart';

const ManagerAnalytics: React.FC = () => {
  const currentDateTime = new Date();
  const oneYearAgo = new Date(currentDateTime.getFullYear() - 1, currentDateTime.getMonth(), currentDateTime.getDate());

  const [startDateTime, setStartDateTime] = useState<Date>(oneYearAgo);
  const [endDateTime, setEndDateTime] = useState<Date>(currentDateTime);
  const [reportData, setReportData] = useState<ReportData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeReportType, setActiveReportType] = useState<string>('');

  const handleReport = async (reportType: string) => {
    console.log("handleReport(): ", reportType);

    const isDateRangeRequired = reportType !== 'generateRestockReport';

    if (isDateRangeRequired && (!startDateTime || !endDateTime || endDateTime < startDateTime)) {
      alert('Invalid Date Range');
      return;
    }

    setLoading(true);
    setActiveReportType(reportType);

    try {
      let response: AxiosResponse<any, any>;

      if (isDateRangeRequired) {
        const formattedStartDate = startDateTime.toISOString();
        const formattedEndDate = endDateTime.toISOString();

        response = await axios.post(`http://localhost:8080/${reportType}`, {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      } else {
        response = await axios.get(`http://localhost:8080/${reportType}`);
      }

      const stateKey = ReportTypeToStateKeyMap[reportType as keyof typeof ReportTypeToStateKeyMap];
      if (stateKey) {
        setReportData(prevData => ({ ...prevData, [stateKey]: response.data }));
      } else {
        console.error(`Invalid report type: ${reportType}`);
      }
    } catch (error) {
      console.error(`Error fetching ${reportType} data:`, error);
      setReportData({});
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (loading || !reportData) {
      return <p>Loading...</p>; 
    }
    switch (activeReportType) {
      case 'generateRestockReport':
        return <RestockChart data={reportData.restockReport || []} />;
      case 'generateSalesReport':
        return <SalesPerformanceChart data={reportData.salesReport || []} />;
      case 'generateExcessReport':
        return <ExcessInventoryChart data={reportData.excessReport || []} />;
      case 'generateUsageReport':
        return <InventoryUsageChart data={reportData.usageReport || []} />;
      case 'generateFreqPairsReport':
        return <FreqPairsChart data={reportData.freqPairsReport || []} />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className='manager-analytics-container'>
        <div className='date-time-picker-container'>
          <DateTimePicker
            label="Start Date & Time"
            value={startDateTime}
            onChange={(value: Date | null) => setStartDateTime(value || new Date())}
          />
          <DateTimePicker
            label="End Date & Time"
            value={endDateTime}
            onChange={(value: Date | null) => setEndDateTime(value || new Date())}
          />
        </div>
        <div className='report-display-container'>
          {renderChart()}
        </div>

        <div className='report-buttons-container'>
          <Button variant="text" onClick={() => handleReport('generateRestockReport')}>Generate Restock Report</Button>
          <Button variant="text" onClick={() => handleReport('generateSalesReport')}>Generate Sales Report</Button>
          <Button variant="text" onClick={() => handleReport('generateExcessReport')}>Generate Excess Report</Button>
          <Button variant="text" onClick={() => handleReport('generateUsageReport')}>Generate Usage Report</Button>
          <Button variant="text" onClick={() => handleReport('generateFreqPairsReport')}>Generate Freq Pairs Report</Button>
        </div>

        
      </div>
    </LocalizationProvider>
  );
};

export default ManagerAnalytics;
