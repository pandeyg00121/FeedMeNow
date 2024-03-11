import React from 'react'
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,ArcElement,Legend } from "chart.js"
import {Line,Doughnut} from "react-chartjs-2"

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,ArcElement,Legend);

export const LineChart = () => {
    const labels=getLastYearMonths();
    const options={
        responsive:true,
        plugins:{
            legend:{
                position:"bottom"
            },
            title:{
                display:true,
                text:'Yearly Sales',
            },
        },
    };

    const data={
        labels,
        datasets:[
            {
                label:"Vegetarian",
                data:[1,2,3,4],
                borderColor:"rgba(0,128,0,0.3)",
                backgroundColor:"rgb(0,128,0)"
            },
            {
                label:"Non-Vegetarian",
                data:[2,3,4,5],
                borderColor:"rgba(255,0,0,0.3)",
                backgroundColor:"rgb(255,0,0)"
            }
        ]
    }
  return (
    <Line options={options} data={data}/>
  )
}

export const DoughnutChart=()=>{
    
    const data={
        labels:["Vegetarian","Non Vegetarian"],
        datasets:[
            {
                label:"Preferences",
                data:[20,3],
                borderColor:["rgb(255,255,255)","rgb(255,255,255)"],
                backgroundColor:["rgba(0,255,0,0.3)","rgba(255,0,0,0.3)"],
                borderWidth:1
            }
        ]
    }
    return (
        <Doughnut data={data}/>
    )
}

function getLastYearMonths(){
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