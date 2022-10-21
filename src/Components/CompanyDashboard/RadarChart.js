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
                data: [4, 3, 7, 6, 5],
                backgroundColor: "#3FD2C7",
                borderColor: "#3FD2C7",
                borderWidth: 1,
              },
              {
                label: "required",
                data: [5, 4, 10, 6, 5],
                backgroundColor: "#00458B",
                borderColor: "#00458B",
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
                    beginAtZero: true,
                    steps: 1,
                    stepValue: 5,
                    max: 100
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
