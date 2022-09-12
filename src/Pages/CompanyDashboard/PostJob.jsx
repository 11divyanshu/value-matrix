import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { postJobAPI, sendJobInvitations } from "../../service/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../../assets/stylesheet/VerticalTabs.scss";
import swal from "sweetalert";
import { AiOutlineClose } from "react-icons/ai";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromId, getSkills } from "../../service/api";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import * as xlsx from "xlsx/xlsx.mjs";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";

const AddJob = () => {
  const [Alert, setAlert] = React.useState(null);
  const [skills, setSkills] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

  // Skills
  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);

  const inputSkillRef = React.useRef(null);

  //Description
  const [desc, setDescState] = React.useState();
  const [convertedDesc, setConvertedDesc] = useState(null);

  //eligibility
  const [eligible, setEligibleState] = React.useState();
  const [convertedEl, setConvertedEl] = useState(null);

  //Perks
  const [perks, setPerksState] = React.useState();
  const [convertedPerks, setConvertedPerks] = useState(null);

  // Candidate Xl Sheet Input
  const candidateInputRef = React.useState(null);

  const inputRef = React.useRef(null);

  const [submitError, setSubmitError] = React.useState(null);
  const [user, setUser] = useState({
    jobTitle: "",
    jobDesc: "",
    location: "",
    jobType: "Full-time",
    validTill: "",
    hiringOrganization: "",
    eligibility: "",
    skills: [],
    salary: "",
    perks: "",
  });

  React.useEffect(() => {
    const initial = async () => {
      let e = await localStorage.getItem("postjob");
      let u = await JSON.parse(localStorage.getItem("user"));

      if (e === null || e === undefined) {
        localStorage.setItem("postjob", JSON.stringify(e));
      }

      if (e !== "null" || e !== null) {
        setUser(JSON.parse(e));
      }
      let p = JSON.parse(await localStorage.getItem("prof"));
      let user = await JSON.parse(await localStorage.getItem("user"));

      let res = await getSkills({ user_id: user._id }, user.access_token);
      console.log(res);
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
        if (p) {
          setProf(p);
        } else {
          await setProf(new Array(res.data.length).fill(0));
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

  const navigate = useNavigate();

  React.useState(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      console.log(res);
      if (
        res &&
        res.data &&
        res.data.user &&
        res.data.user.permissions &&
        res.data.user.permissions.length > 0 &&
        res.data.user.permissions[0].company_permissions
      ) {
        if (
          res.data.user.permissions[0].company_permissions.add_jobs === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();
  }, []);

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

  // Handle Candidates File Upload
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

  const postJob = async (values) => {
    try {
      let skills = dbSkills.filter((el) => {
        return el.proficiency > 0;
      });
      let access_token = localStorage.getItem("access_token");
      let user = JSON.parse(localStorage.getItem("user"));

      values.skills = skills;
      values.user_id = user._id;

      let res = await postJobAPI(values, access_token);

      if (selectedData.length > 0) {
        let res1 = sendJobInvitations(
          {
            job_id: res.data.job._id,
            candidates: selectedData,
            user_id: user._id,
          },
          access_token
        );
      }
      if (res) {
        setAlert(true);
        localStorage.removeItem("postjob");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setAlert(false);
      }
    } catch (error) {
      console.log(error);
      setAlert(false);
    }
  };

  const saveBasic = async (values) => {
    let job = await JSON.parse(localStorage.getItem("postjob"));

    console.log(values);

    //   setUser ({

    //     jobTitle : values.values.jobTitle ,
    //    hiringOrganization  : values.values.hiringOrganization ,
    //    jobType : values.values.jobType,
    //    jobDesc : values.values.jobDesc,
    //    location : values.values.location,
    //    user_id : values.values.user_id,
    //    validTill : values.values.validTill
    // });

    // job=values.values;

    job.jobTitle = values.values.jobTitle;
    job.hiringOrganization = values.values.hiringOrganization;
    job.jobType = values.values.jobType;
    job.location = values.values.location;
    job.user_id = values.values.user_id;
    job.validTill = values.values.validTill;
    job.reqApp = values.values.reqApp;

    setUser(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
    swal({
      icon: "success",
      title: "Basic Details",
      text: "Details Updated Succesfully",
      button: "Continue",
    });
  };

  //Perks Editor
  const onPerksEditorStateChange = (state) => {
    setPerksState(state);
    convertPerksToHTML();
  };

  const convertPerksToHTML = async () => {
    let currentContentAsHTML = convertToHTML(perks.getCurrentContent());
    setConvertedPerks(currentContentAsHTML);
    // console.log(currentContentAsHTML)
    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.perks = currentContentAsHTML;
    setUser(job);
    console.log(job);

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
    // console.log(currentContentAsHTML)

    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.jobDesc = currentContentAsHTML;
    setUser(job);
    console.log(job);

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
    console.log(currentContentAsHTML);

    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.eligibility = currentContentAsHTML;
    setUser(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
  };

  const saveEligible = async (content) => {
    localStorage.setItem("postjob", JSON.stringify(content));
    swal({
      icon: "success",
      title: "Saved",
      text: "Details Updated Succesfully",
      button: "Continue",
    });
  };

  const saveSalary = async (values) => {
    let job = await JSON.parse(localStorage.getItem("postjob"));

    job.salary = values.values.salary;

    console.log(job);

    setUser(job);
    localStorage.setItem("postjob", JSON.stringify(job));
    swal({
      icon: "success",
      title: "Job Salary",
      text: "Details Updated Succesfully",
      button: "Continue",
    });

    // await postJob(job).then(() => {
    //   localStorage.removeItem("postjob");
    //   setUser({});
    //   setSkills([]);
    //   swal({
    //     icon: "success",
    //     title: "EditProfile",
    //     text: "Details Updated Succesfully",
    //     button: "Continue",
    //   });
    // })
  };

  return (
    <div className=" mx-5 my-4 ">
      <p className="text-md font-bold pr-5">1 of 2: Job Details</p>
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

      <div className="flex w-full">
        <div className="w-3/4 shadow-md mx-3">
          <Formik
            initialValues={{
              jobTitle: user ? user.jobTitle : "",
              jobDesc: user ? user.jobDesc : "",
              location: user ? user.location : "",
              jobType: user ? user.jobType : "",
              reqApp: user ? user.reqApp : "",
              validTill: user ? user.validTill : "",
              hiringOrganization: user ? user.hiringOrganization : "",
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
              if (
                !values.jobType ||
                values.jobType.trim() === ""
              ) {
                errors.jobType = "Required !";
              }
              if (values.validTill < new Date()) {
                errors.start_date =
                  "Valid Till Date should be greater than today's date";
              }
              return errors;
            }}
          >
            {(values) => {
              return (
                <div className="w-full mt-9">
                  <Form className="w-full mt-5">
                    <div className="my-7 space-y-3 w-full">
                      <label className="text-left w-3/4 mx-auto block">
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
                      <label className="text-left w-3/4 mb-3 mx-auto block">
                        Job Description
                      </label>

                      <Editor
                        editorState={desc}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        wrapperStyle={{
                          width: "75%",
                          margin: "0 auto",
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
                      <label className="text-left w-3/4 mx-auto block">
                        Job Location
                      </label>
                      <Field
                        name="location"
                        type="text"
                        placeholder=""
                        className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                        style={{ borderRadius: "5px" }}
                      />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="text-red-600 text-sm w-full text-left mr-auto"
                      />
                    </div>
                    <div className="my-7 space-y-3">
                      <label className="text-left w-3/4 mx-auto block">
                        Job Type:
                      </label>
                      <div
                        role="group"
                        aria-labelledby="my-radio-group"
                        className="space-x-5 my-3 w-3/4 mr-auto -ml-6"
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
                      <label className="text-left w-3/4 mx-auto block">
                        Applications Open Till :{" "}
                      </label>
                      <Field
                        name="validTill"
                        type="date"
                        placeholder=""
                        className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                        min={Date.now()}
                      />
                    </div>
                    <div className="my-7 space-y-3 w-full">
                      <label className="text-left w-3/4 mx-auto block">
                        Hiring Organization
                      </label>
                      <Field
                        name="hiringOrganization"
                        type="text"
                        placeholder=""
                        className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                      />
                      <ErrorMessage
                        name="hiringOrganization"
                        component="div"
                        className="text-red-600 text-sm w-full"
                      />
                    </div>

                    <div className="my-7 space-y-3 w-full">
                      <label className="text-left w-3/4 mx-auto block">
                        Candidates Required
                      </label>
                      <Field
                        name="reqApp"
                        type="text"
                        placeholder=""
                        className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                      />
                      <ErrorMessage
                        name="reqApp"
                        component="div"
                        className="text-red-600 text-sm w-full"
                      />
                    </div>

                    <button
                      type="submit"
                      class="bg-blue-500 my-7 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg"
                      onClick={() => saveBasic(values)}
                    >
                      Save
                    </button>
                  </Form>
                </div>
              );
            }}
          </Formik>
        </div>
        <div className="w-1/4 shadow-md mx-3">
          <div>
            <Formik
              initialValues={{
                picked: "One",
                toggle: false,
                checked: [],
              }}
              onSubmit={async (values) => {
                console.log(values);
              }}
            >
              {({ values }) => (
                <Form className="text-center px-5 py-3 bg-white">
                  <div className="text-2xl text-center font-bold font-gray-600">
                    Apply Filters
                  </div>

                  <div className="flex-column content-center text-left align-items-center  py-3 my-5 w-3/4 mx-auto  border-t border-gray-300">
                    <label className="font-semibold text-md my-3">
                      Job-Type
                    </label>
                    <br />
                    <Field
                      className="rounded-lg w-full"
                      name="jobType"
                      as="select"
                    >
                      <option value="fulltime">Full time</option>
                      <option value="internship">Internship</option>
                      <option value="parttime">Part Time</option>
                    </Field>
                  </div>

                  <div className="flex-column content-center text-left align-items-center  py-3 my-5 w-3/4 mx-auto ">
                    <label className="font-semibold text-md my-3">
                      Location
                    </label>
                    <Field
                      type="text"
                      className="block  rounded-lg py-1 md:w-3/4 w-full"
                      name="location"

                      // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}
                    />
                  </div>

                  <div className="flex-column content-center text-left align-items-center  py-3 my-5 w-5/6 mx-auto ">
                    <label className="font-semibold text-md my-3">
                      Pay Range
                    </label>
                    <div class="flex flex-col space-y-2 p-2 w-full">
                      <Field
                        type="range"
                        class="w-full"
                        name="salary"
                        min="1"
                        max="5"
                        step="1"
                      />
                      <ul class="flex justify-between w-full px-[10px]">
                        <li class="flex justify-center relative">
                          <span class="absolute">0</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">5k</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">10k</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">20k</span>
                        </li>
                        <li class="flex justify-center relative">
                          <span class="absolute">40k</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    className="shadow-lg rounded-lg my-4 px-4 py-2"
                    style={{ backgroundColor: "#034488", color: "#fff" }}
                    type="submit"
                    // onClick={() => applyFilter(values)}
                  >
                    Apply
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* <div className="Verticaltab w-full "> */}
      {/* <Tabs>
          <TabList>
            <Tab>
              <p>Home</p>
            </Tab>
            <Tab>
              <p>Eligibilty</p>
            </Tab>
            <Tab>
              <p>Invite Users</p>
            </Tab>
            <Tab>
              <p>Salary</p>
            </Tab>
           
          </TabList>

          <TabPanel>
            <div className="panel-content">
              <Formik
                initialValues={{
                  jobTitle: user ? user.jobTitle : "",
                  jobDesc: user ? user.jobDesc : "",
                  location: user ? user.location : "",
                  jobType: user ? user.jobType : "",
                  reqApp: user ? user.reqApp : "",
                  validTill: user ? user.validTill : "",
                  hiringOrganization: user ? user.hiringOrganization : "",
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
                {(values) => {
                  return (
                    <div className="w-full mt-9">
                      <Form className="w-full mt-5">
                       
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
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
                          <label className="text-left w-3/4 mb-3 mx-auto block">
                            Job Description
                          </label>
                          
                          <Editor
                            editorState={desc}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              margin: "0 auto",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "5px",
                            }}
                            editorStyle={{
                              minHeight: "200px",
                              paddingLeft:"1rem"
                            }}
                            onEditorStateChange={onDescEditorStateChange}
                          />
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Job Location
                          </label>
                          <Field
                            name="location"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                            style={{ borderRadius: "5px" }}
                          />
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-600 text-sm w-full text-left mr-auto"
                          />
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 mx-auto block">
                            Job Type:
                          </label>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="space-x-5 my-3 w-3/4 mr-auto -ml-6"
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
                          <label className="text-left w-3/4 mx-auto block">
                            Applications Open Till :{" "}
                          </label>
                          <Field
                            name="validTill"
                            type="date"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                            min={Date.now()}
                          />
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Hiring Organization
                          </label>
                          <Field
                            name="hiringOrganization"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                          />
                          <ErrorMessage
                            name="hiringOrganization"
                            component="div"
                            className="text-red-600 text-sm w-full"
                          />
                        </div>

                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Candidates Required
                          </label>
                          <Field
                            name="reqApp"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-1"
                          />
                          <ErrorMessage
                            name="reqApp"
                            component="div"
                            className="text-red-600 text-sm w-full"
                          />
                        </div>

                        <button
                          type="submit"
                          class="bg-blue-500 my-7 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => saveBasic(values)}
                        >
                          Save
                        </button>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="panel-content">
              <Formik
                initialValues={{
                  // eligibility: user.eligibility ? user.eligibility : '',
                  skills: user ? user.skills : [],
                }}
               
              >
                {(values) => {
                  return (
                    <div>
                      <Form className="w-full mt-9 ">
                       
                        <div className="mt-4">
                          <label className="text-left w-3/4 mx-auto mb-3 block">
                            Minimum Eligibility
                          </label>
                         

                          <Editor
                            editorState={eligible}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              margin: "0 auto",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "5px",
                            }}
                            editorStyle={{                              
                              minHeight: "200px",
                              paddingLeft:"1rem"
                            }}
                            onEditorStateChange={oneligibiltyStateChange}
                          />
                        
                        </div>

                      
                        <div className="my-7 space-y-3 w-full block">
                          <label className="text-left w-3/4 mx-auto block">
                            Skills
                          </label>
                          <div className="w-3/4 mx-auto">
                            <div className="my-3 px-4 flex items-center flex-wrap gap-y-3">
                              <input
                                type="text"
                                className="w-3/4 text-600 border-[0.5px] border-[#6b7280] p-2 mr-3"
                                placeholder="Search Skill..."
                                ref={inputSkillRef}
                                onChange={async () => {
                                  let role = new Set([]);
                                  if (
                                    inputSkillRef.current.value.trim() !== "" ||
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

                        <button
                          type="submit"
                          class="bg-[#034488] my-7 mx-2 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => saveEligible(user)}
                        >
                          Save
                        </button>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="panel-content text-left ml-5 p-3 w-3/4 mx-auto">
              <div className="my-3 text-left">
                <p>Add Candidate Details Sheet</p>
                <p className="text-sm mt-3">
                  ( Headers Conventions: FirstName, LastName, Email, Contact,
                  Address)
                </p>
                <p className="text-sm">
                  (Data must contain candidate's Email Address and Contact
                  Number)
                </p>
              </div>
              <div className="flex space-x-10">
                <button
                  className="bg-[#034488] text-white rounded-sm px-4 py-1"
                  onClick={() => {
                    setShowCandidateForm(true);
                  }}
                >
                  Add User
                </button>
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
                <div className="my-4">
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
                                style = {{borderRadius:"5px"}}
                              />
                              <ErrorMessage name="FirstName" component="div" />
                            </div>
                            <div className="w-1/2">
                              <label>Last Name</label>
                              <Field
                                name="LastName"
                                type="text"
                                className="text-600 rounded-sm block px-4 py-1"
                                style = {{borderRadius:"5px"}}
                              />
                              <ErrorMessage name="LastName" component="div" />
                            </div>
                          </div>
                          <div className="flex my-3 flex-wrap text-left">
                            <div className="w-1/2">
                              <label>Email</label>
                              <Field
                                name="Email"
                                type="text"
                                className="text-600 rounded-sm block px-4 py-1"
                                style = {{borderRadius:"5px"}}
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
                                style = {{borderRadius:"5px"}}
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
                              style = {{borderRadius:"5px"}}
                            />
                          </div>
                          <div>
                            <button
                              className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
                              type="submit"
                              style={{backgroundColor:"#034488"}}
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
              <div className="my-5">
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
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
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
              <div className="my-5">
                {candidateData.length > 0 && (
                  <div className="flex items-center w-full justify-between">
                    <p>Candidate Data ({candidateData.length})</p>
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
                    <table class="w-full">
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
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
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
                                        (item) => item.Email !== user.Email
                                      )
                                    );
                                    setSelectedData(
                                      selectedData.filter(
                                        (item) => item.Email !== user.Email
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
          </TabPanel>
          <TabPanel>
            <div className="panel-content">
              <Formik
                initialValues={{
                  salary: user ? user.salary : "",
                  perks: user ? user.perks : "",
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
                       
                        <div className="my-7 mt-9 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
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
                          <label className="text-left w-3/4 mb-3 mx-auto block">
                            Perks
                          </label>
                          
                          <Editor
                            editorState={perks}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              margin: "0 auto",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "5px",
                            }}
                            editorStyle={{
                              minHeight: "200px",
                              paddingLeft:"1rem",
                            }}
                            onEditorStateChange={onPerksEditorStateChange}
                          />
                        </div>
                        <button
                          class="bg-[#034488] my-5 px-4 py-1 mx-4 hover:bg-[#034488] text-white font-bold rounded-sm"
                          onClick={() => saveSalary(values)}
                          
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          class="bg-[#034488] my-5 px-4 py-1 mx-4 hover:bg-[#034488] text-white font-bold rounded-sm"
                          onClick={() => postJob(user)}
                          style={{backgroundColor:"#034488"}}
                        >
                          Submit
                        </button>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </TabPanel>
        </Tabs> */}
      {/* </div> */}
    </div>
  );
};

export default AddJob;