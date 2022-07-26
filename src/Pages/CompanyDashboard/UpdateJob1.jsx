import React, { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { postJobAPI } from "../../service/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../../assets/stylesheet/VerticalTabs.scss";
import swal from "sweetalert";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
import { Link, useNavigate } from "react-router-dom";
import { getJobById, updateJobAPI, getSkills } from "../../service/api";
import * as xlsx from "xlsx/xlsx.mjs";
import DOMPurify from "dompurify";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import currencies from "currencies.json";
import { Combobox } from "@headlessui/react";
import cities from "cities.json";

// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// );
import htmlToDraft from "html-to-draftjs";
// const htmlToDraft = typeof window === 'object' && require('html-to-draftjs').default;

const UpdateJob = () => {
  // Page Index
  const [PageIndex, setPageIndex] = React.useState(1);
  const PageDetails = [
    "Job Details",
    "Eligibilty",
    "Job Invitations",
    "Screening Questions",
    "Remunerations And Pay Range",
  ];

  const { id } = useParams();

  // Skills To Be Displayed
  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const inputSkillRef = React.useRef(null);

  // Screeing Questions
  const [questions, setQuestions] = React.useState([]);
  const [questionError, setQuestionError] = React.useState(null);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);

  // Candidate Invitations Xl Sheet Input
  const candidateInputRef = React.useState(null);
  // Candidate Data
  const [candidateData, setCandidateData] = React.useState([]);
  const [rejectedData, setRejectedData] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);

  const [showRejected, setShowRejected] = React.useState(false);
  const [showCandidate, setShowCandidate] = React.useState(false);

  const [currency, setCurrency] = React.useState(currencies.currencies[0]);

  const [candidateInitial, setCandidateInitial] = React.useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Contact: "",
    Address: "",
  });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);

  // City Autocomplete
  const [selectedCity, setSelectedCity] = React.useState();
  const [query, setQuery] = React.useState("");
  const filteredCity =
    query === ""
      ? cities.slice(0, 10)
      : cities
          .filter((city) => {
            return (
              city.country.toLowerCase().includes(query.toLowerCase()) ||
              city.name.toLowerCase().includes(query.toLowerCase())
            );
          })
          .slice(0, 10);

  const [Alert, setAlert] = React.useState(null);
  const [skills, setSkills] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);
  const [job_id, setJobId] = React.useState();

  //Description
  const [desc, setDescState] = React.useState();
  const [descEdit, setDescEditState] = React.useState();
  const [convertedDesc, setConvertedDesc] = useState(null);

  //eligibility
  const [eligible, setEligibleState] = React.useState();
  const [elEdit, setElEditState] = React.useState();

  const [convertedEl, setConvertedEl] = useState(null);

  //Perks
  const [perks, setPerksState] = React.useState();
  const [convertedPerks, setConvertedPerks] = useState(null);

  const inputRef = React.useRef(null);

  const [submitError, setSubmitError] = React.useState(null);
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);

  const handleCandidateFileUpload = async (e) => {
    try {
      e.preventDefault();
      setShowCandidateForm(false);
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let d = selectedData;
          let r = rejectedData;
          const json = await xlsx.utils.sheet_to_json(worksheet);
          console.log(json);
          json.forEach((item) => {
            const EmailIndex = d.findIndex((el) => {
              return (
                (el.Email !== null &&
                  el.Email !== undefined &&
                  el.Email !== "undefined" &&
                  item.Email !== undefined &&
                  el.Email.trim().toLowerCase() ===
                    item.Email.trim().toLowerCase()) ||
                el.Contact === item.Contact
              );
            });
            const RejectIndex = r.findIndex(
              (el) =>
                (el.Email !== null &&
                  item.Email !== undefined &&
                  (el.Email !== undefined && el.Email.trim().toLowerCase()) ===
                    item.Email.trim().toLowerCase()) ||
                el.Contact === item.Contact
            );

            if (EmailIndex !== -1 || RejectIndex !== -1) {
              r.push({
                FirstName: item["First Name"] ? item["First Name"] : "",
                LastName: item["Last Name"] ? item["Last Name"] : "",
                Email: item.Email ? item.Email : "",
                Contact: item.Contact ? item.Contact : "",
                Reason: "Email/Contact Already Added",
                Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (
              item.Email === null ||
              item.Email === undefined ||
              item.Email.trim() === "" ||
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                item.Email.trim()
              )
            ) {
              r.push({
                FirstName: item["First Name"] ? item["First Name"] : "",
                LastName: item["Last Name"] ? item["Last Name"] : "",
                Email: item.Email ? item.Email : "",
                Contact: item.Contact ? item.Contact : "",
                Reason: "Invalid Email",
                Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (item.Contact === null || !/^[0-9]{10}$/i.test(item.Contact)) {
              r.push({
                FirstName: item["First Name"] ? item["First Name"] : "",
                LastName: item["Last Name"] ? item["Last Name"] : "",
                Email: item.Email ? item.Email : "",
                Contact: item.Contact ? item.Contact : "",
                Reason: "Invalid Contact",
                Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (
              item["First Name"] === null ||
              item["First Name"] === undefined ||
              item["First Name"].trim() === ""
            ) {
              r.push({
                FirstName: item["First Name"] ? item["First Name"] : "",
                LastName: item["Last Name"] ? item["Last Name"] : "",
                Email: item.Email ? item.Email : "",
                Contact: item.Contact ? item.Contact : "",
                Reason: "Invalid First Name",
                Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (EmailIndex === -1) {
              d.push({
                FirstName: item["First Name"] ? item["First Name"] : "",
                LastName: item["Last Name"] ? item["Last Name"] : "",
                Email: item.Email ? item.Email : "",
                Contact: item.Contact ? item.Contact : "",
                Address: item.Address ? item.Address : "",
              });
            }
          });
          console.log(r);
          console.log(d);
          await setCandidateData(d);
          await setRejectedData(r);
          await setSelectedData(d);
          candidateInputRef.current.value = "";
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    let access_token = localStorage.getItem("access_token");
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let res = await getJobById(id, access_token);
      if (res) {
        res.data.job.validTill = res.data.job.validTill.split("T")[0];
        await localStorage.setItem("postjob", JSON.stringify(res.data.job));
        let city = res.data.job.location.split(",")[0];
        if(res.data.job.location.includes(",")){
          let country = res.data.job.location.split(",")[1].trim();
          let c = cities.filter((el) => {
            return el.name === city && el.country === country;
          });
          await setSelectedCity(c[0]);
        }
        else{
          setSelectedCity({name:city});
        }
        await setJob(res.data.job);
        await setJob({ ...res.data.job });
        await setQuestions(res.data.job.questions);
        setState();
      } else {
        console.log("no response");
      }
      console.log(job);
    };
    getData();
    const setState = async () => {
      let data = JSON.parse(await localStorage.getItem("postjob"));
      if (data) {
        setJob(data);
        setSkills(data.skills);

        if (data.eligibility) {
          const blocksFromHtml = htmlToDraft(data.eligibility);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setEligibleState(editorState);
        }

        if (data.jobDesc) {
          const blocksFromHtml = htmlToDraft(data.jobDesc);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setDescState(editorState);
        }
        if (data.perks) {
          const blocksFromHtml = htmlToDraft(data.perks);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setPerksState(editorState);
        }
      }
    };
  }, [job_id]);

  React.useEffect(() => {
    const initial = async () => {
      await setJob(null);
      let access_token = localStorage.getItem("access_token");
      let p = JSON.parse(await localStorage.getItem("prof"));
      let pr1 = JSON.parse(await localStorage.getItem("RolesProf"));
      let user = await JSON.parse(await localStorage.getItem("user"));
      await setUser(user);
      let res = await getSkills({ user_id: user._id }, user.access_token);

      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        if (!pr1) pr1 = new Array(roles.size).fill(0);

        let res1 = await getJobById(id, access_token);
        let pr = new Array(res.data.length).fill(0);
        if (res1.data.job.skills.length > 0) {
          await res1.data.job.skills.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            res.data[index].proficiency = skill.proficiency;
            pr[index] = skill.proficiency;
          });
          console.log(pr);
          await setProf([...pr]);
          console.log(prof);
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
        console.log(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const title = require.jobTitle;

  const postJob = async (values, salary, maxSalary) => {
    let access_token = localStorage.getItem("access_token");
    let jobs = JSON.parse(await localStorage.getItem("postjob"));
    let skills = [];

    dbSkills.forEach((el, index) => {
      if (prof[index] > 0) {
        el.proficiency = prof[index];
        skills.push(el);
      }
    });
    values.location = selectedCity;
    values.skills = skills;
    values.user_id = user._id;
    values.salary = [currency, salary, maxSalary];
    const job_id = localStorage.getItem("ids");
    values.questions = questions;
    let res = await updateJobAPI(
      {
        skills: skills,
        salary: [currency, salary, maxSalary],
        questions: questions,
        ...values,
      },
      access_token
    );
    console.log(res);
    if (res) {
      swal({
        title: "Job Updated Successfully !",
        message: "Success",
        icon: "success",
        button: "Continue",
      }).then((result) => {
        window.location.href = "/company/jobDetails/" + id;
      });
    } else {
      swal({
        title: " Error Updatings Job !",
        message: "OOPS! Error Occured",
        icon: "Error",
        button: "Ok",
      });
    }
    localStorage.removeItem("prof");
    localStorage.removeItem("postjob");
    setJob();
    setSkills([]);
  };

  //Perks Editor
  const onPerksEditorStateChange = (state) => {
    setPerksState(state);
    convertPerksToHTML();
  };

  const convertPerksToHTML = async () => {
    let currentContentAsHTML = convertToHTML(perks.getCurrentContent());
    setConvertedPerks(currentContentAsHTML);
    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.perks = currentContentAsHTML;
    setJob(job);
    localStorage.setItem("postjob", JSON.stringify(job));
  };

  //description Editor

  const onDescEditorStateChange = (state) => {
    setDescState(state);
    convertDescToHTML();
  };

  const convertDescToHTML = async () => {
    let currentContentAsHTML = convertToHTML(desc.getCurrentContent());
    setConvertedDesc(currentContentAsHTML);
    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.jobDesc = currentContentAsHTML;
    setJob(job);
    localStorage.setItem("postjob", JSON.stringify(job));
  };

  //Eligibility Editor
  const oneligibiltyStateChange = (state) => {
    setEligibleState(state);
    convertElToHTML();
    // console.log(editorState);
  };

  const convertElToHTML = async () => {
    let currentContentAsHTML = convertToHTML(eligible.getCurrentContent());
    setConvertedEl(currentContentAsHTML);

    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.eligibility = currentContentAsHTML;
    setJob(job);
    setCurrency(job.salary[0]);
    localStorage.setItem("postjob", JSON.stringify(job));
  };

  return (
    <div className=" bg-slate-100 w-full p-5">
      <p className="font-semibold">
        {PageIndex} of 5 : {PageDetails[PageIndex - 1]}
      </p>

      <div className="my-2">
        {Alert === true && (
          <div
            className="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
            role="alert"
          >
            Job Updated Successfully !
          </div>
        )}
        {Alert === false && (
          <div
            className="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
            role="alert"
          >
            Problem Updating Job ! Try Again Later !
          </div>
        )}
      </div>
      {job ? (
        <div className="my-3">
          <p className="hidden">{job && job.jobTitle}</p>
          <div className="flex w-full">
            {PageIndex === 1 && (
              <div className="w-3/4 shadow-md mr-3 bg-white">
                <Formik
                  initialValues={{
                    jobTitle: job ? job.jobTitle : "",
                    location: job ? job.location : "",
                    jobType: job ? job.jobType : "",
                    reqApp: job ? job.reqApp : "",
                    validTill: job ? job.validTill : "",
                    hiringOrganization: job ? job.hiringOrganization : "",
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.jobTitle || values.jobTitle.trim() === "") {
                      errors.jobTitle = "Required !";
                    }

                    if (!selectedCity || selectedCity === " ") {
                      errors.location = "Required !";
                    }
                    if (
                      !values.hiringOrganization ||
                      values.hiringOrganization.trim() === ""
                    ) {
                      errors.hiringOrganization = "Required !";
                    }
                    return errors;
                  }}
                >
                  {({ values }) => {
                    return (
                      <div className="w-full mt-9">
                        <Form className="w-full m-5 mx-7">
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 block font-semibold">
                              Job Title
                            </label>
                            <Field
                              name="jobTitle"
                              type="text"
                              placeholder=""
                              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                              style={{ borderRadius: "5px" }}
                            />
                            <ErrorMessage
                              name="jobTitle"
                              component="div"
                              className="text-red-600 text-sm w-full"
                            />
                          </div>
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 mb-3 block font-semibold">
                              Job Description
                            </label>

                            <Editor
                              editorState={desc}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              wrapperStyle={{
                                width: "75%",
                                border: "1px solid rgb(156 163 175 / 1)",
                                borderRadius: "5px",
                              }}
                              editorStyle={{
                                minHeight: "200px",
                                paddingLeft: "1rem",
                              }}
                              onEditorStateChange={onDescEditorStateChange}
                            />
                          </div>
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 block font-semibold">
                              Job Location
                            </label>
                            {/* <Field
                              name="location"
                              type="text"
                              placeholder=""
                              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                              style={{ borderRadius: "5px" }}
                            /> */}
                            <p>Current Location : {job.location}</p>
                            <Combobox
                              value={selectedCity}
                              onChange={setSelectedCity}
                            >
                              <Combobox.Input
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                }
                                className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                                style={{ borderRadius: "5px" }}
                              />
                              <Combobox.Options className="absolute bg-white">
                                {query.length > 0 && (
                                  <Combobox.Option value={`${query}`}>
                                    Create "{query}"
                                  </Combobox.Option>
                                )}
                                {filteredCity.map((city) => (
                                  <Combobox.Option
                                    key={city.name}
                                    value={`${city.name}, ${city.country}`}
                                  >
                                    {city.name}, {city.country}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            </Combobox>
                            <ErrorMessage
                              name="location"
                              component="div"
                              className="text-red-600 text-sm w-full text-left mr-auto"
                            />
                          </div>
                          <div className="my-7 space-y-3">
                            <label className="text-left w-3/4 block font-semibold">
                              Job Type:
                            </label>
                            <div
                              role="group"
                              aria-labelledby="my-radio-group"
                              className="space-x-5 my-3 w-3/4 mr-auto "
                            >
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Full-Time"
                                  className="mr-2"
                                />
                                Full-Time
                              </label>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Part-Time"
                                  className="mr-2"
                                />
                                Part-Time
                              </label>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Internship"
                                  className="mr-2"
                                />
                                Internship
                              </label>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Freelancing"
                                  className="mr-2"
                                />
                                Freelancing
                              </label>
                            </div>
                          </div>
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 font-semibold block">
                              Applications Open Till :{" "}
                            </label>
                            <Field
                              name="validTill"
                              type="date"
                              placeholder=""
                              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                              min={Date.now()}
                            />
                          </div>
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 block font-semibold">
                              Hiring Organization
                            </label>
                            <Field
                              name="hiringOrganization"
                              type="text"
                              placeholder=""
                              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                            />
                            <ErrorMessage
                              name="hiringOrganization"
                              component="div"
                              className="text-red-600 text-sm w-full"
                            />
                          </div>

                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 block font-semibold">
                              Candidates Required
                            </label>
                            <Field
                              name="reqApp"
                              type="text"
                              placeholder=""
                              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                            />
                            <ErrorMessage
                              name="reqApp"
                              component="div"
                              className="text-red-600 text-sm w-full"
                            />
                          </div>
                        </Form>
                        {values.jobTitle &&
                        desc &&
                        values.location &&
                        values.jobType &&
                        values.validTill &&
                        values.hiringOrganization ? (
                          <button
                            className="bg-[#034488] px-4 py-1 text-white mx-auto block my-6 rounded-sm"
                            onClick={async () => {
                              let job = await JSON.parse(
                                await localStorage.getItem("postjob")
                              );
                              if (job === null) job = {};
                              job.jobTitle = values.jobTitle;
                              job.location = values.location;
                              job.jobType = values.jobType;
                              job.validTill = values.validTill;
                              job.hiringOrganization =
                                values.hiringOrganization;
                              job.reqApp = values.reqApp;
                              localStorage.setItem(
                                "postjob",
                                JSON.stringify(job)
                              );
                              await setJob(job);
                              setPageIndex(2);
                            }}
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            className="bg-[#034388d7] px-4 py-1 text-white mx-auto block my-6 rounded-sm"
                            onClick={() => {
                              console.log(values);
                            }}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    );
                  }}
                </Formik>
              </div>
            )}
            {PageIndex === 2 && (
              <div className="w-3/4 shadow-md mr-3 bg-white">
                <Formik>
                  {(values) => {
                    return (
                      <div className="w-full mt-9">
                        <Form className="w-full m-5 mx-7">
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 mb-3 block font-semibold">
                              Candidate Eligibility
                            </label>

                            <Editor
                              editorState={eligible}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              wrapperStyle={{
                                width: "75%",
                                border: "1px solid rgb(156 163 175 / 1)",
                                borderRadius: "5px",
                              }}
                              editorStyle={{
                                minHeight: "200px",
                                paddingLeft: "1rem",
                              }}
                              onEditorStateChange={oneligibiltyStateChange}
                            />
                          </div>
                          <div className="my-7 space-y-3 w-full block">
                            <label className="text-left w-3/4 font-semibold block">
                              Skills
                            </label>
                            <div className="w-3/4">
                              <div className="my-3 px-4 flex items-center flex-wrap gap-y-3">
                                <input
                                  type="text"
                                  className="w-3/4 text-600 border-[0.5px] border-[#6b7280] p-2 mr-3"
                                  placeholder="Search Skill..."
                                  ref={inputSkillRef}
                                  onChange={async () => {
                                    let role = new Set([]);
                                    if (
                                      inputSkillRef.current.value.trim() !==
                                        "" ||
                                      !inputSkillRef ||
                                      !inputSkillRef.current.value
                                    ) {
                                      dbSkills.forEach((el) => {
                                        if (
                                          el.role
                                            .toLowerCase()
                                            .includes(
                                              inputSkillRef.current.value.toLowerCase()
                                            )
                                        ) {
                                          role.add(el.role);
                                        } else if (
                                          el.primarySkill
                                            .toLowerCase()
                                            .includes(
                                              inputSkillRef.current.value.toLowerCase()
                                            )
                                        ) {
                                          role.add(el.role);
                                        } else if (
                                          el.secondarySkill
                                            .toLowerCase()
                                            .includes(
                                              inputSkillRef.current.value.toLowerCase()
                                            )
                                        ) {
                                          role.add(el.role);
                                        }
                                      });
                                      await setShowRoles(Array.from(role));
                                    } else {
                                      await setShowRoles(roles);
                                    }
                                  }}
                                />
                                <button className="h-10 bg-[#034488] text-white rounded-sm block cursor-pointer px-8 align-middle ">
                                  Search
                                </button>
                              </div>

                              <div className="my-3">
                                <div className="w-full">
                                  {showRoles &&
                                    showRoles.map((el, index) => {
                                      return (
                                        <div key={index}>
                                          <Disclosure>
                                            {({ open }) => (
                                              <div
                                                className={`${
                                                  open ? "shadow-md" : ""
                                                }`}
                                              >
                                                <Disclosure.Button
                                                  className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                                    open ? "shadow-lg " : ""
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
                                                        dbSkills.forEach(
                                                          (skill) => {
                                                            if (
                                                              skill.role === el
                                                            ) {
                                                              skill.proficiency =
                                                                e.target.value;
                                                              let inde =
                                                                dbSkills.findIndex(
                                                                  (el) => {
                                                                    return (
                                                                      el ===
                                                                      skill
                                                                    );
                                                                  }
                                                                );
                                                              let p = prof;
                                                              p[inde] =
                                                                e.target.value;
                                                              setProf(p);
                                                              skill.rating =
                                                                e.target.value;
                                                            }
                                                          }
                                                        );
                                                        console.log(dbSkills);
                                                        let rp = rolesProf;
                                                        rp[index] =
                                                          e.target.value;
                                                        setRolesProf(rp);
                                                        localStorage.setItem(
                                                          "RolesProf",
                                                          JSON.stringify(
                                                            rolesProf
                                                          )
                                                        );
                                                      }}
                                                    />
                                                    <p>5</p>
                                                  </div>
                                                  <ChevronUpIcon
                                                    className={`${
                                                      !open
                                                        ? "rotate-180 transform"
                                                        : ""
                                                    } h-5 w-5 text-blue-500`}
                                                  />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-2">
                                                  {primarySkills[el].map(
                                                    (skill, index) => {
                                                      return (
                                                        <div>
                                                          <Disclosure>
                                                            {({ open }) => (
                                                              <div
                                                                className={`${
                                                                  open
                                                                    ? "shadow-md"
                                                                    : ""
                                                                }`}
                                                              >
                                                                <Disclosure.Button
                                                                  className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                                                    open
                                                                      ? "shadow-lg"
                                                                      : ""
                                                                  } `}
                                                                >
                                                                  <span>
                                                                    {skill}
                                                                  </span>
                                                                  <ChevronUpIcon
                                                                    className={`${
                                                                      !open
                                                                        ? "rotate-180 transform"
                                                                        : ""
                                                                    } h-5 w-5 text-blue-500`}
                                                                  />
                                                                </Disclosure.Button>
                                                                <Disclosure.Panel className="p-3 px-12">
                                                                  {dbSkills
                                                                    .filter(
                                                                      (
                                                                        secSkill
                                                                      ) => {
                                                                        return (
                                                                          secSkill.primarySkill ===
                                                                            skill &&
                                                                          secSkill.role ===
                                                                            el
                                                                        );
                                                                      }
                                                                    )
                                                                    .map(
                                                                      (
                                                                        secSkill,
                                                                        index
                                                                      ) => {
                                                                        let d =
                                                                          dbSkills;
                                                                        let index1 =
                                                                          d.findIndex(
                                                                            (
                                                                              el
                                                                            ) => {
                                                                              return (
                                                                                el ===
                                                                                secSkill
                                                                              );
                                                                            }
                                                                          );
                                                                        return (
                                                                          <div className="flex my-2 text-sm justify-between items-center py-1">
                                                                            <p>
                                                                              {
                                                                                secSkill.secondarySkill
                                                                              }
                                                                            </p>

                                                                            <div className="flex items-center space-x-2">
                                                                              0
                                                                              <input
                                                                                type="range"
                                                                                min="0"
                                                                                max="5"
                                                                                value={
                                                                                  prof[
                                                                                    index1
                                                                                  ]
                                                                                }
                                                                                onChange={async (
                                                                                  e
                                                                                ) => {
                                                                                  let d =
                                                                                    dbSkills;
                                                                                  d[
                                                                                    index1
                                                                                  ] =
                                                                                    {
                                                                                      ...d[
                                                                                        index1
                                                                                      ],
                                                                                      proficiency:
                                                                                        e
                                                                                          .target
                                                                                          .value,
                                                                                    };
                                                                                  let p =
                                                                                    prof;
                                                                                  prof[
                                                                                    index1
                                                                                  ] =
                                                                                    e.target.value;
                                                                                  await localStorage.setItem(
                                                                                    "prof",
                                                                                    JSON.stringify(
                                                                                      p
                                                                                    )
                                                                                  );
                                                                                  await setProf(
                                                                                    [
                                                                                      ...p,
                                                                                    ]
                                                                                  );
                                                                                  await setDbSkills(
                                                                                    [
                                                                                      ...d,
                                                                                    ]
                                                                                  );
                                                                                }}
                                                                              />
                                                                              5
                                                                            </div>
                                                                          </div>
                                                                        );
                                                                      }
                                                                    )}
                                                                </Disclosure.Panel>
                                                              </div>
                                                            )}
                                                          </Disclosure>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </Disclosure.Panel>
                                              </div>
                                            )}
                                          </Disclosure>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-3 mx-auto justify-center">
                            <button
                              className="bg-[#034488] px-4 py-1 rounded-sm text-white"
                              onClick={() => {
                                setPageIndex(1);
                              }}
                            >
                              Prev
                            </button>
                            <button
                              className="bg-[#034488] px-4 py-1 rounded-sm text-white"
                              onClick={() => {
                                setPageIndex(3);
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </Form>
                      </div>
                    );
                  }}
                </Formik>
              </div>
            )}
            {PageIndex === 3 && (
              <div className="w-3/4 shadow-md mr-3 bg-white">
                <div className="w-full mt-9">
                  <div className="w-full m-5 mx-7">
                    <div className="my-3 text-left">
                      <p className="font-semibold">
                        Add Candidate Details Sheet
                      </p>
                      <p className="text-sm mt-3 mb-1">
                        ( Headers Conventions: FirstName, LastName, Email,
                        Contact, Address)
                      </p>
                      <p className="text-sm">
                        (Data must contain candidate's Email Address and Contact
                        Number)
                      </p>
                    </div>
                    <div className="flex space-x-10 my-3">
                      <button
                        className="bg-[#034488] text-white rounded-sm px-4 py-1"
                        onClick={() => {
                          setShowCandidateForm(true);
                        }}
                      >
                        Add User
                      </button>
                      {candidateData.length === 0 && rejectedData.length === 0 && (
                        <label
                          for="candidatesInput"
                          className="cursor-pointer bg-[#034488] text-white rounded-sm px-4 py-1"
                          onClick={() => {
                            if (candidateInputRef.current)
                              candidateInputRef.current.click();
                          }}
                        >
                          {" "}
                          Add File{" "}
                        </label>
                      )}
                      <input
                        ref={candidateInputRef}
                        type="file"
                        className="hidden"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleCandidateFileUpload}
                      />
                      {(rejectedData.length > 0 || selectedData.length > 0) && (
                        <button
                          className="bg-[#034488] text-white rounded-sm px-2 py-1"
                          onClick={() => {
                            setCandidateData([]);
                            setSelectedData([]);
                            setRejectedData([]);
                            setShowCandidateForm(false);
                            if (candidateInputRef.current)
                              candidateInputRef.current.value = " ";
                          }}
                        >
                          Reset Data
                        </button>
                      )}
                    </div>
                    {showCandidateForm && (
                      <div className="my-4 w-3/4 p-3 bg-slate-100 px-8">
                        <Formik
                          initialValues={candidateInitial}
                          validate={(values) => {
                            const errors = {};
                            let d = selectedData;

                            const res = d.findIndex((el) => {
                              return el.Email === values.Email;
                            });
                            const res2 = d.findIndex((el) => {
                              return el.Contact == values.Contact;
                            });
                            if (
                              !values.Email ||
                              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                values.Email.trim()
                              )
                            ) {
                              errors.Email = "Invalid Email";
                            } else if (res !== -1) {
                              errors.Email = "Email already exists";
                            }
                            if (
                              !values.Contact ||
                              !/^[0-9]{10}$/i.test(values.Contact)
                            ) {
                              errors.Contact = "Invalid Contact";
                            } else if (res2 !== -1) {
                              errors.Contact = "Contact already exists";
                            }
                            return errors;
                          }}
                          onSubmit={async (values) => {
                            let d = selectedData;
                            let r = rejectedData;
                            console.log(editIndex);
                            if (editIndex !== null) r.splice(editIndex, 1);
                            console.log(r);
                            setEditIndex(null);
                            d.push(values);
                            await setSelectedData(d);
                            await setCandidateData(d);
                            await setRejectedData(r);
                            await setShowCandidate(true);
                            console.log(selectedData);
                            await setShowCandidateForm(false);
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form>
                                <p className="text-left font-semibold py-2">
                                  Add User
                                </p>
                                <div className="flex my-3 flex-wrap text-left">
                                  <div className="w-1/2">
                                    <label>First Name</label>
                                    <Field
                                      name="FirstName"
                                      type="text"
                                      className="text-600 rounded-sm block px-4 py-1"
                                      style={{ borderRadius: "5px" }}
                                    />
                                    <ErrorMessage
                                      name="FirstName"
                                      component="div"
                                    />
                                  </div>
                                  <div className="w-1/2">
                                    <label>Last Name</label>
                                    <Field
                                      name="LastName"
                                      type="text"
                                      className="text-600 rounded-sm block px-4 py-1"
                                      style={{ borderRadius: "5px" }}
                                    />
                                    <ErrorMessage
                                      name="LastName"
                                      component="div"
                                    />
                                  </div>
                                </div>
                                <div className="flex my-3 flex-wrap text-left">
                                  <div className="w-1/2">
                                    <label>Email</label>
                                    <Field
                                      name="Email"
                                      type="text"
                                      className="text-600 rounded-sm block px-4 py-1"
                                      style={{ borderRadius: "5px" }}
                                    />
                                    <ErrorMessage
                                      name="Email"
                                      component="div"
                                      className="text-sm text-red-500"
                                    />
                                  </div>
                                  <div className="w-1/2">
                                    <label>Contact</label>
                                    <Field
                                      name="Contact"
                                      type="text"
                                      className="text-600 rounded-sm block px-4 py-1"
                                      style={{ borderRadius: "5px" }}
                                    />
                                    <ErrorMessage
                                      name="Contact"
                                      component="div"
                                      className="text-sm text-red-500"
                                    />
                                  </div>
                                </div>
                                <div className="my-3 text-left pr-10">
                                  <label>Address</label>
                                  <Field
                                    name="Address"
                                    type="text"
                                    className="text-600 rounded-sm block w-full px-4 py-1"
                                    style={{ borderRadius: "5px" }}
                                  />
                                </div>
                                <div>
                                  <button
                                    className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
                                    type="submit"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    Add
                                  </button>
                                  <button
                                    className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                    onClick={() => {
                                      setCandidateInitial({
                                        FirstName: "",
                                        LastName: "",
                                        Email: "",
                                        Contact: "",
                                        Address: "",
                                      });
                                      setShowCandidateForm(false);
                                      setEditIndex(null);
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
                    <div className="my-9 w-3/4">
                      {rejectedData.length > 0 && (
                        <div className="flex items-center w-full justify-between">
                          <p>Rejected Data ({rejectedData.length})</p>
                          <p>
                            {showRejected ? (
                              <p
                                className="text-sm text-blue-500 cursor-pointer ml-auto"
                                onClick={() => {
                                  setShowRejected(false);
                                }}
                              >
                                Hide
                              </p>
                            ) : (
                              <p
                                className="text-sm text-blue-500 cursor-pointer ml-auto"
                                onClick={() => {
                                  setShowRejected(true);
                                }}
                              >
                                Show
                              </p>
                            )}
                          </p>
                        </div>
                      )}
                      {showRejected && rejectedData.length > 0 && (
                        <div className="my-4">
                          <table className="w-full">
                            <thead className="bg-white border-b">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Email
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Contact
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Reason
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rejectedData.map((user, index) => {
                                return (
                                  <tr
                                    className={`${
                                      index % 2 === 0
                                        ? "bg-gray-100"
                                        : "bg-white"
                                    } border-b`}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {index + 1}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Email}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Contact}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Reason}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      <RiEditBoxLine
                                        className="text-sm text-blue-500 cursor-pointer"
                                        onClick={() => {
                                          setCandidateInitial(user);
                                          setEditIndex(index);
                                          setShowCandidateForm(true);
                                        }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <div className="my-9">
                      {candidateData.length > 0 && (
                        <div className="flex items-center w-3/4 justify-between">
                          <p className="font-semibold">
                            Candidate Data ({candidateData.length})
                          </p>
                          <p>
                            {showCandidate ? (
                              <p
                                className="text-sm text-blue-500 cursor-pointer ml-auto"
                                onClick={() => {
                                  setShowCandidate(false);
                                }}
                              >
                                Hide
                              </p>
                            ) : (
                              <p
                                className="text-sm text-blue-500 cursor-pointer ml-auto"
                                onClick={() => {
                                  setShowCandidate(true);
                                }}
                              >
                                Show
                              </p>
                            )}
                          </p>
                        </div>
                      )}
                      {showCandidate && candidateData.length > 0 && (
                        <div className="my-4">
                          <table className="w-3/4">
                            <thead className="bg-white border-b text-left">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  First Name
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Last Name
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Email
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Contact
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Address
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {candidateData.map((user, index) => {
                                return (
                                  <tr
                                    className={`${
                                      index % 2 === 0
                                        ? "bg-gray-100"
                                        : "bg-white"
                                    } border-b`}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                      {index + 1}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.FirstName}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.LastName}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Email}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Contact}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Address}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      <AiOutlineDelete
                                        className="text-sm  text-red-500 cursor-pointer"
                                        onClick={() => {
                                          setCandidateData(
                                            candidateData.filter(
                                              (item) =>
                                                item.Email !== user.Email
                                            )
                                          );
                                          setSelectedData(
                                            selectedData.filter(
                                              (item) =>
                                                item.Email !== user.Email
                                            )
                                          );
                                        }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3 mx-auto justify-center my-6">
                    <button
                      className="bg-[#034488] px-4 py-1 rounded-sm text-white"
                      onClick={() => {
                        setPageIndex(2);
                      }}
                    >
                      Prev
                    </button>
                    <button
                      className="bg-[#034488] px-4 py-1 rounded-sm text-white"
                      onClick={() => {
                        setPageIndex(4);
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            {PageIndex === 4 && (
              <div className="w-3/4 shadow-md mr-3 bg-white py-9 px-7">
                <p className="font-semibold">Add Screening Questions</p>
                <p className="text-gray-600">
                  We recommend adding 3 or more questions.
                </p>
                <div className="my-5">
                  {questions.map((question, index) => {
                    return (
                      <div className="my-5">
                        <div className="flex justify-between">
                          <p className="font-semibold">
                            Question {index + 1} :{" "}
                            <span className="font-normal">
                              {question.question}
                            </span>
                          </p>
                          <div className="flex space-x-3">
                            <RiEditBoxLine
                              className="cursor-pointer text-blue-500"
                              onClick={async () => {
                                await setShowQuestionForm(false);
                                await setInitialQuestion(question);
                                await setQuestionEditIndex(index);
                                setShowQuestionForm(true);
                              }}
                            />
                            <AiOutlineDelete
                              className="cursor-pointer text-red-600"
                              onClick={() => {
                                setQuestions(
                                  questions.filter(
                                    (item) =>
                                      item.question !== question.question
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-gray-600 font-semibold">
                          Answer :{" "}
                          <span className="font-normal">{question.answer}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
                {showQuestionForm && (
                  <Formik
                    initialValues={initialQuestion}
                    validate={(values) => {
                      const errors = {};
                      if (!values.question) {
                        errors.question = "Required";
                      }
                      if (!values.answer) {
                        errors.answer = "Required";
                      }
                      return errors;
                    }}
                    onSubmit={(values) => {
                      if (questionEditIndex !== null) {
                        let temp = [...questions];
                        temp[questionEditIndex] = values;
                        setQuestions(temp);
                        setQuestionEditIndex(null);
                        setShowQuestionForm(false);
                        setInitialQuestion({
                          question: "",
                          answer: "",
                        });
                      } else {
                        setQuestions([
                          ...questions,
                          { question: values.question, answer: values.answer },
                        ]);
                        setShowQuestionForm(false);
                        setInitialQuestion({
                          question: "",
                          answer: "",
                        });
                      }
                    }}
                  >
                    {({ values }) => (
                      <Form>
                        <div className="my-6">
                          <label className="font-semibold">Question</label>
                          <Field
                            name="question"
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                            type="text"
                          />
                          <ErrorMessage
                            component="div"
                            name="question"
                            className="text-red-600 text-sm"
                          />
                        </div>
                        <div className="my-6">
                          <label className="font-semibold">Ideal Answer</label>
                          <Field
                            name="answer"
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                            type="text"
                          />
                          <ErrorMessage
                            component="div"
                            name="answer"
                            className="text-red-600 text-sm"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                            style={{ backgroundColor: "#034488" }}
                          >
                            {questionEditIndex === null
                              ? "Add Question"
                              : " Save Changes"}
                          </button>
                          <button
                            type="button"
                            className="rounded-sm px-4 py-1 text-black border-2 rounded-sm border-black"
                            onClick={() => {
                              setShowQuestionForm(false);
                              setInitialQuestion({
                                question: "",
                                answer: "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
                {!showQuestionForm && (
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {
                        setInitialQuestion({
                          question: "",
                          answer: "",
                        });
                        setShowQuestionForm(true);
                      }}
                    >
                      Add Question
                    </button>
                  </div>
                )}
                <div className="flex space-x-3 mx-auto justify-center">
                  <button
                    className="bg-[#034488] px-4 py-1 rounded-sm text-white"
                    onClick={() => {
                      if (showQuestionForm && questions.length > 0) {
                        swal({
                          title: "Are you sure?",
                          text: "You have unsaved changes!",
                          icon: "warning",
                          buttons: true,
                        }).then((ok) => {
                          if (ok) setPageIndex(3);
                        });
                      } else setPageIndex(3);
                    }}
                  >
                    Prev
                  </button>
                  <button
                    className="bg-[#034488] px-4 py-1 rounded-sm text-white"
                    onClick={() => {
                      if (showQuestionForm) {
                        swal({
                          title: "Are you sure?",
                          text: "You have unsaved changes!",
                          icon: "warning",
                          buttons: true,
                        }).then((ok) => {
                          if (ok) setPageIndex(5);
                        });
                      } else {
                        setPageIndex(5);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {PageIndex === 5 && (
              <div className="w-3/4 shadow-md mr-3 bg-white">
                <div className="w-full mt-9">
                  <div className="w-full m-5 mx-7">
                    <Formik
                      initialValues={{
                        salary: job.salary[1] ? job.salary[1] : "",
                        maxSalary: job.salary[2] ? job.salary[2] : "",
                      }}
                      validate={(values) => {
                        const errors = {};
                        if (
                          values.salary &&
                          values.maxSalary &&
                          values.maxSalary < values.salary
                        ) {
                          errors.maxSalary =
                            "Max Salary should be greater than Salary";
                        }
                        if (!values.salary) {
                          errors.salary = "Required !";
                        }
                        if (!values.maxSalary) {
                          errors.maxSalary = "Required !";
                        }
                        return errors;
                      }}
                      // onSubmit={postJob}
                    >
                      {(values) => {
                        return (
                          <div>
                            <Form className="w-full mt-9">
                              <div className="my-5 space-y-3 w-full">
                                <label className="text-left w-3/4 mb-3 font-semibold block">
                                  Remunerations
                                </label>

                                <Editor
                                  editorState={perks}
                                  toolbarClassName="toolbarClassName"
                                  wrapperClassName="wrapperClassName"
                                  editorClassName="editorClassName"
                                  wrapperStyle={{
                                    zIndex: "10",
                                    width: "75%",
                                    border: "1px solid rgb(156 163 175 / 1)",
                                    borderRadius: "5px",
                                  }}
                                  editorStyle={{
                                    minHeight: "200px",
                                    paddingLeft: "1rem",
                                  }}
                                  onEditorStateChange={onPerksEditorStateChange}
                                />
                              </div>
                              <div className="my-7 mt-9 space-y-3 w-3/4">
                                <label className="text-left w-3/4 font-semibold block">
                                  Pay Range
                                </label>
                                <div className="items-center space-x-3">
                                  <label>Currency</label>
                                  <Listbox
                                    onChange={setCurrency}
                                    value={currency}
                                  >
                                    <div className="relative mt-1 w-1/3 mb-5 z-100">
                                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border-1 border-">
                                        <span className="block truncate">
                                          {currency.symbol} - {currency.name}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                          <ChevronDownIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </Listbox.Button>
                                      <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                      >
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-100">
                                          {currencies.currencies.map(
                                            (currency, currencyIdx) => (
                                              <Listbox.Option
                                                key={currencyIdx}
                                                className={({ active }) =>
                                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                      ? "bg-blue-100 text-blue-900"
                                                      : "text-gray-900"
                                                  }`
                                                }
                                                value={currency}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span
                                                      className={`block truncatez-100 ${
                                                        selected
                                                          ? "font-medium"
                                                          : "font-normal"
                                                      }`}
                                                    >
                                                      {currency.symbol} -{" "}
                                                      {currency.name}
                                                    </span>
                                                    {selected ? (
                                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 z-100">
                                                        <CheckIcon
                                                          className="h-5 w-5"
                                                          aria-hidden="true"
                                                        />
                                                      </span>
                                                    ) : null}
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            )
                                          )}
                                        </Listbox.Options>
                                      </Transition>
                                    </div>
                                  </Listbox>
                                </div>
                                <div className="flex items-center space-x-2 flex-wrap">
                                  <div className="block w-1/3">
                                    <label className="block">Minimum</label>
                                    <Field
                                      name="salary"
                                      type="number"
                                      placeholder=""
                                      className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 focus:outline-0 focus:border-0 px-4"
                                    />
                                    <ErrorMessage
                                      name="salary"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label>Maximum</label>
                                    <Field
                                      name="maxSalary"
                                      type="number"
                                      placeholder=""
                                      className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4"
                                    />
                                    <ErrorMessage
                                      name="maxSalary"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="">
                                <button
                                  className="mx-auto bg-[#034488] px-4 py-1 text-white rounded-sm"
                                  style={{ backgroundColor: "#034488" }}
                                  type="button"
                                  onClick={async () => {
                                    if (
                                      values.values.salary >
                                      values.values.maxSalary
                                    ) {
                                      return;
                                    }
                                    let job = await JSON.parse(
                                      await localStorage.getItem("postjob")
                                    );
                                    job.salary = [
                                      currency,
                                      values.values.salary,
                                      values.values.maxSalary,
                                    ];
                                    await setJob(job);
                                    localStorage.setItem(
                                      "postjob",
                                      JSON.stringify(job)
                                    );
                                    setPageIndex(4);
                                  }}
                                >
                                  Prev
                                </button>
                              </div>
                              {values.values.salary &&
                              values.values.maxSalary ? (
                                <button
                                  type="button"
                                  className="bg-[#034488] my-5 px-4 py-1 mx-auto hover:bg-[#034488] text-white font-bold rounded-sm"
                                  onClick={() => {
                                    if (
                                      values.values.salary >
                                      values.values.maxSalary
                                    ) {
                                      return;
                                    }
                                    postJob(
                                      job,
                                      values.values.salary,
                                      values.values.maxSalary
                                    );
                                  }}
                                  style={{ backgroundColor: "#034488" }}
                                >
                                  Submit
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="bg-[#034488] my-5 px-4 py-1 mx-auto hover:bg-[#034488] text-white font-bold rounded-sm"
                                  style={{ backgroundColor: "#034388d7" }}
                                  disabled
                                >
                                  Submit
                                </button>
                              )}
                            </Form>
                          </div>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center font-semibold">Loading</p>
      )}
    </div>
  );
};

export default UpdateJob;
