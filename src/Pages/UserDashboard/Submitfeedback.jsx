import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getInterviewApplication, updateEvaluation, getUser, getSkills, updateSkills } from "../../service/api";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

import { HiOutlineLocationMarker } from "react-icons/hi";
import swal from "sweetalert";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Disclosure } from "@headlessui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import backg from "../../assets/images/LoginBg.jpg"
const UpdateInterviewApplication = () => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);
  const [positives, setPositives] = React.useState(null);
  const [lowlights, setLowlights] = React.useState(null);
  const [evaluation, setEvaluation] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [initialRating, setInitialRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);

  const [user, setUser] = React.useState(null);

  const [XIEvaluations, setXIEvaluations] = React.useState([]);
  const [showEvalForm, setShowEvalForm] = React.useState(false);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [editIndex, setEditIndex] = React.useState(null);

  // skills
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [skillSet, setSkillSet] = React.useState([]);
  const [candidate, setCandidate] = React.useState([]);

  React.useEffect(() => {
    let initial = async () => {
      let user = await JSON.parse(localStorage.getItem("user"));
      await setUser(user);
      let res = await getInterviewApplication({ id: id }, user.access_token);
      console.log(res)
      if (res.data.data) {
        console.log(res.data.data);
        let candidate = await getUser({ id: res.data.data.applicant._id }, user.access_token);

        setCandidate(candidate.data.user);

        if (res.data.data.job.questions) {
          let answers = new Array(res.data.data.job.questions.length).fill("");
          setEvaluation(answers);
        }
        if (
          res.data.data.application.evaluations &&
          res.data.data.application.evaluations[user._id]
        ) {
          console.log("2")
          if (res.data.data.application.evaluations[user._id].status) {
            setCurrStatus(
              res.data.data.application.evaluations[user._id].status
            );
            setStatus(res.data.data.application.evaluations[user._id].status);
          }
          if (
            res.data.data.application.evaluations[user._id].candidate_rating
          ) {
            console.log(3)
            setInitialRating(
              res.data.data.application.evaluations[user._id].candidate_rating
            );
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
        setInterview(res.data.data);
      }
      setLoading(false);
    };
    initial();
  }, []);
  useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let p = JSON.parse(await localStorage.getItem("prof"));
      let pr1 = JSON.parse(await localStorage.getItem("RolesProf"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        await res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr = new Array(res.data.length).fill(0);
        if (!pr1) pr1 = new Array(roles.size).fill(0);

        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }

        await setRolesProf(pr1);
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const updateSkill = async () => {
    let skills = [];

    dbSkills.forEach((el, index) => {
      if (prof[index] > 0) {
        el.proficiency = prof[index];
        skills.push(el);
      }
    });

    // let data = {

    //   tools: skills,
    // };
    // let res = await updateSkills(
    //   { user_id: candidate._id, skills: skills },
    //   { access_token: user.access_token }
    // );
    let res = await updateEvaluation({
      updates: { skills: skills },
      user_id: user._id,
      application_id: interview.application._id,
    });
    console.log(res);
    setSkillSet(res.data.evaluations.skills)
    let primarySkills = {};
    let roles = new Set([]);
    res.data.evaluations.skills.forEach((skill) => {
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


    if (res.status !== 200) {
      swal({
        icon: "error",
        title: "Evaluation",
        text: "Something went wrong",
        button: "Continue",
      });
    } else {
      await localStorage.removeItem("prof");
      await localStorage.removeItem("RolesProf");
      swal({
        icon: "success",
        title: "Evaluation",
        text: "Skills Evaluated Succesfully",
        button: "Continue",
      });
    }
  }


  return (
    <div className="bg-slate-100">
      <div className="mx-5 mt-3 p-5">
        <p className="font-bold text-2xl ">Interview Details</p>
        {loading && (
          <p className="text-center font-semibold text-lg">Loading Data...</p>
        )}
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
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {interview.applicant.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {interview.applicant.email}
                      </p>
                    )}
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
                          {interview.job.salary[1] - interview.job.salary[2]}  {interview.job.salary[0].code}
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
                    Rate Your Interview Experience:
                  </p>
                  <div className="flex items-center ml-4 space-x-1">
                    {rating > 0 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"
                        onClick={() => {
                          setRating(1);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"
                        onClick={() => {
                          setRating(1);
                        }}
                      />
                    )}
                    {rating > 1 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"
                        onClick={() => {
                          setRating(2);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"
                        onClick={() => {
                          setRating(2);
                        }}
                      />
                    )}
                    {rating > 2 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"
                        onClick={() => {
                          setRating(3);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"
                        onClick={() => {
                          setRating(3);
                        }}
                      />
                    )}
                    {rating > 3 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"
                        onClick={() => {
                          setRating(4);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"
                        onClick={() => {
                          setRating(4);
                        }}
                      />
                    )}
                    {rating > 4 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"
                        onClick={() => {
                          setRating(5);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"
                        onClick={() => {
                          setRating(5);
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center ml-auto">
                    {rating !== initialRating && (
                      <button
                        className="px-4 py-1 rounded-sm text-white ml-auto mx-3"
                        style={{ backgroundColor: "#034488" }}
                        onClick={async () => {
                          let user = JSON.parse(
                            await localStorage.getItem("user")
                          );
                          let res = await updateEvaluation({
                            updates: { candidate_rating: rating },
                            user_id: user._id,
                            application_id: interview.application._id,
                          });
                          console.log(res);
                          if (res && res.status === 200) {
                            swal(
                              "Success",
                              "Candidate Rating Updated",
                              "success"
                            );
                          } else {
                            swal(
                              "Error",
                              "Candidate Rating Not Updated",
                              "error"
                            );
                          }
                        }}
                      >
                        Update
                      </button>
                    )}
                    {rating > 0 && (
                      <div className="flex">
                        <button
                          className="px-4 py-1 rounded-sm border-2 border-black"
                          onClick={() => {
                            setRating(0);
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {interview && (
              <div className="my-5">
                <div>

                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Feedback</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      <p className="font-semibold">Add Feedback</p>
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                        }}
                      />
                      {feedback !== "" && feedback !== null && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md ml-auto my-3"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async () => {
                            let res = await updateEvaluation({
                              updates: { feedback: feedback },
                              user_id: user._id,
                              application_id: interview.application._id,
                            });
                            if (res && res.status === 200) {
                              swal("Success", "Feedback Updated", "success");
                            }
                            else {
                              swal("Error", "Something went wrong", "error");
                            }
                          }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <a className="px-4 py-1 bg-blue-500 text-white rounded-md my-3" href="/user" style={{ backgroundColor: "#034488" }}>Submit Feedback</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateInterviewApplication;
