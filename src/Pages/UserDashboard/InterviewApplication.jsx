import React from "react";
import {
  getJobInvitations,
  getUserInterviewApplications,
  handleCandidateJobInvitation,
} from "../../service/api";
import { Popover, Transition } from "@headlessui/react";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import swal from "sweetalert";

const InterviewApplication = () => {
  const [interviews, setInterviews] = React.useState([]);
  const [Loading, setLoading] = React.useState(true);
  const [Error, setError] = React.useState(null);

  React.useEffect(()=>{
    const initial = async () => {
        let user = JSON.parse(await localStorage.getItem("user"));
        let response = await getUserInterviewApplications({user_id : user._id}, user.access_token);
        console.log(response);
        if(response && response.status === 200){
            setInterviews(response.data.data);
            setLoading(false);
        }
    }
    initial();
  },[])

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Interview Applications</p>
      <div className="my-5">
        {Loading && (
          <div className="text-center py-5 text-2xl">Fetching Data</div>
        )}
        {JSON.stringify(interviews)}
        {!Loading && interviews.length === 0 && (
          <div className="text-center py-5 text-2xl">
            No Interview Invitations
          </div>
        )}
        {!Loading && interviews.length > 0 && (
   <div></div>
        )}
      </div>
    </div>
  );
};

export default InterviewApplication;