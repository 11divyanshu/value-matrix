import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInterviewApplication, updateEvaluation, getUser, getSkills, updateSkills } from "../../service/api";
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
import { Disclosure } from "@headlessui/react";
import Logo from "../../assets/images/logo.png"
import UserAvatar from "../../assets/images/loginBackground.jpeg"
import Printable from "../CompanyDashboard/PrintAble"



const UpdateInterviewApplication = React.forwardRef(({ ...props }, ref) => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);
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
  const [print, setprint] = React.useState(false);
  // const [screen, setscreen] = React.useState(true);

  //skills
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [skillSet, setSkillSet] = React.useState([]);

  const inputSkillRef = React.useRef(null);

  const componentRef = useRef();
  const openPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Evaluation Report"
  })
  React.useEffect(() => {
    let initial = async () => {
      let user = await JSON.parse(localStorage.getItem("user"));
      await setUser(user);
      let res = await getInterviewApplication({ id: id }, user.access_token);
      console.log(res.data.data);


      if (res.data.data) {

        setSkillSet(res.data.data.application.evaluations[user._id].skills)

        let primarySkills = {};
        let roles = new Set([]);
        res.data.data.application.evaluations[user._id].skills.forEach((skill) => {
          roles.add(skill.role);
          if (primarySkills[skill.role]) {
            primarySkills[skill.role].add(skill.primarySkill);
          } else {
            primarySkills[skill.role] = new Set([skill.primarySkill]);
          }
        });
        setCRoles(Array.from(roles));
        console.log(Array.from(roles))
        Array.from(roles).map((el) => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);


        if (res.data.data.job.questions) {
          let answers = new Array(res.data.data.job.questions.length).fill("");
          setEvaluation(answers);
        }
        if (
          res.data.data.application.evaluations &&
          res.data.data.application.evaluations[user._id]
        ) {




          if (res.data.data.application.evaluations[user._id].status) {

            setStatus(res.data.data.application.evaluations[user._id].status);
          }
          if (res.data.data.application.evaluations[user._id].feedback) {

            setFeedback(res.data.data.application.evaluations[user._id].feedback);
          }

          if (
            res.data.data.application.evaluations[user._id].candidate_rating
          ) {


            setRating(
              res.data.data.application.evaluations[user._id].candidate_rating
            );
          }
        } else if (res.data.data.application) {
          if (res.data.data.application.status) {
            setCurrStatus(res.data.data.application.status);
            setStatus(res.data.data.application.status);
          }
        } else {
          setInitialRating(0);
          setRating(0);
          setCurrStatus("Pending");
          setStatus("Pending");
        }
        setu_id(user._id)
        setInterview(res.data.data);
      }
      setLoading(false);
    };
    initial();
  }, []);





  return (
    <div className="bg-slate-100" >
      <div className="mx-5 mt-3 p-5">
        <div className="flex justify-between">
          <p className="font-bold text-2xl ">Interview Details</p>
          {loading && (
            <p className="text-center font-semibold text-lg">Loading Data...</p>
          )}

          <button
            className=" hover:bg-blue-700 text-white font-bold py-2 px-8 md:mx-6 sm:mx-0 text-xl rounded"
            style={{ backgroundColor: "#034488" }}
            onClick={() => {
              setprint(true);
              openPdf()
            }}
          >
            <AiOutlinePrinter />
          </button>
        </div>
        { <div className="hidden" >
          <div ref={componentRef}>
          <Printable />
          </div>
        </div>}
      
        {!loading && (
          <div>
            {interview && (
              <p className="my-2 text-sm">
                <span className="font-semibold">Interview Id : </span>{" "}
                {interview.application._id}
              </p>
            )}
            {interview && interview.applicant && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {interview.applicant.firstName}{" "}
                    {interview.applicant.lastname}
                    {/* Aryaman Swami */}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {/* {interview.applicant.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {interview.applicant.email}
                      </p>
                    )} */}
                    {interview.applicant.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {interview.applicant.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {interview && interview.job && (
              <div className="my-5">
                <div className="flex justify-between">
                  <p className="my-3 font-semibold text-lg">Job Details</p>
                  <Link
                    to={`/XI/jobDetails/${interview.job._id}`}
                    target="_blank"
                  >
                    View Job Details
                  </Link>
                </div>
                <div className="w-full  bg-white border border-b">
                  <div className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-7 py-6 relative">
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
                          {interview.job.jobTitle}
                        </h5>
                        <p className="text-sm font-bold  text-gray-400 font-semibold">
                          {interview.job.hiringOrganization}
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
                          {interview.job.jobType}
                        </p>
                      </div>
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <HiOutlineLocationMarker />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.location}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <BsCashStack />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.salary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="my-5">
              <div className="w-full border border-b bg-white px-9 py-3 space-y-2 flex items-center flex-wrap">
                <div className="w-3/4 flex items-center flex-wrap space-y-2">
                  <p className="font-semibold text-lg my-3">
                    Candiate Rating :
                  </p>
                  <div className="flex items-center ml-4 space-x-1">
                    {rating > 0 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {rating > 1 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {rating > 2 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {rating > 3 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {rating > 4 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                  </div>

                </div>
              </div>
            </div>
            {interview && (
              <div className="my-5">
                <div>
                  <p className="font-semibold text-lg my-3">Status</p>
                  <div className="w-full  bg-white border border-b px-9 py-6 space-y-2">

                    <p>
                      {" "}
                      <span className="font-semibold">
                        Current Status :
                      </span>{" "}
                      {status}
                    </p>
                  </div>

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
                    <p className="font-semibold text-lg my-3">
                      Evaluation Details
                    </p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      {/* {interview.job &&
                        interview.job.questions &&
                        interview.job.questions.map((question, index) => {
                          return (
                            <div className="my-5">
                              <p className="font-semibold text-md">
                                Question {index + 1} :{" "}
                                <span className="font-normal">
                                  {question.question}
                                </span>
                              </p>
                              {question.answer && (
                                <p className="font-semibold text-gray-600 text-md my-1">
                                  Ideal Answer :{" "}
                                  <span className="font-normal">
                                    {question.answer}
                                  </span>
                                </p>
                              )}
                              <div>
                                <textarea
                                  className="px-4 py-1 my-3 w-3/4"
                                  style={{ borderRadius: "5px" }}
                                  disabled
                                  
                                >
                                  {interview &&
                                  user &&
                                  interview.application &&
                                  interview.application.evaluations &&
                                  interview.application.evaluations[user._id] &&
                                  interview.application.evaluations[user._id]
                                    .questions &&
                                  interview.application.evaluations[user._id]
                                    .questions.length > index
                                    ? interview.application.evaluations[
                                        user._id
                                      ].questions[index].answer
                                    : ""}
                                </textarea>
                              </div>
                            </div>
                          );
                        })} */}
                      {
                        interview && interview.application && interview.application.evaluations && interview.application.evaluations[user._id] && interview.application.evaluations[user._id].questions &&
                        interview.application.evaluations[user._id].questions.map((question, index) => {
                          return (
                            <div className="my-5">
                              <p className="font-semibold text-md">
                                Question {index + 1} :{" "}
                                <span className="font-normal">
                                  {question.question}
                                </span>
                              </p>
                              <p className="font-semibold text-gray-600 text-md my-1">
                                Ideal Answer :{" "}
                                <span className="font-normal">
                                  {question.idealAnswer}
                                </span>
                              </p>
                              <textarea
                                className="px-4 py-1 my-3 w-3/4"
                                style={{ borderRadius: "5px" }}
                                disabled
                              >
                                {question.answer}
                              </textarea>
                            </div>
                          );
                        }
                        )}
                      {/* {XIEvaluations &&
                        XIEvaluations.map((question, index) => {
                          let i = index;
                          if (interview.job && interview.job.questions)
                            i = index + interview.job.questions.length;
                          if(interview && interview.application && interview.application.evaluations && interview.application.evaluations[user._id] && interview.application.evaluations[user._id].questions )
                            i = i + interview.application.evaluations[user._id].questions.length;
                          return (
                            <div className="my-5">
                              <div className="flex">
                                <p className="font-semibold text-md">
                                  Question {i + 1} :{" "}
                                  <span className="font-normal">
                                    {question.question}
                                  </span>
                                </p>
                                <RiEditBoxLine
                                  className="text-blue-500 text-lg ml-auto mr-3 cursor-pointer"
                                  onClick={async () => {
                                    await setShowEvalForm(false);
                                    await setInitialQuestion(question);
                                    await setEditIndex(index);
                                    await setShowEvalForm(true);
                                  }}
                                />
                                <AiOutlineDelete
                                  className="text-red-500 text-xl cursor-pointer"
                                  onClick={async () => {
                                    setXIEvaluations(
                                      XIEvaluations.filter(
                                        (questionI) => questionI !== question
                                      )
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <textarea
                                  className="px-4 py-1 my-3 w-3/4"
                                  style={{ borderRadius: "5px" }}
                                  onChange={(e) => {
                                    let temp = [...XIEvaluations];
                                    temp[index].answer = e.target.value;
                                    setEvaluation(temp);
                                  }}
                                >
                                  {XIEvaluations[index].answer}
                                </textarea>
                              </div>
                            </div>
                          );
                        })} */}


                      {/* {!showEvalForm && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md block my-3"
                          style={{ backgroundColor: "#034488" }}
                          onClick={() => {
                            setInitialQuestion({
                              question: "",
                              answer: "",
                            });
                            setShowEvalForm(true);
                          }}
                        >
                          Add Response
                        </button>
                      )} */}
                      {/* {interview.application.evaluation !== evaluation && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async () => {
                            let questions = [];
                            for (
                              let i = 0;
                              i < interview.job.questions.length;
                              i++
                            ) {
                              questions.push({
                                question: interview.job.questions[i].question,
                                idealAnswer: interview.job.questions[i].answer,
                                answer: evaluation[i],
                              });
                            }
                            questions = [...questions, ...XIEvaluations];
                            let res = await updateEvaluation({
                              updates: {questions: questions},
                              user_id: user._id,
                              application_id: interview.application._id,
                            });
                            if(res && res.status===200){
                              swal("Success", "Evaluation Updated", "success");
                            }
                            else{
                              swal("Error", "Something went wrong", "error");
                            }
                          }}
                        >
                          Update
                        </button>
                      )} */}
                    </div>
                  </div>
                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Feedback</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      {/* <p className="font-semibold">Add Feedback</p> */}
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        value={feedback}
                      // onChange={(e) => {
                      //   setFeedback(e.target.value);
                      // }}
                      />
                      {/* {feedback !== "" && feedback !== null && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md ml-auto my-3"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async()=>{
                            let res = await updateEvaluation({
                              updates: {feedback: feedback},
                              user_id: user._id,
                              application_id: interview.application._id,
                            });
                            if(res && res.status===200){
                              swal("Success", "Feedback Updated", "success");
                            }
                            else{
                              swal("Error", "Something went wrong", "error");
                            }
                          }}
                        >
                          Update
                        </button>
                      )} */}
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
});

export default UpdateInterviewApplication;
