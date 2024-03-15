import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
);

export const LineChart = () => {
  const labels = getLastYearMonths();
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white', // Set legend label color to white
        },
      },
      title: {
        display: true,
        text: 'Yearly Sales',
        color: 'white',
      },
    },
    layout: {
      padding: {
        top: 20,
        left: 40,
        right: 40, // Add top padding to create space between chart and labels
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis label color to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis label color to white
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Vegetarian',
        data: [1, 2, 3, 4],
        borderColor: 'rgba(0,128,0,0.3)',
        backgroundColor: 'rgb(0,128,0)',
      },
      {
        label: 'Non-Vegetarian',
        data: [2, 3, 4, 5],
        borderColor: 'rgba(255,0,0,0.3)',
        backgroundColor: 'rgb(255,0,0)',
      },
    ],
  };
  return <Line options={options} data={data} />;
};

export const WeeklyUserChart = () => {
  const labels = getLast12Weeks(); // Updated function to get last 12 weeks
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white', // Set legend label color to white
        },
      },
      title: {
        display: true,
        text: 'Weekly User Increase',
        color: 'white',
      },
    },
    layout: {
      padding: {
        top: 20,
        left: 40,
        right: 40, // Add top padding to create space between chart and labels
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis label color to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis label color to white
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Weekly User Increase',
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], // Example weekly user numbers
        borderColor: 'lightblue',
        backgroundColor: 'lightblue',
        fontColor: 'white',
      },
    ],
  };

  return <Line data={data} options={options} />;
};
export const DoughnutChart = () => {
  const data = {
    labels: ['Cash on Delivery', 'Online Payment'],
    datasets: [
      {
        label: 'Payment Methods',
        data: [30, 70], // Example data percentages
        backgroundColor: ['rgba(0, 128, 0, 0.3)', 'rgba(0, 0, 255, 0.3)'],
        borderColor: ['rgba(0, 128, 0, 1)', 'rgba(0, 0, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white', // Set legend label color to white
        },
      },
      title: {
        display: true,
        text: 'Payment Methods',
        color: 'white',
      },
    },
    labels: {
      color: 'white', // Set label color to white
    },
  };

  return <Doughnut data={data} options={options} />;
};
function getLastYearMonths() {
  const labels = [];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentMonth = new Date().getMonth();

  for (let i = currentMonth; i < months.length; i--) {
    const element = months[i];
    labels.unshift(element);
    if (i === 0) break;
  }

  for (let i = 11; i > 0; i--) {
    if (i === currentMonth) break;
    const element = months[i];
    labels.unshift(element);
  }
  return labels;
}
function getLast12Weeks() {
  const labels = [];
  const currentWeek = new Date().getDate(); // Get current week number

  for (let i = currentWeek; i >= currentWeek - 11; i--) {
    labels.unshift(`Week ${i}`);
    if (i === 1) break;
  }
  return labels;
}
