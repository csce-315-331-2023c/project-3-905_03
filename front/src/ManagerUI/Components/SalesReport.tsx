import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SalesReportProps {
  salesData: {
    served_item: string;
    number_of_sales: string;
  }[];
}

const SalesReport: React.FC<SalesReportProps> = ({ salesData }) => {
  const [filter, setFilter] = useState<number>(0);
  const [filteredData, setFilteredData] = useState(salesData);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = parseInt(e.target.value, 10);
    setFilter(newFilter);
    if (!isNaN(newFilter)) {
      setFilteredData(salesData.filter(item => parseInt(item.number_of_sales, 10) >= newFilter));
    } else {
      setFilteredData(salesData);
    }
  };

  const formattedData = filteredData.map(item => ({
    name: item.served_item.trim(),
    sales: parseInt(item.number_of_sales, 10)
  }));

  return (
    <div>
      <div style={{ margin: '20px 0' }}>
        <input
          type="number"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filter by minimum sales"
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReport;
