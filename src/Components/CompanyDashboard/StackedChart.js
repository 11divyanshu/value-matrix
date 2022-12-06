import React, { useEffect, useState } from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { ConsoleView } from "react-device-detect";
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
);

const StackedChart = (props) => {

  let evaluated = props.evaluated;
  let jobskills = props.jobskills;
  let selfassested = props.selfassested;

  const [headskills, setheadskills] = useState([]);
  const [globalroles, setglobalroles] = useState([]);
  const [globalsides, setglobalsides] = useState({});
  const [globalvals, setglobalvals] = useState({});
  const [globalval1s, setglobalval1s] = useState({});
  const [globalval2s, setglobalval2s] = useState({});
  const [globalsideskeys, setglobalsideskeys] = useState([]);
  const [globalvalskeys, setglobalvalskeys] = useState([]);

  useEffect(()=>{
    let temp = [];
    let role = [];
    let side = {side1:[],side2:[],side3:[],side4:[],side5:[],side6:[],side7:[],side8:[]};
    let vals = {val1:[],val2:[],val3:[],val4:[],val5:[],val6:[],val7:[],val8:[]};
    let val1s = {val1:[],val2:[],val3:[],val4:[],val5:[],val6:[],val7:[],val8:[]};
    let val2s = {val1:[],val2:[],val3:[],val4:[],val5:[],val6:[],val7:[],val8:[]};
    console.log(evaluated);
    for(let i=0; i<evaluated.length; i++){
      if(!role.includes(evaluated[i].role)){
        role.push(evaluated[i].role);
      }
      if(!side.side1.includes(evaluated[i].primarySkill)){
        side.side1.push(evaluated[i].primarySkill);
      }
    }
    setglobalroles(role);
    let rolekeys = Object.keys(side);
    let valkeys = Object.keys(vals);
    setglobalsideskeys(rolekeys);
    setglobalvalskeys(valkeys);
    let tempvar = [];
    let tempval = [];
    let tempval2 = [];
    let tempval3 = [];
    for(let i=0; i<role.length; i++){
      tempvar = [];
      tempval = [];
      tempval2 = [];
      tempval3 = [];
      for(let j=0; j<evaluated.length; j++){
        if(!tempvar.includes(evaluated[j].primarySkill) && role[i]===evaluated[j].role){
          tempvar.push(evaluated[j].primarySkill);
          tempval.push(evaluated[j].rating);
          if(jobskills[j]){
            tempval2.push(jobskills[j].rating);
          }else{
            tempval2.push(0);
          }
          if(selfassested[j]){
            tempval3.push(selfassested[j].rating);
          }else{
            tempval3.push(0);
          }
        }
      }
      side[rolekeys[i]] = tempvar;
      vals[valkeys[i]] = tempval;
      val1s[valkeys[i]] = tempval2;
      val2s[valkeys[i]] = tempval3;
    }
    console.log(role);
    console.log(side);
    console.log(vals);
    setglobalsides(side);
    setglobalvals(vals);
    setglobalval1s(val1s);
    setglobalval2s(val2s);
  },[]);

  return (
    <div className="">
      {globalroles.map((roles, i)=>{
        return(
          <div className="px-8">
            <h5 className="font-bold py-4 text-center">{roles}</h5>
            <Bar
              data={{
                labels: globalsides[globalsideskeys[i]],
                datasets: [
                    {
                      label: 'Interviewer Rating',
                      data: globalvals[globalvalskeys[i]],
                      backgroundColor: '#F04854',
                    },
                    {
                      label: 'Required Required',
                      data: globalval1s[globalvalskeys[i]],
                      backgroundColor: '#00458B',
                    },
                    {
                      label: 'Self Rating',
                      data: globalval2s[globalvalskeys[i]],
                      backgroundColor: '#EDD050',
                    },
                  ],
              }}
              height={400}
              width={600}
              options={{
                indexAxis: "y",
                maintainAspectRatio: true,
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
        );
      })}
    </div>
  );
};

export default StackedChart;
