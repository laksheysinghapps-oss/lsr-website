import React from 'react';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from 'recharts';

// Loaded lazily from Home so the charts library (~100 KB gzipped) is not downloaded on every page.
const HomeChart: React.FC<{ data: Array<{ name: string; ggn: number; blr: number }> }> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <XAxis dataKey="name" stroke="#555" tick={{fill: '#888'}} />
      <YAxis stroke="#555" tick={{fill: '#888'}} />
      <Tooltip
        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
        itemStyle={{ color: '#fff' }}
      />
      <Line type="monotone" dataKey="ggn" stroke="url(#lsr-gold-grad)" strokeWidth={2} dot={{fill: '#c9a54a', stroke: '#f2e49e', strokeWidth: 1}} />
      <Line type="monotone" dataKey="blr" stroke="#333" strokeWidth={2} strokeDasharray="5 5" />
    </LineChart>
  </ResponsiveContainer>
);

export default HomeChart;
