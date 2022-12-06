import React, { useEffect, useState } from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
);

const BarChart = (props) => {

  let psydata = props.psydata;

  const [alllabels, setalllabels] = useState(null);
  const [alldatas, setalldatas] = useState(null);

  useEffect(()=>{
    let labels = [];
    let datas = [];
    for(let i=0; i<psydata.ocean.details.length; i++){
      labels.push(psydata.ocean.details[i].label.charAt(0).toUpperCase() + psydata.ocean.details[i].label.slice(1));
      datas.push(psydata.ocean.details[i].score);
    }
    console.log(labels);
    console.log(datas);
    setalllabels(labels);
    setalldatas(datas);
  },[]);

  return (
    <div className="">
      <div>
        {alllabels && alldatas ?
          <Bar
            data={{
              labels: [alllabels[0],alllabels[1],alllabels[2],alllabels[3],alllabels[4]],
              datasets: [
                {
                  label: "",
                  data: [alldatas[0],alldatas[1],alldatas[2],alldatas[3],alldatas[4]],
                  backgroundColor: [
                    "#3FD2C7",
                  ],
                  borderColor: [
                      "#3FD2C7",
                  ],
                  borderWidth: 1,
                  borderRadius: 7,
                },
              ],
            }}
            height={400}
            width={600}
            options={{
              plugins: {
                legend: {
                  display: false
                }
              },
              indexAxis: "y",
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    ticks: {
                      beginAtZero: false,
                    },
                  },
                ],
              },
              legend: {
                labels: {
                  fontSize: 25,
                },
              },
            }}
          />
        :null}
      </div>
    </div>
  );
};

export default BarChart;
