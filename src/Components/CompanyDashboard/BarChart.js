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

const BarChart = () => {
  return (
    <div className="">
      <div>
        <Bar
          data={{
            labels: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"],
            datasets: [
              {
                label: "",
                data: [60, 80, 40, 100, 60],
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
      </div>
    </div>
  );
};

export default BarChart;
