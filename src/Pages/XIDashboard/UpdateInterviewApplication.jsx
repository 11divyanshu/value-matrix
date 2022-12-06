import React,{useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { getInterviewApplication, updateEvaluation ,getUser ,getSkills,updateSkills} from "../../service/api";
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
        if(res.data.data.application.evaluations){

          setSkillSet(res.data.data.application.evaluations[user._id].skills)
        }else{
          setSkillSet([])
        }

        let primarySkills = {};
    let roles = new Set([]);
    let tempArray =[];

  if(res.data.data.application.evaluations){
      res.data.data.application.evaluations[user._id].skills.forEach((skill) => {
      roles.add(skill.role);
      if (primarySkills[skill.role]) {
        primarySkills[skill.role].add(skill.primarySkill);
      } else {
        primarySkills[skill.role] = new Set([skill.primarySkill]);
      }
    }) 
  }else{
      primarySkills = {}
    } 
     console.log(primarySkills)
    if(Array.from(roles)){
      
      setCRoles(Array.from(roles));
    }else{
      setCRoles({})
    }
    console.log(rolesC)

    console.log(Array.from(roles))
    Array.from(roles).length > 0 && Array.from(roles).map((el) => {
      console.log(el)
      primarySkills[el] = Array.from(primarySkills[el]);
    });
    if(primarySkills)
    setSkillsPrimary(primarySkills);
    else{
      
      setSkillsPrimary([]);
    }
  // }
  // console.log("1");

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

  const updateSkill = async ()=>{
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
    }else{
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
            {/* <div className="my-5">
              <div className="w-full border border-b bg-white px-9 py-3 space-y-2 flex items-center flex-wrap">
                <div className="w-3/4 flex items-center flex-wrap space-y-2">
                  <p className="font-semibold text-lg my-3">
                    Candiate Rating :
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
            </div> */}
            {interview && (
              <div className="my-5">
                <div>
                  <p className="font-semibold text-lg my-3">Status</p>
                  <div className="w-full  bg-white border border-b px-9 py-6 space-y-2">
                    <div className="flex items-center w-3/4">
                      <p className="font-semibold">Update Status : </p>
                      <select
                        className="border border-gray-400 rounded-md px-4 py-1 ml-2 "
                        onChange={(e) => setStatus(e.target.value)}
                        name="status"
                        id="status"
                      >
                        <option value="Pending" selected={status === "Pending"}>
                          Pending
                        </option>
                        <option
                          value="Accepted"
                          selected={status === "Accepted"}
                        >
                          Accepted
                        </option>
                        <option
                          value="Rejected"
                          selected={status === "Rejected"}
                        >
                          Rejected
                        </option>
                      </select>
                      {status !== currStatus && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md ml-auto"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async () => {
                            let user = JSON.parse(
                              await localStorage.getItem("user")
                            );
                            let res = await updateEvaluation({
                              updates: { status: status },
                              user_id: user._id,
                              application_id: interview.application._id,
                            });
                            let int = interview;
                            int.application.status = status;
                            setInterview(int);
                            if (res && res.status === 200) {
                              swal("Success", "Status Updated", "success");
                            } else {
                              swal("Error", "Status Not Updated", "error");
                            }
                          }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                    <p>
                      {" "}
                      <span className="font-semibold">
                        Current Status :
                      </span>{" "}
                      {currStatus ? currStatus : null}
                    </p>
                  </div>
                  <div className="w-full bg-white p-2 mt-8">
              <p className="font-semibold text-lg my-3 px-4">Skills</p>
                {showRoles ? (
                  <>
                  {showRoles.length > 0 && showRoles.map((el, index) => {
                    return (
                      <div key={index}>
                        <Disclosure>
                          {({ open }) => (
                            <div className={`${open ? "shadow-md" : ""}`}>
                              <Disclosure.Button
                                className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg " : ""
                                  }`}
                              >
                                <span>{el}</span>
                                <div className="ml-auto mr-5 flex items-center space-x-2">
                                  <p>0</p>
                                  <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={rolesProf[index]}
                                    onChange={(e) => {
                                      console.log(dbSkills);
                                      dbSkills.forEach((skill) => {
                                        if (skill.role === el) {
                                          skill.proficiency = e.target.value;
                                          let inde = dbSkills.findIndex(
                                            (el) => {
                                              return el === skill;
                                            }
                                          );
                                          let p = prof;
                                          p[inde] = e.target.value;
                                          setProf(p);
                                          skill.rating = e.target.value;
                                        }
                                      });
                                      console.log(dbSkills);
                                      let rp = rolesProf;
                                      rp[index] = e.target.value;
                                      setRolesProf(rp);
                                      localStorage.setItem(
                                        "RolesProf",
                                        JSON.stringify(rolesProf)
                                      );
                                    }}
                                  />
                                  <p>5</p>
                                </div>
                                <ChevronUpIcon
                                  className={`${!open ? "rotate-180 transform" : ""
                                    } h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="p-3 px-4">
                                {primarySkills[el] && primarySkills[el].map((skill, index) => {
                                  return (
                                    <div>
                                      <Disclosure>
                                        {({ open }) => (
                                          <div
                                            className={`${open ? "shadow-md" : ""
                                              }`}
                                          >
                                            <Disclosure.Button
                                              className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg" : ""
                                                } `}
                                            >
                                              <span>{skill}</span>
                                              <ChevronUpIcon
                                                className={`${!open
                                                    ? "rotate-180 transform"
                                                    : ""
                                                  } h-5 w-5 text-blue-500`}
                                              />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="p-3 px-12">
                                              {dbSkills
                                                .filter((secSkill) => {
                                                  return (
                                                    secSkill.primarySkill ===
                                                    skill &&
                                                    secSkill.role === el
                                                  );
                                                })
                                                .map((secSkill, index) => {
                                                  let d = dbSkills;
                                                  let index1 = d.findIndex(
                                                    (el) => {
                                                      return el === secSkill;
                                                    }
                                                  );
                                                  return (
                                                    <div className="flex my-2 text-sm justify-between items-center px-3 py-1">
                                                      <p>
                                                        {
                                                          secSkill.secondarySkill
                                                        }
                                                      </p>

                                                      <div className="flex items-center space-x-2">
                                                        <p>0</p>
                                                        <input
                                                          type="range"
                                                          min="0"
                                                          max="5"
                                                          value={prof[index1]}
                                                          onChange={async (
                                                            e
                                                          ) => {
                                                            let d = dbSkills;
                                                            d[index1] = {
                                                              ...d[index1],
                                                              proficiency:
                                                                e.target.value,
                                                            };
                                                            let p = prof;
                                                            prof[index1] =
                                                              e.target.value;
                                                            await localStorage.setItem(
                                                              "prof",
                                                              JSON.stringify(p)
                                                            );
                                                            await setProf([
                                                              ...p,
                                                            ]);
                                                            await setDbSkills([
                                                              ...d,
                                                            ]);
                                                            if (
                                                              e.target.value > 0
                                                            ) {
                                                              let u = user;
                                                              let to = u.tools;
                                                              to.push({
                                                                proficiency:
                                                                  e.target
                                                                    .value,
                                                                ...secSkill,
                                                              });
                                                              u.tools = to;
                                                              await setUser({
                                                                ...u,
                                                              });
                                                            }
                                                          }}
                                                        />
                                                        <p>5</p>
                                                        <p className="text-xs font-italics">
                                                          {prof[index1] > 0
                                                            ? "Self-assetsted"
                                                            : "Unassested"}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                            </Disclosure.Panel>
                                          </div>
                                        )}
                                      </Disclosure>
                                    </div>
                                  );
                                })}
                              </Disclosure.Panel>
                            </div>
                          )}
                        </Disclosure>
                      </div>
                    );

                   
                  })}
                  
                  <button
                  className=" hover:bg-blue-700 text-white font-bold py-2 px-8 md:mx-4 sm:mx-0 text-xs rounded"
                  style={{backgroundColor:"#034488"}}
                  onClick={()=>updateSkill()}
                >
                  Update Skills
            </button> 


            <div className="p-5">
              {rolesC.length > 0
                ? rolesC.map((item, index) => {
                  return (
                    <div className="py-2">
                      <p className="font-semibold text-md md:w-1/2  md:flex w-full  space-y-2 my-5">
                        {item}
                      </p>
                      {skillsPrimary[item] && skillsPrimary[item].map((el) => (
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






            </>)
            
            :null
                  
                  }
              </div>
                  {/* <div className="my-5">
                    <p className="font-semibold text-lg my-3">
                      Evaluation Details
                    </p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      {interview.job &&
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
                                  onChange={(e) => {
                                    let temp = [...evaluation];
                                    temp[index] = e.target.value;
                                    setEvaluation(temp);
                                  }}
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
                        })}
                        {
                          interview && interview.application && interview.application.evaluations && interview.application.evaluations[user._id] && interview.application.evaluations[user._id].questions && 
                          interview.application.evaluations[user._id].questions.map((question,index) => {
                            return (
                              <div className="my-5">
                                <p className="font-semibold text-md">
                                  Question {index + 1} :{" "}
                                  <span className="font-normal">
                                    {question.question}
                                  </span>
                                </p>
                                  <textarea
                                    className="px-4 py-1 my-3 w-3/4"
                                    style={{ borderRadius: "5px" }}
                                    onChange={(e) => {
                                      let temp = [...evaluation];
                                      temp[index] = e.target.value;
                                      setEvaluation(temp);
                                    }}
                                  >
                                    {question.answer}
                                  </textarea>
                              </div>
                            );
                          }
                        )}
                      {XIEvaluations &&
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
                        })}
                      {showEvalForm && (
                        <div>
                          <Formik
                            initialValues={initialQuestion}
                            validate={(values) => {
                              const errors = {};
                              if (!values.question) {
                                errors.question = "Required !";
                              }
                              if (!values.answer) {
                                errors.answer = "Required !";
                              }
                              return errors;
                            }}
                            onSubmit={async (values) => {
                              setShowEvalForm(false);
                              if (editIndex) {
                                let temp = [...XIEvaluations];
                                temp[editIndex] = {
                                  question: values.question,
                                  answer: values.answer,
                                };
                                await setXIEvaluations(temp);
                                setEditIndex(null);
                              } else {
                                setXIEvaluations([
                                  ...XIEvaluations,
                                  {
                                    question: values.question,
                                    answer: values.answer,
                                  },
                                ]);
                              }
                              setInitialQuestion({
                                question: "",
                                answer: "",
                              });
                            }}
                          >
                            {(values) => {
                              return (
                                <Form>
                                  <p className="font-semibold">
                                    Add Evaluation Response
                                  </p>
                                  <div className="my-3">
                                    <label className="font-semibold block">
                                      Question
                                    </label>
                                    <Field
                                      name="question"
                                      className="w-3/4 px-4 py-1"
                                      style={{ borderRadius: "5px" }}
                                      type="text"
                                    />
                                    <ErrorMessage
                                      name="question"
                                      component="div"
                                      className="text-red-600 text-sm"
                                    />
                                  </div>
                                  <div className="my-3 ">
                                    <label className="font-semibold block">
                                      Answer
                                    </label>
                                    <Field
                                      name="answer"
                                      className="w-3/4 px-4 py-1 border-1 border-black"
                                      row="2"
                                      style={{
                                        borderRadius: "5px",
                                        border: "solid #6b7280 1px",
                                      }}
                                      as="textarea"
                                    />
                                    <ErrorMessage
                                      name="answer"
                                      component="div"
                                      className="text-red-600 text-sm"
                                    />
                                  </div>
                                  <div className="flex space-x-3">
                                    <button
                                      className="px-4 py-1 text-white rounded-md"
                                      style={{ backgroundColor: "#034488" }}
                                    >
                                      {editIndex === null ? "Add" : "Update"}
                                    </button>
                                    <button
                                      className="px-4 py-1 border-2 border-black rounded-md"
                                      onClick={async () => {
                                        await setShowEvalForm(false);
                                        setInitialQuestion({
                                          question: "",
                                          answer: "",
                                        });
                                        await setEditIndex(null);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </Form>
                              );
                            }}
                          </Formik>
                        </div>
                      )}
                      {!showEvalForm && (
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
                      )}
                      {interview.application.evaluation !== evaluation && (
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
                      )}
                    </div>
                  </div> */}
                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Positives</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      <p className="font-semibold">Add Positives</p>
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => {
                          setPositives(e.target.value);
                        }}
                      />
                      {positives !== "" && positives !== null && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md ml-auto my-3"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async()=>{
                            let res = await updateEvaluation({
                              updates: {positives: positives},
                              user_id: user._id,
                              application_id: interview.application._id,
                            });
                            if(res && res.status===200){
                              swal("Success", "Positives Updated", "success");
                            }
                            else{
                              swal("Error", "Something went wrong", "error");
                            }
                          }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Lowlights</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      <p className="font-semibold">Add Lowlights</p>
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => {
                          setLowlights(e.target.value);
                        }}
                      />
                      {lowlights !== "" && lowlights !== null && (
                        <button
                          className="px-4 py-1 bg-blue-500 text-white rounded-md ml-auto my-3"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async()=>{
                            let res = await updateEvaluation({
                              updates: {lowlights: lowlights},
                              user_id: user._id,
                              application_id: interview.application._id,
                            });
                            if(res && res.status===200){
                              swal("Success", "Lowlights Updated", "success");
                            }
                            else{
                              swal("Error", "Something went wrong", "error");
                            }
                          }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
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
                      )}
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

export default UpdateInterviewApplication;
