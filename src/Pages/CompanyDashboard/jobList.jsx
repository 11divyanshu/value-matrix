import React from "react";
import JobCard from "../../Components/Dashbaord/JobCard.jsx";
import { listJobs } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from 'formik';
import { FilterCompany } from "../../service/api.js";
import Loader from "../../assets/images/loader.gif";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(false);

  const headerso = [
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    { label: "job_description", key: "jobDesc" },
    { label: "createTime", key: "createTime" },
    { label: "uploadedBy", key: "uploadBy" },
    { label: "location", key: "location" },
    { label: "job_type", key: "jobType" },
    { label: "applicants", key: "applicants" },
    { label: "valid_till", key: "validTill" },
    { label: "hiring_organization", key: "hiringOrganization" },
    { label: "basic_salary", key: "basicSalary" },

  ]

  const csvReport = {
    filename: "jobs.csv",
    headers: headerso,
    data: jobs,
  }





  React.useEffect(() => {
    const getData = async () => {

      let c_id  = JSON.parse(localStorage.getItem("user"));
      console.log(c_id);
      let res = await listJobs(c_id._id);
      console.log(res)
      if (res && res.data) {
        setJobs(res.data.jobs);
        console.log(res.data.jobs);
        let arr = [...res.data.jobs];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        localStorage.setItem("jobsdetails", jsonObj);


      }


    };
    getData();
  }, []);

  const applyFilter = async (values) => {
    console.log(values.picked);
    console.log(values.toggle);
    let c_id  = JSON.parse(localStorage.getItem("user"));
      console.log(c_id);
    const access_token = localStorage.getItem("access_token");
    let res = await FilterCompany(c_id._id, values);
    
    if (res && res.data) {
      // await setJobs(res.data.jobs);
      console.log(res.data.jobs);
      let arr = [...res.data.jobs];
      
setJobs([]);
      // setLoader(true);

      setTimeout(() => {
        
        setJobs(res.data.jobs);
      }, 1000);
      // setFilter(res.data.jobs);
     
      console.log(jobs)
      const jsonObj = JSON.stringify(arr);

      // save to localStorage
      localStorage.setItem("jobsdetails", jsonObj);


      
    } else {
      console.log("no response")
    }
  }







  return (

    <> <div className="flex mx-5 mt-3" style={{ justifyContent: 'space-between' }}><p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p>

      <div className="py-3">


        <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button class="bg-blue-600 p-3 w-10vw rounded-md text-white">DOWNLOAD CSV</button></CSVLink></p>
      </div>
    </div>
      <div className="p-4 w-full flex mx-auto" >

        <div className="w-1/4 mx-5 mt-5 h-3/5 shadow-lg rounded-lg">



          <Formik
            initialValues={{
              picked: 'One',
              toggle: false,
              checked: [],
            }}
          // onSubmit={async (values) => {

          // }}
          >
            {({ values }) => (
              <Form className="text-center">
                <div id="my-radio-group " className="text-2xl text-center font-bold font-gray-600">Filters</div>
                <div role="group" className="flex-column content-center text-center align-items-center  py-3 my-3 w-1/2 mx-auto  border-t border-gray-300" aria-labelledby="my-radio-group">

                  <label className="text-center content-center px-5  flex  text-xl">
                    <Field type="radio" className="m-2 " name="picked" value="One" />
                    <p className="text-xl font-bold mx-3 font-gray-600">All</p>
                  </label>
                  <br />
                  <label className="text-center px-5   flex   text-xl">
                    <Field type="radio" className="m-2" name="picked" value="Two" />
                    <p className="text-xl font-bold mx-3 font-gray-600">Active</p>
                  </label>
                  <br />
                  <label className="text-center px-5    flex   text-xl">
                    <Field type="radio" className="m-2" name="picked" value="Three" />
                    <p className="text-xl font-bold mx-3 font-gray-600">Ended</p>
                  </label>
                  {/* <div>Picked: {values.picked}</div> */}
                </div>

                <label className="text-center w-1/2 content-center mx-auto px-5 text-center  flex p-1  text-xl">
                  <Field type="checkbox" className="m-2" name="toggle" />
                  <p className="text-xl font-bold mx-3 font-gray-600">Vacant</p>
                </label>


                <button
                  className="bg-blue-500 text-white shadow-lg rounded-lg my-4 px-4 py-2"
                  onClick={() => applyFilter(values)}
                >
                  Apply
                </button>
              </Form>
            )}
          </Formik>


        </div>
        <div className=" w-3/4 mx-5">

          {loader ? <p>...Loading</p> :
            <div className="p-2 w-full">
              
              {jobs && (
                jobs.map((job) => {
                  return (
                    <JobCard job={job} />
                  )
                })
              )}
            </div>
            }
        </div>


      </div>

    </>
  );
};

export default JobList;
