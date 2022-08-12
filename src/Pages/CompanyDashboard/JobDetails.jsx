import React from 'react'
import { useParams } from 'react-router-dom';
import { getjobbyid } from '../../service/api';
import {ReactSession} from 'react-client-session';

function JobDetails(state) {
    console.log(state);
    const {states}=useParams();
    const [jobs, setJobs] = React.useState(null);
    const res=JSON.parse(localStorage.getItem("ids"))
    console.log(res);
    React.useEffect(() => {
        let access_token = ReactSession.get(state.job_id,"access_token");
        const getData = async () => {
          let res = await getjobbyid(access_token);
            console.log(res)
          if (res && res.data) {
            setJobs(res.data.jobs);
            
            
          }
        };
        getData();
      }, []);


    console.log(states);
    console.log(jobs);
  return (
    <div>JobDetailsaeqfEW</div>
  )
}

export default JobDetails