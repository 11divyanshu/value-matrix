import React from "react";
import JobCard from "../../Components/XIDashboard/JobCard.jsx";
import { listXIEvaluation } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from "formik";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import InterviewListCard from "../../Components/XIDashboard/InterviewListCard.jsx";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
      let res = await listXIEvaluation(
        { user_id: user._id },
        user.access_token
      );
       console.log(res)
      if (res && res.data) {
        setJobs(res.data.jobs);
        setLoader(false);
        console.log(res.jobs);
        let arr = [...res.data.jobs];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        localStorage.setItem("jobsdetails", jsonObj);
      }
    };
    getData();
  }, []);

  return (
    <div className="bg-slate-100">
      <div
        className="flex mx-5 mt-3"
        style={{ justifyContent: "space-between" }}
      >
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
      </div>
      <div className="p-4 w-full md:flex mx-auto">
        <div className=" md:w-3/4 md:mx-5">
          {loader ? (
            <p className="text-center font-semibold my-4">...Loading</p>
          ) : (
            <>
              <div className="flex justify-between w-full bg-white">
                <div
                  className="  py-4 px-5"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">Interviews</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>

              <div className="w-full">
                {jobs &&
                  jobs.map((job) => {
                    return (
                      <div>
                        <InterviewListCard job={job} />
                      </div>
                    );
                  })}
                  {jobs && jobs.length === 0 && (
                    <p className="text-center font-semibold my-5">No Interviews Schduled</p>
                  )}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/4 my-3">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1">
                <BsFillBookmarkFill />
              </p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Posted Jobs</p>
              <p className="text-gray-400 font-semibold text-xs">04</p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">My Learnings</p>
              <p className="text-gray-400 font-semibold text-xs">06</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Save Posts</p>
              <p className="text-gray-400 font-semibold text-xs">01</p>
            </div>
          </div>

          <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
            <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
              {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

              <p className=" mx-2  text-sm ">Support</p>
              <p className="">
                <HiOutlineUser />
              </p>
            </p>

            <div className="flex justify-between text-xs py-4 px-3">
              <div>
                <p>Open 0/5</p>
              </div>
              <div>
                <p>Working 0/5</p>
              </div>
              <div>
                <p>Closed 0/5</p>
              </div>
            </div>
            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Cameron Williamson</p>
                <p className="text-gray-400 text-xs">Product Designer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Brookyln Simmons</p>
                <p className="text-gray-400 text-xs">Software Engineer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Leslie Alexander</p>
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
