import React from "react";
import JobCard from "../../Components/Dashbaord/JobCard.jsx";
import { listJobs } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from 'formik';
import { FilterCompany } from "../../service/api.js";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from 'react-icons/bs'
import { HiOutlineUser } from 'react-icons/hi'
import { Popover, Transition } from "@headlessui/react";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(false);

  const headerso = [
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    // { label: "job_description", key: "jobDesc" },
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

      let c_id = JSON.parse(localStorage.getItem("user"));
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
    setLoader(true);
    console.log(values.picked);
    console.log(values.toggle);
    let c_id = JSON.parse(localStorage.getItem("user"));
    console.log(c_id);
    const access_token = localStorage.getItem("access_token");
    let res = await FilterCompany(c_id._id, values);

    if (res && res.data) {
      // await setJobs(res.data.jobs);
      console.log(res.data.jobs);
      let arr = [...res.data.jobs];

      setJobs([]);
      // setLoader(true);
      setLoader(false);
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

    <div className="bg-slate-100">
      <div className="flex mx-5 mt-3" style={{ justifyContent: 'space-between' }}>
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">Hey Andrew - <p className="text-gray-400 px-2"> here's what's happening today!</p></p>

        <div className="py-3">


          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button class=" p-3 w-10vw rounded-md text-white" style={{ backgroundColor: "#034488" }}>Download CSV</button></CSVLink></p>
        </div>
      </div>
      <div className="p-4 w-full md:flex mx-auto" >

        {/* <div className="md:w-1/4 sm:w-full  mt-5 h-3/5 shadow-lg rounded-lg">



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
              <Form className="px-5 py-3 bg-white">
                <div id="my-radio-group " className="text-2xl font-bold py-4 font-gray-600">Filters</div>
                <div role="group" className="flex-column align-items-center  py-3 my-3 w-1/2 border-t border-gray-300" aria-labelledby="my-radio-group">

                  <label className="content-center px-4  flex  text-xl">
                    <Field type="radio" className="m-2 " name="picked" value="One" />
                    <p className="text-xl font-bold mx-3 font-gray-600">All</p>
                  </label>
                  <br />
                  <label className="px-4   flex   text-xl">
                    <Field type="radio" className="m-2" name="picked" value="Two" />
                    <p className="text-xl font-bold mx-3 font-gray-600">Active</p>
                  </label>
                  <br />
                  <label className="px-4 flex text-xl">
                    <Field type="radio" className="m-2" name="picked" value="Three" />
                    <p className="text-xl font-bold mx-3 font-gray-600">Ended</p>
                  </label>
                </div>

                <label className="w-1/2 content-center mx-auto px-4 flex p-1  text-xl">
                  <Field type="checkbox" className="m-2" name="toggle" />
                  <p className="text-xl font-bold mx-3 font-gray-600">Vacant</p>
                </label>


                <button
                  className=" text-white shadow-lg rounded-lg my-4 px-4 py-2"
                  style={{backgroundColor:"#034488"}}
                  onClick={() => applyFilter(values)}
                >
                  Apply
                </button>
              </Form>
            )}
          </Formik>


        </div> */}
        <div className=" md:w-3/4 md:mx-5">

          {loader ? <p>...Loading</p> :
            <>
              <div className="flex justify-between w-full bg-white">
                <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}><p className="text-gray-900 w-full font-bold">Posted Jobs</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>

              <div className="w-full">


                {jobs && (
                  jobs.map((job) => {
                    return (
                      <JobCard job={job} />
                    )
                  })
                )}
              </div>
            </>
          }
        </div>

        <div className="md:w-1/4 my-3">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1"><BsFillBookmarkFill /></p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Posted Jobs</p><p className="text-gray-400 font-semibold text-xs">04</p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">My Learnings</p><p className="text-gray-400 font-semibold text-xs">06</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Save Posts</p><p className="text-gray-400 font-semibold text-xs">01</p>
            </div>
          </div>

          <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
            <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">

              {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}


              <p className=" mx-2  text-sm ">Support</p><p className=""><HiOutlineUser /></p>
            </p>

            <div className="flex justify-between text-xs py-4 px-3">
              <div><p>Open 0/5</p></div>
              <div><p>Working 0/5</p></div>
              <div><p>Closed 0/5</p></div>
            </div>
            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Cameron Williamson</p>
                <p className="text-gray-400 text-xs">Product Designer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Brookyln Simmons</p>
                <p className="text-gray-400 text-xs">Software Engineer</p>
              </div>
            </div>


            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Leslie Alexander</p>
                <p className="text-gray-400 text-xs">Project Manager</p>
              </div>
            </div>





            {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}


          </div>

        </div>


      </div>

    </div>
  );
};

export default JobList;
