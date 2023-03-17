import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


export const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
        // position: 'top',
      },
      title: {
        display: true,
        text: 'Land Cover Chart',
      },
    },
  };






const LulcBar = ({data}) => {
  return (
     <Bar options={options} data={data}  width={300}
     height={250}  />
  )
}

export default LulcBar