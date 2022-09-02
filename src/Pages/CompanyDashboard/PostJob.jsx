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
import { getUserFromId } from "../../service/api";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import * as xlsx from "xlsx/xlsx.mjs";

const AddJob = () => {
  const [Alert, setAlert] = React.useState(null);
  const [skills, setSkills] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

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
        localStorage.setItem("postjob", JSON.stringify(user));
      }

      if (e !== "null" || e !== null) {
        setUser(JSON.parse(e));
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
      if (res && res.data && res.data.user && res.data.user.permissions && res.data.user.permissions.length>0 && res.data.user.permissions[0].company_permissions) {
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
              })
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
      console.log(values);
      let access_token = localStorage.getItem("access_token");
      let user = JSON.parse(localStorage.getItem("user"));

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
        setTimeout(() => {
          // window.location.reload();
        }, 3000);
      } else {
        setAlert(false);
      }

      // localStorage.removeItem("postjob");
      // setUser({});
      // setSkills([]);
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
    <div className="p-5 pb-9">
      <p className="text-2xl font-bold">Add Job</p>
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

      <div className="Verticaltab mx-auto w-full">
        <Tabs>
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
            {/* <Tab>
            <p>Title 4</p>
          </Tab>
          <Tab>
            <p>Title 5</p>
          </Tab> */}
          </TabList>

          <TabPanel>
            <div className="panel-content">
              <Formik
                initialValues={{
                  jobTitle: user ? user.jobTitle : "",
                  jobDesc: user ? user.jobDesc : "",
                  location: user ? user.location : "",
                  jobType: user ? user.jobType : "",
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
                        <h1
                          style={{ color: `var(--primary)` }}
                          className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700"
                        >
                          Job Details
                        </h1>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Job Title
                          </label>
                          <Field
                            name="jobTitle"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
                          />
                          <ErrorMessage
                            name="jobTitle"
                            component="div"
                            className="text-red-600 text-sm w-full"
                          />
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Job Description
                          </label>
                          {/* <Field
                            name="jobDesc"
                            type="text"
                            placeholder=""
                            className="border-[0.5px]  rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                          />
                          <ErrorMessage
                            name="jobDesc"
                            component="div"
                            className="text-red-600 text-sm w-full"
                          /> */}
                          <Editor
                            editorState={desc}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              margin: "0 auto",
                              border: "1px solid black",
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
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
                          />
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-600 text-sm w-full"
                          />
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 mx-auto block">
                            Job Type:
                          </label>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="space-x-5 my-3"
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
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
                          />
                          <ErrorMessage
                            name="hiringOrganization"
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
                // validate={(values) => {
                //   const errors = {};
                //   if (!values.jobTitle || values.jobTitle.trim() === "") {
                //     errors.jobTitle = "Required !";
                //   }
                //   if (!values.jobDesc || values.jobDesc.trim() === "") {
                //     errors.jobDesc = "Required !";
                //   }
                //   if (!values.location || values.location.trim() === "") {
                //     errors.location = "Required !";
                //   }
                //   if (
                //     !values.hiringOrganization ||
                //     values.hiringOrganization.trim() === ""
                //   ) {
                //     errors.hiringOrganization = "Required !";
                //   }
                //   return errors;
                // }}
                // onSubmit={postJob}
              >
                {(values) => {
                  return (
                    <div>
                      <Form className="w-full mt-9 ">
                        <h1
                          style={{ color: `var(--primary)` }}
                          className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold "
                        >
                          Eligibilty
                        </h1>
                        <div className="mt-4">
                          <label className="text-left w-3/4 mx-auto block">
                            Minimum Eligibility
                          </label>
                          {/* <Field
                            name="eligibility"
                            type="textarea"
                            placeholder=""
                            className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
                          />
                          <ErrorMessage
                            name="eligibility"
                            component="div"
                            className="text-red-600 text-sm w-full"
                          /> */}

                          <Editor
                            editorState={eligible}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              margin: "0 auto",
                              border: "1px solid black",
                            }}
                            onEditorStateChange={oneligibiltyStateChange}
                          />
                          {/* <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                          />; */}
                        </div>
                        <div className="my-7 space-y-3 w-full block">
                          <label className="text-left w-3/4 mx-auto block">
                            Skills
                          </label>
                          <input
                            className="w-3/4 text-600 my-3 block mx-auto"
                            style={{ borderRadius: "10px" }}
                            type="text"
                            ref={inputRef}
                            onChange={() => {
                              if (inputRef.current) {
                                const res = skills.findIndex((el) => {
                                  return (
                                    el.toLowerCase() ===
                                    inputRef.current.value.toLowerCase()
                                  );
                                });
                                if (res !== -1) {
                                  setDisabled(true);
                                  setError("Already added");
                                } else {
                                  setDisabled(false);
                                  setError(null);
                                }
                              }
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" && disabled === false) {
                                if (inputRef.current) {
                                  if (inputRef.current.value !== "") {
                                    let t = skills;
                                    await setSkills([
                                      ...skills,
                                      inputRef.current.value,
                                    ]);
                                    t.push(inputRef.current.value);
                                    console.log(t);
                                    inputRef.current.value = "";
                                    let res = await localStorage.getItem(
                                      "postjob"
                                    );
                                    res = JSON.parse(res);
                                    res.skills = t;
                                    await localStorage.setItem(
                                      "postjob",
                                      JSON.stringify(res)
                                    );
                                    setError(null);
                                  }
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="bg-blue-600 rounded-sm text-white  py-2 px-3"
                            disabled={disabled}
                            onClick={async () => {
                              if (
                                inputRef.current &&
                                inputRef.current.value !== ""
                              ) {
                                let t = skills;
                                await setSkills([
                                  ...skills,
                                  inputRef.current.value,
                                ]);
                                t.push(inputRef.current.value);
                                inputRef.current.value = "";
                                let res = await localStorage.getItem("postjob");
                                res = JSON.parse(res);
                                res.skills = t;
                                await localStorage.setItem(
                                  "postjob",
                                  JSON.stringify(res)
                                );
                                setError(null);
                              }
                            }}
                          >
                            Add
                          </button>

                          <div className="flex flex-wrap mx-5">
                            {skills &&
                              skills.map((item, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="bg-gray-400 mr-3 my-2 text-black py-1 px-2 flex items-center space-x-3"
                                  >
                                    <p>{item}</p>
                                    <p
                                      className="cursor-pointer"
                                      onClick={async () => {
                                        const res1 = skills.filter((el) => {
                                          return el !== item;
                                        });
                                        let res = await localStorage.getItem(
                                          "postjob"
                                        );
                                        res = JSON.parse(res);
                                        res.skills = res1;
                                        await localStorage.setItem(
                                          "postjob",
                                          JSON.stringify(res)
                                        );
                                        setSkills(res1);
                                      }}
                                    >
                                      <AiOutlineClose />
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        <button
                          type="submit"
                          class="bg-blue-500 my-7 mx-2 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg"
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
            <div className="panel-content text-left ml-5 p-3">
              <div className="my-3 text-left">
                <p>Add Candidate Details Sheet</p>
                <p className="text-sm">
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
                  className="bg-blue-500 text-white rounded-sm px-2 py-1"
                  onClick={() => {
                    setShowCandidateForm(true);
                  }}
                >
                  Add User
                </button>
                <label
                  for="candidatesInput"
                  className="cursor-pointer bg-blue-500 text-white rounded-sm px-2 py-1"
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
                    className="bg-blue-500 text-white rounded-sm px-2 py-1"
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
                        return el.Contact === values.Contact;
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
                          <div className="flex my-2 flex-wrap text-left">
                            <div className="w-1/2">
                              <label>First Name</label>
                              <Field
                                name="FirstName"
                                type="text"
                                className="text-600 rounded-sm block"
                              />
                              <ErrorMessage name="FirstName" component="div" />
                            </div>
                            <div className="w-1/2">
                              <label>Last Name</label>
                              <Field
                                name="LastName"
                                type="text"
                                className="text-600 rounded-sm block"
                              />
                              <ErrorMessage name="LastName" component="div" />
                            </div>
                          </div>
                          <div className="flex my-2 flex-wrap text-left">
                            <div className="w-1/2">
                              <label>Email</label>
                              <Field
                                name="Email"
                                type="text"
                                className="text-600 rounded-sm block"
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
                                className="text-600 rounded-sm block"
                              />
                              <ErrorMessage
                                name="Contact"
                                component="div"
                                className="text-sm text-red-500"
                              />
                            </div>
                          </div>
                          <div className="my-2 text-left pr-10">
                            <label>Address</label>
                            <Field
                              name="Address"
                              type="text"
                              className="text-600 rounded-sm block w-full"
                            />
                          </div>
                          <div>
                            <button
                              className="bg-blue-500 text-white rounded-sm px-2 py-1 my-2"
                              type="submit"
                            >
                              Add
                            </button>
                            <button
                              className="bg-blue-500 text-white rounded-sm px-2 py-1 my-2 mx-4"
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
                  <div>
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
                  <div>
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
                        <h1
                          style={{ color: `var(--primary)` }}
                          className="text-xl border-b-[0.5px] px-3  text-left border-gray-400 w-full font-bold text-gray-700"
                        >
                          Salary and Perks
                        </h1>
                        <div className="my-7 mt-9 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Salary
                          </label>
                          <Field
                            name="salary"
                            type="number"
                            placeholder=""
                            className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
                          />
                        </div>

                        <div className="my-5 space-y-3 w-full">
                          <label className="text-left w-3/4 mx-auto block">
                            Perks
                          </label>
                          {/* <Field
                            name="perks"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"

                          /> */}
                          <Editor
                            editorState={perks}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              margin: "0 auto",
                              border: "1px solid black",
                            }}
                            onEditorStateChange={onPerksEditorStateChange}
                          />
                        </div>
                        <button
                          class="bg-blue-500 my-5 px-5 py-3 mx-4 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => saveSalary(values)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          class="bg-blue-500 my-5 px-5 py-3 mx-4 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => postJob(user)}
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
        </Tabs>
      </div>





   
    </div>
  );
};

export default AddJob;
