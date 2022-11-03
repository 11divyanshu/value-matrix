import React, { useRef, useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInterviewApplication,
  updateEvaluation,
  getUser,
  getSkills,
  updateSkills,
  saveCandidateReport,
} from "../../service/api";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { HiOutlineLocationMarker } from "react-icons/hi";
import swal from "sweetalert";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ImCross } from "react-icons/im";
import PrintAble from "../CompanyDashboard/PrintAble";

const CandidateReport = () => {
  const { id } = useParams();
  console.log(id);
  const [candidate, setCandidate] = React.useState({});
  const [u_id, setu_id] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);
  const [evaluation, setEvaluation] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [initialRating, setInitialRating] = React.useState(0);
  // const [hoverRating, setHoverRating] = React.useState(0);

  const [user, setUser] = React.useState(null);

  //skills
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [skillSet, setSkillSet] = React.useState([]);
  const [modal, setModal] = React.useState(null);
  const [showEvalForm, setShowEvalForm] = React.useState(false);
  const [loader, setLoader] = useState(false);

  const inputSkillRef = React.useRef(null);

  const componentRef = useRef();
  const openPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Evaluation Report",
  });
  React.useEffect(() => {
    let initial = async () => {
      let user = await JSON.parse(localStorage.getItem("user"));
      await setUser(user);

      let res = await saveCandidateReport(id);
      console.log(res.data[0]);
      setCandidate(res.data[0]);
      // if (res) {
      //     setListEligibleJobs(res.data.jobs);

      //  console.log(res.data.jobs)
      // }

      //   if (res.data.data) {

      setSkillSet(res.data[0].user[0].tools);

      let primarySkills = {};
      let roles = new Set([]);
      res.data[0].user[0].tools.forEach((skill) => {
        roles.add(skill.role);
        if (primarySkills[skill.role]) {
          primarySkills[skill.role].add(skill.primarySkill);
        } else {
          primarySkills[skill.role] = new Set([skill.primarySkill]);
        }
      });
      setCRoles(Array.from(roles));
      console.log(Array.from(roles));
      Array.from(roles).map((el) => {
        primarySkills[el] = Array.from(primarySkills[el]);
      });
      setSkillsPrimary(primarySkills);

      //     if (res.data.data.job.questions) {
      //       let answers = new Array(res.data.data.job.questions.length).fill("");
      //       setEvaluation(answers);
      //     }
      //     if (
      //       res.data.data.application.evaluations &&
      //       res.data.data.application.evaluations[user._id]
      //     ) {

      //       if (res.data.data.application.evaluations[user._id].status) {

      //         setStatus(res.data.data.application.evaluations[user._id].status);
      //       }
      //       if (res.data.data.application.evaluations[user._id].feedback) {

      //         setFeedback(res.data.data.application.evaluations[user._id].feedback);
      //       }

      //       if (
      //         res.data.data.application.evaluations[user._id].candidate_rating
      //       ) {

      //         setRating(
      //           res.data.data.application.evaluations[user._id].candidate_rating
      //         );
      //       }
      //     } else if (res.data.data.application) {
      //       if (res.data.data.application.status) {
      //         setCurrStatus(res.data.data.application.status);
      //         setStatus(res.data.data.application.status);
      //       }
      //     } else {
      //       setInitialRating(0);
      //       setRating(0);
      //       setCurrStatus("Pending");
      //       setStatus("Pending");
      //     }
      //     setu_id(user._id)
      //     setInterview(res.data.data);
      //   }
      setLoading(false);
    };
    initial();
  }, []);

  return (
    <div className="bg-slate-100" ref={componentRef}>
      <div className="mx-5 mt-3 p-5">
        <div className="flex justify-between">
          <p className="font-bold text-2xl ">Candidate Details</p>
          {loading && (
            <p className="text-center font-semibold text-lg">Loading Data...</p>
          )}

          <div className="mx-1">
            {/* <button
            className="p-1 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
            style={{ backgroundColor: "#034488" }}
            onClick={openPdf}
          >
            <AiOutlinePrinter />
          </button> */}
            <button
              className=" mx-3 p-1 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
              style={{ backgroundColor: "#034488" }}
              onClick={() => {
                setModal(true);
                setShowEvalForm(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="w-full">
          {loader ? (
            <p>...Loading</p>
          ) : (
            <>
              {modal && (
                <Transition
                  appear
                  show={modal}
                  as={Fragment}
                  className="relative z-1050 w-full"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-1050 w-5/6"
                    onClose={() => {}}
                    static={true}
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
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
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-screen-2xl mx-auto">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                            <div className={`${!modal ? "hidden" : "block"}`}>
                              <div className="w-full">
                                <button
                                  className="bg-[#034488] text-white rounded-sm py-1 mt-5"
                                  onClick={() => setModal(false)}
                                  style={{
                                    backgroundColor: "#fff",
                                    color: "#034488",
                                  }}
                                >
                                  <ImCross />
                                </button>
                                <PrintAble />
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
            </>
          )}
        </div>
        {!loading && (
          <div>
            {candidate && (
              <p className="my-2 text-sm">
                <span className="font-semibold">Candidate Id : </span>{" "}
                {candidate.candidate_id}
              </p>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full border-b bg-white px-9 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName} {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.phoneNo && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.phoneNo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {candidate && (
              <div className="my-5">
                <div>
                  {/* <p className="font-semibold text-lg my-3">Status</p>
                  <div className="w-full  bg-white border border-b px-9 py-6 space-y-2">
                   
                    <p>
                      {" "}
                      <span className="font-semibold">
                        Current Status :
                      </span>{" "}
                      {status}
                    </p>
                  </div> */}

                  <div>
                    <p className="font-semibold text-lg my-3">Skills</p>
                    <div className="md:w-1/2 bg-white flex w-full  space-y-1 my-5">
                      <div className="p-5">
                        {rolesC
                          ? rolesC.map((item, index) => {
                              return (
                                <div className="py-2">
                                  <p className="font-semibold text-md md:w-1/2  md:flex w-full  space-y-2 my-5">
                                    {item}
                                  </p>
                                  {skillsPrimary[item].map((el) => (
                                    <div className="py-1">
                                      <p className="text-sm my-2">{el}</p>
                                      <div className="md:flex flex-wrap">
                                        {skillSet
                                          .filter(
                                            (tool) =>
                                              tool.role === item &&
                                              tool.primarySkill === el
                                          )
                                          .map((item1, index) => (
                                            <p className="bg-blue-100 text-blue-800 text-xs mb-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800 ">
                                              {item1.secondarySkill}{" "}
                                              {item1.proficiency &&
                                                `(${item1.proficiency})`}
                                            </p>
                                          ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })
                          : "No Skills"}
                      </div>
                    </div>
                  </div>
                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Job Details</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      {candidate &&
                        candidate.jobs &&
                        candidate.jobs.map((job) => {
                          return (
                            <div className="my-5">
                              <div className="w-full  bg-white border border-b">
                                <div className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-5 py-6 relative">
                                  <div className="col-span-2 flex align-middle">
                                    <div className="">
                                      <img
                                        src={Microsoft}
                                        className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700"
                                        alt="Company_Logo"
                                      />
                                    </div>
                                    <div className="pt-3">
                                      <h5 className="text-black-900 text-lg font-bold mb-1 ">
                                        {job.jobTitle}
                                      </h5>
                                      <p className="text-sm font-bold  text-gray-400 font-semibold">
                                        {job.hiringOrganization}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-span-1">
                                    {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold" Type</p> */}
                                    <div className="flex py-4">
                                      <div className="text-lg py-1 text-gray-400 font-semibold ">
                                        <CgWorkAlt />
                                      </div>

                                      <p className="px-4 text-md text-gray-400 font-semibold">
                                        {job.jobType}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-span-1">
                                    <div className="flex py-4">
                                      <div className="text-lg py-1 text-gray-400 font-semibold ">
                                        <HiOutlineLocationMarker />
                                      </div>

                                      <p className="px-4 text-md text-gray-400 font-semibold">
                                        {job.location}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-span-1">
                                    <div className="flex py-4">
                                      <div className="text-lg py-1 text-gray-400 font-semibold ">
                                        <BsCashStack />
                                      </div>

                                      <p className="px-4 text-md text-gray-400 font-semibold">
                                        {job.salary}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateReport;
