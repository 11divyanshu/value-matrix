import React from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = () => {
  return (
    <div className="">
      <div>
        <Radar
          data={{
            labels: [
              "Critical Thinking",
              "Problem Solving",
              "Attention to details",
              "Numerical reasoning",
              "Spatial reasoning",
            ],
            datasets: [
              {
                label: "Score",
                data: [2, 9, 3, 5, 2, 3],
                backgroundColor: "#3FD2C7",
                borderColor: "#3FD2C7",
                borderWidth: 1,
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

export default RadarChart;
