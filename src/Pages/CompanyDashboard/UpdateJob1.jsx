import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { postJobAPI } from "../../service/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../../assets/stylesheet/VerticalTabs.scss";
import swal from "sweetalert";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
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
    "Perks And Salary",
  ];

  const { id } = useParams();

  // Skills To Be Displayed
  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const inputSkillRef = React.useRef(null);

  // Candidate Invitations Xl Sheet Input
  const candidateInputRef = React.useState(null);
  // Candidate Data
  const [candidateData, setCandidateData] = React.useState([]);
  const [rejectedData, setRejectedData] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);

  const [showRejected, setShowRejected] = React.useState(false);
  const [showCandidate, setShowCandidate] = React.useState(false);

  const [candidateInitial, setCandidateInitial] = React.useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Contact: "",
    Address: "",
  });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);

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
        await setJob(res.data.job);
        await setJob({...res.data.job});
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

  const postJob = async (values) => {
    let access_token = localStorage.getItem("access_token");
    let jobs = JSON.parse(await localStorage.getItem("postjob"));
    let skills = dbSkills.filter((el) => {
      return el.proficiency > 0;
    });
    values.skills = skills;
    values.user_id = user._id;
    console.log(values);
    console.log(skills);
    const job_id = localStorage.getItem("ids");
    console.log({ skills: skills, ...values });

    let res = await updateJobAPI({ skills: skills, ...values }, access_token);
    if (res) {
      setAlert(true);
      setTimeout(() => {
        window.location.href = "/company/jobDetails/" + id;
      }, 1000);
    } else {
      setAlert(false);
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
    localStorage.setItem("postjob", JSON.stringify(job));
  };

  return (
    <div className=" bg-slate-100 w-full p-5">
      <p className="font-semibold">
        {PageIndex} of 3 : {PageDetails[PageIndex - 1]}
      </p>

      <div className="my-2">
        {Alert === true && (
          <div
            class="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
            role="alert"
          >
            Job Posted Successfully ! Check Here
          </div>
        )}
        {Alert === false && (
          <div
            class="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
            role="alert"
          >
            Problem Uploading Job ! Try Again Later !
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

                    if (!values.location || values.location.trim() === "") {
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
                            <Field
                              name="location"
                              type="text"
                              placeholder=""
                              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                              style={{ borderRadius: "5px" }}
                            />
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
                                                  className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                                    open ? "shadow-lg " : ""
                                                  }`}
                                                >
                                                  <span>{el}</span>
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
                                                                  className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
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
                                                                          <div className="flex my-2 text-sm justify-between items-center">
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
                          <table class="w-full">
                            <thead class="bg-white border-b">
                              <tr>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Email
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Contact
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Reason
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rejectedData.map((user, index) => {
                                return (
                                  <tr
                                    class={`${
                                      index % 2 === 0
                                        ? "bg-gray-100"
                                        : "bg-white"
                                    } border-b`}
                                  >
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {index + 1}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Email}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Contact}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Reason}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
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
                          <table class="w-3/4">
                            <thead class="bg-white border-b text-left">
                              <tr>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  First Name
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Last Name
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Email
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Contact
                                </th>
                                <th
                                  scope="col"
                                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Address
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {candidateData.map((user, index) => {
                                return (
                                  <tr
                                    class={`${
                                      index % 2 === 0
                                        ? "bg-gray-100"
                                        : "bg-white"
                                    } border-b`}
                                  >
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                      {index + 1}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.FirstName}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.LastName}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Email}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Contact}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Address}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
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
              <div className="w-3/4 shadow-md mr-3 bg-white">
                <div className="w-full mt-9">
                  <div className="w-full m-5 mx-7">
                    <Formik
                      initialValues={{
                        salary: job.salary ? job.salary : "",
                      }}
                      validate={(values) => {
                        const errors = {};
                        if (!values.salary) {
                          errors.salary = "Required !";
                        }

                        return errors;
                      }}
                      // onSubmit={postJob}
                    >
                      {(values) => {
                        return (
                          <div>
                            <Form className="w-full mt-9">
                              <div className="my-7 mt-9 space-y-3 w-3/4">
                                <label className="text-left w-3/4 font-semibold block">
                                  Salary
                                </label>
                                <Field
                                  name="salary"
                                  type="number"
                                  placeholder=""
                                  className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4"
                                />
                              </div>

                              <div className="my-5 space-y-3 w-full">
                                <label className="text-left w-3/4 mb-3 font-semibold block">
                                  Perks
                                </label>

                                <Editor
                                  editorState={perks}
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
                                  onEditorStateChange={onPerksEditorStateChange}
                                />
                              </div>
                              <div className="">
                                <button
                                  className="mx-auto bg-[#034488] px-4 py-1 text-white rounded-sm"
                                  style={{ backgroundColor: "#034488" }}
                                  type="button"
                                  onClick={async () => {
                                    let job = await JSON.parse(
                                      await localStorage.getItem("postjob")
                                    );
                                    job.salary = values.values.salary;
                                    await setJob(job);
                                    localStorage.setItem(
                                      "postjob",
                                      JSON.stringify(job)
                                    );
                                    setPageIndex(3);
                                  }}
                                >
                                  Prev
                                </button>
                              </div>
                              <button
                                type="button"
                                class="bg-[#034488] my-5 px-4 py-1 mx-auto hover:bg-[#034488] text-white font-bold rounded-sm"
                                onClick={() => postJob(job)}
                                style={{ backgroundColor: "#034488" }}
                              >
                                Submit
                              </button>
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
