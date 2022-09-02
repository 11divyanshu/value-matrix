import React from "react";
import {
  getJobInvitations,
  handleCandidateJobInvitation,
} from "../../service/api";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const JobInvitations = () => {
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [Loading, setLoading] = React.useState(true);
  const [Error, setError] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );

      if (res && res.status === 200) {
        setJobInvitation(res.data.jobInvites);
        setLoading(false);
      }
    };
    initial();
  }, []);

  const handleJobInvitation = async (job, accept) => {
    try {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await handleCandidateJobInvitation(
        { job_id: job._id, user_id: user._id, accept: accept },
        user.access_token
      );
      if (res && res.status === 200) {
        let d = JobInvitation.filter((el) => {
          return el !== job;
        });
        await setJobInvitation(d);
        await setJobInvitation(d);
        swal({
          title: "Success",
          text: accept ? "Job Invitation Accepted" : "Job Invitation Rejected",
          icon: "success",
          button: "Ok",
        });
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    } catch (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Job Invitations</p>
      <div className="my-5">
        {Loading && (
          <div className="text-center py-5 text-2xl">Fetching Data</div>
        )}
        {!Loading && JobInvitation.length === 0 && (
          <div className="text-center py-5 text-2xl">No Job Invitations</div>
        )}
        {!Loading && JobInvitation.length > 0 && (
          <div>
            <div className="my-4">
              {JobInvitation.map((job, index) => {
                return (
                  <div className="bg-slate-200 p-3 w-1/2 text-md shadow-md my-3">
                    <div className="flex items-baseline">
                      <p className="font-semibold mr-2">{job.jobTitle}</p>
                      <p>|</p>
                      <p className="mr-auto ml-2">{job.hiringOrganization}</p>
                    </div>

                    {job.jobDesc && (
                      <p
                        className="py-2"
                        dangerouslySetInnerHTML={{ __html: job.jobDesc }}
                      ></p>
                    )}
                    <div className="my-3 flex space-x-2">
                      <a
                        href={`/user/jobDetails/${job._id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="bg-blue-500 px-2 py-1 text-white rounded-sm">
                          View Details
                        </button>
                      </a>
                      <button
                        className="bg-blue-500 px-2 py-1 text-white rounded-sm"
                        onClick={() => {
                          handleJobInvitation(job, true);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="border-[0.5px] border-red-500 text-red-500 px-2 py-1 rounded-sm"
                        onClick={() => {
                          handleJobInvitation(job, false);
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInvitations;
