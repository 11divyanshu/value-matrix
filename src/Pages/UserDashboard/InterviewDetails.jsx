import React from "react";
import { getJobById } from "../../service/api";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import DOMPurify from "dompurify";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { CgWorkAlt } from "react-icons/cg";
import {
  userInterviewsDetails,
  getJobInvitations,
  handleCandidateJobInvitation,
  updateContactOTP,
  updateSlot,
  bookSlot,
  availableSlots,
  findCandidateByEmail,
  updateInterviewApplication
} from "../../service/api";
import { Fragment } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import swal from "sweetalert";
import Loader from "../../assets/images/loader.gif";
import Moment from "react-moment";
import DatePicker from "react-date-picker";
import Rating from "../../Components/Dashbaord/Rating";

function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [chooseSlot, setchooseSlot] = React.useState(null);
  const [slot, setSlot] = React.useState([]);
  const [otp, setotp] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [slotId, setslotId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(new Date());
  const [smsOTP, setsmsOTP] = React.useState("");
  const [candidate, setCandidate] = React.useState(null);
  const [comment, setComment] = React.useState(null);

  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  };
  React.useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      await setUser(user);
      // let res = await getJobById(job_id, access_token);
      let res = await userInterviewsDetails(props.id);
      console.log(props);
      let slots = await availableSlots(user._id);
      console.log(slots.data);
      setSlot(slots.data);

      let candidate = await findCandidateByEmail(user.email);
      console.log(candidate);

      setCandidate(candidate.data[0]);

      console.log(res);
      let primarySkills = {};
      let roles = new Set([]);
      if (res.data[0].job[0].skills) {
        res.data[0].job[0].skills.forEach((skill) => {
          roles.add(skill.role);
          if (primarySkills[skill.role]) {
            primarySkills[skill.role].add(skill.primarySkill);
          } else {
            primarySkills[skill.role] = new Set([skill.primarySkill]);
          }
        });
      }
      setRoles(Array.from(roles));
      Array.from(roles).map((el) => {
        primarySkills[el] = Array.from(primarySkills[el]);
      });
      setSkillsPrimary(primarySkills);
      if (res) {
        setJob(res.data[0]);
      }
    };

    getData();
  }, [job_id]);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div className="w-full p-5 h-full bg-slate-100">
      {otpModal && (
        <Transition
          appear
          show={otpModal}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => { }}
            static={true}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all h-[30vh]">
                    <p>Enter OTP</p>
                    <input
                      type="number"
                      name="smsOTP"
                      onChange={handleOTP}
                      placeholder="Email OTP"
                      className="w-full"
                      style={{ borderRadius: "12px", marginTop: "10px" }}
                    ></input>
                    <div className="flex my-3">
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={async () => {
                          console.log(smsOTP);
                          console.log(otp);

                          if (smsOTP == otp) {
                            console.log(user._id);
                            let deleteSlot = await updateSlot(props.id, {
                              userId: null,
                              status: "Available",
                              interviewId: null,
                            });
                            let update = await updateSlot(slotId, {
                              userId: user._id,
                              status: "Pending",
                              interviewId: job.interviewId,
                            });

                            // handleJobInvitation(invitation, true);
                            if (update.status == 200) {
                              swal({
                                title: "Interview Rescheduled Successfully !",
                                message: "Success",
                                icon: "success",
                                button: "Continue",
                              }).then((result) => {
                                window.location.href = "/user/interviews";
                                setslotId(null);
                                setotpModal(false);
                              });
                            }
                          } else {
                            swal({
                              title: "Invalid OTP !",
                              message: "Error",
                              icon: "error",
                              button: "Continue",
                            });
                          }
                        }}
                      >
                        Submit
                      </button>
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={async () => {
                          let resend = await updateContactOTP(
                            { contact: user.contact },
                            { access_token: user.access_token }
                          );
                          console.log(resend.otp);
                          setotp(resend.otp);
                        }}
                      >
                        Resend OTP
                      </button>

                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setotpModal(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {chooseSlot && (
        <Transition
          appear
          show={chooseSlot}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => { }}
            static={true}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all h-[65vh]">
                    <div className=" px-3 py-5 rounded-lg bg-white w-full">
                      <div className="flex items-start space-x-3 	">
                        {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                        <div className="py-1 mx-3 flex">
                          <p className="text-lg text-center font-semibold">
                            Available Slots
                          </p>
                          <p
                            onClick={() => {
                              setchooseSlot(false);
                            }}
                          >
                            Close
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 	">
                        {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                        <div className="py-1 mx-3 flex">
                          <p className="text-lg text-center font-semibold">
                            <DatePicker
                              onChange={setStartTime}
                              value={startTime}
                              disableClock
                            />
                          </p>
                        </div>
                      </div>
                      <div className="my-3">
                        <div className="mx-2  my-4">
                          <label>
                            <Moment format="D MMM YYYY" withTitle>
                              {new Date(startTime)}
                            </Moment>
                          </label>
                          <br />
                          <div className="flex my-2 ">
                            {slot &&
                              slot.map((item, index) => {
                                if (
                                  new Date(item.startDate).getDate() ===
                                  new Date(startTime).getDate()
                                ) {
                                  return (
                                    <span
                                      className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer"
                                      onClick={async () => {
                                        let res = await bookSlot({
                                          candidate_id: candidate.candidate_id,
                                          slotId: item._id,
                                        });
                                        console.log(res);
                                        if (res && res.status === 200) {
                                          setchooseSlot(false);
                                          setotpModal(true);
                                          setotp(res.data.OTP);
                                          setslotId(item._id);
                                        }
                                      }}
                                    >
                                      {new Date(item.startDate).getHours() +
                                        ":" +
                                        new Date(
                                          item.startDate
                                        ).getMinutes()}{" "}
                                      -{" "}
                                      {new Date(item.endDate).getHours() +
                                        ":" +
                                        new Date(item.endDate).getMinutes()}
                                    </span>
                                  );
                                }
                              })}
                          </div>
                        </div>
                      </div>
                      {/* <div className="my-3">

                          <div className='mx-2  my-4'>
                            <label>  <Moment format="D MMM YYYY" withTitle>
                              {new Date()}
                            </Moment></label>
                            <br />
                            <div className='flex my-2 '>

                              {slot && slot.map((item, index) => {

                                if (new Date(item.startDate).getDate() === new Date().getDate()) {
                                  return (
                                    <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer"
                                      onClick={async () => {
                                        let res = await bookSlot({ candidate_id: candidate.candidate_id, slotId: item._id });
                                        console.log(res)
                                        if (res.status === 200) {
                                          setchooseSlot(false);
                                          setotpModal(true);
                                          setotp(res.data.otp)
                                        }
                                      }}

                                    >{new Date(item.startDate).getHours() + ":" + new Date(item.startDate).getMinutes()} - {new Date(item.endDate).getHours() + ":" + new Date(item.endDate).getMinutes()}</span>
                                  )
                                }

                              })}
                            </div>
                          
                          <button
                            className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                            style={{ backgroundColor: "#034488" }} onClick={() => { navigate("/user/allslots") }}>View More</button>


                        </div>
                      </div> */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      {job ? (
        <>
          <div
            className="card my-5 w-full p-5 bg-white "
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <p className="text-center text-3xl font-black py-2 mb-3">
              {job.job[0].jobTitle}
              {"  "} {job.job[0].jobType} {"  "}job
            </p>

            <div className="w-full  bg-white border border-b">
              <div
                className="grid px-9 grid-cols-1 gap-4 md:grid-cols-7 sm:grid-cols-4   py-6"
                style={{ backgroundColor: "#F2F3F5" }}
              >
                <div className="col-span-2 flex align-middle">
                  <div className="">
                    <img
                      src={Microsoft}
                      className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700"
                    />
                  </div>
                  <div className="pt-3">
                    <h5 className="text-black-900 text-lg font-bold mb-1 ">
                      {job.job[0].jobTitle}
                    </h5>
                    <p className="text-sm font-bold  text-gray-400 font-semibold">
                      {job.job[0].hiringOrganization}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <CgWorkAlt />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.job[0].jobType}
                    </p>
                  </div>
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <HiOutlineLocationMarker />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.job[0].location}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <HiOutlineCalendar />
                    </div>

                    <p className="px-2 text-md text-gray-400 font-semibold">
                      {new Date(job.job[0].validTill).getDate() +
                        "-" +
                        (new Date(job.job[0].validTill).getMonth() + 1) +
                        "-" +
                        new Date(job.job[0].validTill).getFullYear()}
                    </p>
                  </div>
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <BsCashStack />
                    </div>

                    {job.job[0].salary && job.job[0].salary.length >= 2 && (
                      <p className="px-4 text-md text-gray-400 font-semibold">
                        {job.job[0].salary[0].symbol} {job.job[0].salary[1]}{" "}
                        {job.job[0].salary.length === 3 && (
                          <span>- {job.job[0].salary[2]}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <Popover className="relative mt-1">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={`
                               ${open ? "" : "text-opacity-90"
                          } focus:outline-0`}
                      >
                        <BsThreeDots className="text-gray-700 text-lg mt-5 cursor-pointer hover:text-gray-800" />
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl">
                          <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="relative gap-8 bg-white p-2 lg:grid-cols-2 flex justify-between">
                              {/* <div className="w-[8vw]  text-gray-800 " onClick={() => {
                                handleJobInvitation(job, false)
                              }}>
                                <p className="text-sm font-semibold py-1  cursor-pointer"
                                >
                                  Decline
                                </p>

                              </div> */}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
            </div>
            <div className="card-body px-7 w-4/5">
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  {" "}
                  Job Description :
                </h5>
                <h6
                  className="px-4 mb-2 text-md text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.job[0].jobDesc)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Eligibility :
                </h5>
                <h6
                  className="px-4 mb-2 text-md text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.job[0].eligibility)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Skills Required :
                </h5>
                {/* {job &&
                  job.skills &&
                  job.skills.map((item) => {
                    return (
                      <span className="bg-blue-100 text-blue-800 text-md my-5 font-semibold mx-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-600">
                        {item.primarySkill}
                      </span>
                    );
                  })} */}
                <div className="px-4">
                  {roles
                    ? roles.map((item, index) => {
                      return (
                        <div>
                          <p className="font-semibold text-md my-3">{item}</p>
                          {skillsPrimary[item].map((el) => (
                            <div>
                              <p className="text-sm my-2">{el}</p>
                              {job.skills && job.skills
                                .filter(
                                  (tool) =>
                                    tool.role === item &&
                                    tool.primarySkill === el
                                )
                                .map((item1, index) => (
                                  <span className="bg-blue-100 text-blue-800 text-xs my-4 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                    {item1.secondarySkill}({item1.proficiency}
                                    )
                                  </span>
                                ))}
                            </div>
                          ))}
                        </div>
                      );
                    })
                    : "No Skills Required"}
                </div>
                <div className=""></div>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-md text-gray-800 font-bold">
                  Remunerations :
                </h5>
                <h6
                  className="px-4 mb-2 text-lg text-gray-500"
                  dangerouslySetInnerHTML={{ __html: job.job[0].perks }}
                ></h6>
                {/* <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}
              </div>

              <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-3">
                <div className="px-5 my-2 text-md col-span-2 space-y-1">
                  <p>
                    Interview with
                    <span className="font-semibold">
                      {" "}
                      {job.XI[0].firstName} {job.XI[0].lastname}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Job : </span>{" "}
                    {job.job[0].jobTitle}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Interview Id :</span>
                    {job.interviewId}
                  </p>
                </div>
                <div className="px-5 my-2 text-md">
                  <p>
                    {" "}
                    {new Date(job.startDate).getDate() +
                      "-" +
                      (new Date(job.startDate).getMonth() + 1) +
                      "-" +
                      new Date(job.startDate).getFullYear()}
                  </p>
                  <p className="text-gray-400 text-sm">Tuesday</p>
                </div>
                <div className="px-5 my-2 text-md">
                  <p>
                    {new Date(job.startDate).getHours() +
                      ":" +
                      new Date(job.startDate).getMinutes()}{" "}
                    -{" "}
                    {new Date(job.endDate).getHours() +
                      ":" +
                      new Date(job.endDate).getMinutes()}
                  </p>
                  <p className="text-red-400 text-xs">
                    <Moment toNow>{new Date(job.startDate)}</Moment>
                  </p>
                </div>
                <div className="flex space-x-3 items-center">
                  <div className="px-5 text-center my-5 text-md">
                    <span className="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                      {job.status}
                    </span>
                  </div>
                  <div className="px-5 text-center my-5 text-md">
                    {/* <Link to={`/XI/updateEvaluationDetails/${job.application._id}`}>
                            <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                              Update
                            </span></Link> */}
                  </div>
                </div>
              </div>
              {job.status === "Interviewed" &&
                (<div> <Rating id={job.interviewId} interviewer={job.XI[0]._id}/>

                  <div className="flex mx-5 my-5">
                    <div className="">
                      <h2 className="font-semibold my-2">Comment</h2>
                      <input type="text" name="" value={job.comment} id="" onChange={(e)=> setComment(e.target.value)} />
                    </div>
                    <div className="my-8">
                      <button
                        className="shadow-lg rounded-md mx-5 px-6 py-3 "
                        style={{ backgroundColor: "#034488", color: "#fff" }}
                        onClick={async()=>{
                          let update = await updateInterviewApplication(job.interviewId, { comment:comment });

                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                )
              }
            </div>

            <div className="text-right">
              <button
                className="shadow-lg rounded-md mx-5 my-4 px-6 py-2"
                style={{ backgroundColor: "#034488", color: "#fff" }}
                onClick={() => {
                  swal({
                    title: "Are you sure?",
                    text: "you want to delete slot!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then(async (willDelete) => {
                    if (willDelete) {
                      let res = await updateSlot(job._id, {
                        userId: null,
                        interviewId: null,
                        status: "Available",
                      });
                      console.log(res);
                      if (res.status === 200) {
                        swal("Slot has been Deleted", {
                          title: "Slot Removed",
                          icon: "success",
                        });
                        window.location.href = "/user/interviews";
                      }
                    }
                  });
                }}
              // onClick={() => applyFilter(values)}
              >
                Cancel Interview
              </button>
              <button
                className="shadow-lg rounded-md mx-5 my-4 px-6 py-2"
                style={{ backgroundColor: "#034488", color: "#fff" }}
                onClick={() => {
                  setchooseSlot(true);
                  // handleJobInvitation(job, true);
                }}
              // onClick={() => applyFilter(values)}
              >
                Reschedule Interview
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center w-full py-5 text-2xl">
          <img src={Loader} alt="loader" className="h-24 mx-auto" />
        </div>
      )}
    </div>
  );
}
export default JobDetails;
