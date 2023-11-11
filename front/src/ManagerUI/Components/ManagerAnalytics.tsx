import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/ManagerAnalytics.css';

interface ReportData {
  salesReport?: any[];
  excessReport?: any[];
  usageReport?: any[];
  restockReport?: any[];
  freqPairsReport?: any[];
}

interface ReportParams {
  startDate: string;
  endDate: string;
}

const ManagerAnalytics: React.FC = () => {
  const currentDateTime = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

  const [startDate, setStartDate] = useState<Date>(oneYearAgo);
  const [startTime, setStartTime] = useState<string>(currentDateTime.toISOString().split('T')[1].substring(0, 5));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<string>(new Date().toISOString().split('T')[1].substring(0, 5));
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (reportType: string) => {
    console.log("fetchReport(): ", reportType);
    await axios.get(`http://localhost:8080/${reportType}`).then((response) => {
      setReportData(response.data);
      console.log("response.data: ", response.data);
      
    }
    ).catch((error) => {
      console.error(`Error Fetching: ${reportType}}`, error);
      setReportData(null);
    }).finally(() => {
      console.log("reportData: ", reportData);
    });
  };

  const handleGenerateReport = async (reportType: string) => {
    console.log("fetchReport(): ", reportType);
    let startDateTime = new Date(`${startDate.toISOString().split('T')[0]}T${startTime}`);
    let endDateTime = new Date(`${endDate.toISOString().split('T')[0]}T${endTime}`);

    if (endDateTime < startDateTime) {
      alert('Invalid Date Range');
      return;
    }

    let formattedStartDate = startDateTime.toISOString();
    let formattedEndDate = endDateTime.toISOString();

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/${reportType}`, { startDate: formattedStartDate, endDate: formattedEndDate });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData(null);
    } finally {
      setLoading(false);
      console.log("reportData: ", reportData);
    }
  };

  return (
    <div className='manager-analytics-container'>
      <div className='date-time-picker-container'>
        <div className='date-picker-container'>
          <label>
            Start Date:
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => date && setStartDate(date)}
              dateFormat='yyyy-MM-dd'
              wrapperClassName='date-picker'
            />
          </label>
          <label>
            Start Time:
            <TimePicker
              onChange={(value) => value && setStartTime(value)}
              value={startTime}
              className='time-picker'
            />
          </label>
        </div>
        <div className='date-picker-container'>
          <label>
            End Date:
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => date && setEndDate(date)}
              dateFormat='yyyy-MM-dd'
              wrapperClassName='date-picker'
            />
          </label>
          <label>
            End Time:
            <TimePicker
              onChange={(value) => value && setEndTime(value)}
              value={endTime}
              className='time-picker'
            />
          </label>
        </div>
      </div>

      <div className='report-buttons-container'>
        <button onClick={() => fetchReport('generateRestockReport')}>Generate Restock Report</button>
        <button onClick={() => handleGenerateReport('generateSalesReport')}>Generate Sales Report</button>
        <button onClick={() => handleGenerateReport('generateExcessReport')}>Generate Excess Report</button>
        <button onClick={() => handleGenerateReport('generateUsageReport')}>Generate Usage Report</button>
        <button onClick={() => handleGenerateReport('generateFreqPairsReport')}>Generate Freq Pairs Report</button>
      </div>

      <div className='report-display-container'>
        {loading ? <p>Loading...</p> : reportData && <pre>{JSON.stringify(reportData, null, 2)}</pre>}
        
      </div>

      
    </div>
  );
};

export default ManagerAnalytics;
