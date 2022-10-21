import React from "react";
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

const StackedChart = () => {
  return (
    <div className="">
      <div>
        <Bar
          data={{
            labels: ["Mongo Db", "Java", "Redux", "Reat native", "Android", "IOS", "Design Patterns", "Data Structures " ],
            datasets: [
                {
                  label: 'Abcdxxx Rating',
                  data: [3, 2, 2.5, 4, 3.5, 2, 1.5, 4],
                  backgroundColor: '#F04854',
                },
                {
                  label: 'Minimun Required',
                  data: [4.5, 3, 3.5, 2, 2.5, 3, 4, .5, 2],
                  backgroundColor: '#00458B',
                },
                {
                  label: 'Self Rating',
                  data: [3.5, 1.5, 3, 4.5, 3, 2.5, 1.2, 2.5],
                  backgroundColor: '#EDD050',
                },
              ],
          }}
          height={400}
          width={600}
          options={{
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
      </div>
    </div>
  );
};

export default StackedChart;
