import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { postJobAPI } from "../../service/api";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "../../assets/stylesheet/VerticalTabs.scss"
import swal from "sweetalert";
import { AiOutlineClose } from "react-icons/ai";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from 'draft-convert';
import { Link, useNavigate } from "react-router-dom";
import { getJobById, updateJobAPI } from "../../service/api";
import DOMPurify from 'dompurify';
import { EditorState, convertToRaw, ContentState } from "draft-js";
// import ReactHtmlParser from "react-html-parser";

// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// );
import htmlToDraft from 'html-to-draftjs';
// const htmlToDraft = typeof window === 'object' && require('html-to-draftjs').default;



const UpdateJob = () => {
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

  // const resdetail=JSON.parse(localStorage.getItem("jobsdetail"))
  // const resdetail1=JSON.parse(localStorage.getItem("jobsdetails"))
  // resdetail1.map((item)=>{
  //   if(item._id===resdetail){
  //     console.log("match found");
  //     const require=item
  //     console.log(require);

  //   }
  // }

  // ,[])

  React.useEffect(() => {
    const id = localStorage.getItem("ids");
    setJobId(id);
    let access_token = localStorage.getItem("access_token");
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");


      let res = await getJobById(job_id, access_token);
      if (res) {
        //  setJob(res.data.job);
        console.log(res.data.job);


        


        //  setDescState(job.jobDesc)
        //  setPerksState(job.perks)
        //  setEligibleState(job.eligibility)

        await localStorage.setItem("postjob", JSON.stringify(res.data.job))
        await setJob(res.data.job);
        console.log(res.data.job);
        setState();
        //  if(res.data.job){

        //  }

      } else {
        console.log("no response")
      }
      console.log(job)
    }
    getData();
    const setState = async() => {
      
      let data = JSON.parse(await localStorage.getItem("postjob"));
      if (data) {

        setJob(data);
        setSkills(data.skills);

if(data.eligibility){


        const blocksFromHtml = htmlToDraft(data.eligibility);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
         const editorState = EditorState.createWithContent(contentState);
        setEligibleState(editorState);


        }

        if(data.jobDesc){


          const blocksFromHtml = htmlToDraft(data.jobDesc);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
           const editorState = EditorState.createWithContent(contentState);
          setDescState(editorState);
  
  
          }

          if(data.perks){


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
    }
    
  }, [job_id]);





  const title = require.jobTitle;


  const postJob = async (values) => {
    let access_token = localStorage.getItem("access_token");
    let jobs = JSON.parse(await localStorage.getItem("postjob"));

    
    const job_id=localStorage.getItem("ids");
    // values.user_id = job._id;
    // values.job_id = job_id;

   
    console.log(values);
    let res = await updateJobAPI(jobs, access_token);
    if (res) {
      setAlert(true);
    }
    else {
      setAlert(false);
    }

    localStorage.removeItem("postjob");
    setJob();
    setSkills([]);
  };

  const saveBasic = async (values) => {
    let job = await JSON.parse(localStorage.getItem("postjob"));

    console.log(values)

    //   setJob ({

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


    setJob(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
    swal({
      icon: "success",
      title: "Update Job",
      text: "Details Updated Succesfully",
      button: "Continue",
    });

  }

  //Perks Editor
  const onPerksEditorStateChange = (state) => {
    setPerksState(state);
    convertPerksToHTML();
  }

  const convertPerksToHTML = async () => {
    let currentContentAsHTML = convertToHTML(perks.getCurrentContent());
    setConvertedPerks(currentContentAsHTML);
    // console.log(currentContentAsHTML)
    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.perks = currentContentAsHTML;
    setJob(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
  }



  //description Editor

  const onDescEditorStateChange = (state) => {
    setDescState(state);
    convertDescToHTML();
  }

  const convertDescToHTML = async () => {
    let currentContentAsHTML = convertToHTML(desc.getCurrentContent());
    setConvertedDesc(currentContentAsHTML);
    // console.log(currentContentAsHTML)

    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.jobDesc = currentContentAsHTML;
    setJob(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
  }

  //Eligibility Editor



  const oneligibiltyStateChange = (state) => {
    setEligibleState(state);

    convertElToHTML();
    // console.log(editorState);

  }

  const convertElToHTML = async () => {
    let currentContentAsHTML = convertToHTML(eligible.getCurrentContent());
    setConvertedEl(currentContentAsHTML);
    console.log(currentContentAsHTML)

    const job = JSON.parse(await localStorage.getItem("postjob"));
    job.eligibility = currentContentAsHTML;
    setJob(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));

  }


  const saveEligible = async (content) => {




    localStorage.setItem("postjob", JSON.stringify(content));
    swal({
      icon: "success",
      title: "Update Job",
      text: "Details Updated Succesfully",
      button: "Continue",
    });
  }


  const saveSalary = async (values) => {
    let job = await JSON.parse(localStorage.getItem("postjob"));

    job.salary = values.values.salary;




    console.log(job);

    setJob(job);
    localStorage.setItem("postjob", JSON.stringify(job));
    swal({
      icon: "success",
      title: "Update Job",
      text: "Details Updated Succesfully",
      button: "Continue",
    });

    // await postJob(job).then(() => {
    //   localStorage.removeItem("postjob");
    //   setJob({});
    //   setSkills([]);
    //   swal({
    //     icon: "success",
    //     title: "Update Job",
    //     text: "Details Updated Succesfully",
    //     button: "Continue",
    //   });
    // })

  }



  // const UpdateJob = async (values) => {
  //   let access_token = localStorage.getItem("access_token");


  //   let job = localStorage.getItem("job");

  //   const job_id=JSON.parse(localStorage.getItem("ids"))
  //   values.user_id = job._id;
  //   values.job_id = job_id;


  //   let res = await updateJobAPI(values, access_token);
  //   if (res) {
  //     setAlert(true);
  //   }
  //   else{
  //     setAlert(false);
  //   }
  // };

  return (
    <div className="p-5 pb-9">
      <p className="text-2xl font-bold">Update Job</p>
      {Alert === true && (
        <div
          className="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
          role="alert"
        >
          Job Updated Successfully ! Check Here
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

      {/* <div>
        <Formik
          initialValues={{
            jobTitle: null,
            jobDesc: null,
            location: null,
            jobType: "Full-time",
            validTill: null,
            hiringOrganization: null,
            basicSalary: null,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.jobTitle || values.jobTitle.trim() === "") {
              errors.jobTitle = "Required !";
            }
            if (!values.jobDesc || values.jobDesc.trim() === "") {
              errors.jobDesc = "Required !";
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
          onSubmit={UpdateJob}
        >
          {(values) => {
            return (
              <Form className="w-full">
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Job Title</label>
                  <Field
                    name="jobTitle"
                    type="text"
                    placeholder= {title}
                    className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  />
                  <ErrorMessage
                    name="jobTitle"
                    component="div"
                    className="text-red-600 text-sm w-full"
                  />
                </div>
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Job Description</label>
                  <Field
                    name="jobDesc"
                    type="text"
                    placeholder={resdetail1.jobDesc}
                    className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  />
                  <ErrorMessage
                    name="jobDesc"
                    component="div"
                    className="text-red-600 text-sm w-full"
                  />
                </div>
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Job Location</label>
                  <Field
                    name="location"
                    type="text"
                    placeholder=""
                    className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-600 text-sm w-full"
                  />
                </div>
                <div className="my-5 space-y-3">
                  <label>Job Type:</label>
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
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">
                    Applications Open Till :{" "}
                  </label>
                  <Field
                    name="validTill"
                    type="date"
                    placeholder=""
                    className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                    min={Date.now()}
                  />
                </div>
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Hiring Organization</label>
                  <Field
                    name="hiringOrganization"
                    type="text"
                    placeholder=""
                    className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  />
                  <ErrorMessage
                    name="hiringOrganization"
                    component="div"
                    className="text-red-600 text-sm w-full"
                  />
                </div>
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Basic Salary</label>
                  <Field
                    name="basicSalary"
                    type="number"
                    placeholder=""
                    className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  />
                  <ErrorMessage
                    name="basicSalary"
                    component="div"
                    className="text-red-600 text-sm w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 px-2 py-1 rounded-sm text-white"
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div> */}

      {job ?

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
                    jobTitle: job ? job.jobTitle : '',
                    // jobDesc: job.jobDesc ? job.jobDesc : '',
                    location: job ? job.location : '',
                    jobType: job ? job.jobType : '',
                    validTill: job ? job.validTill : '',
                    hiringOrganization: job ? job.hiringOrganization : '',

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
                          <h1 style={{ color: `var(--primary)` }} className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700">
                            Job Details
                          </h1>
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 mx-auto block">Job Title</label>
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
                            <label className="text-left w-3/4 mx-auto block">Job Description</label>
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
                              wrapperStyle={{ width: "75%", margin: "0 auto", border: "1px solid black" }}

                              onEditorStateChange={onDescEditorStateChange}
                            />
                          </div>
                          <div className="my-7 space-y-3 w-full">
                            <label className="text-left w-3/4 mx-auto block">Job Location</label>
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
                            <label className="text-left w-3/4 mx-auto block">Job Type:</label>
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
                            <label className="text-left w-3/4 mx-auto block">Hiring Organization</label>
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
                            className="bg-blue-500 my-7 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg" onClick={() => saveBasic(values)}
                          >
                            Save
                          </button>
                        </Form>
                      </div>
                    )
                  }}</Formik>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="panel-content">
                <Formik
                  initialValues={{
                    skills: job.skills ? job.skills : [],



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
                          <h1 style={{ color: `var(--primary)` }} className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold ">
                            Eligibilty
                          </h1>
                          <div className="mt-4">
                            <label className="text-left w-3/4 mx-auto block">Minimum Eligibility</label>
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
                              wrapperStyle={{ width: "75%", margin: "0 auto", border: "1px solid black" }}

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
                            <label className="text-left w-3/4 mx-auto block">Skills</label>
                            <input
                              className="w-3/4 text-600 my-3 block mx-auto"
                              style={{ borderRadius: "10px" }}
                              type="text"
                              ref={inputRef}
                              onChange={() => {
                                if (inputRef.current) {
                                  const res = skills.findIndex((el) => {
                                    return (
                                      el.toLowerCase() === inputRef.current.value.toLowerCase()
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
                                      await setSkills([...skills, inputRef.current.value]);
                                      t.push(inputRef.current.value);
                                      console.log(t);
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
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="bg-blue-600 rounded-sm text-white  py-2 px-3"
                              disabled={disabled}
                              onClick={async () => {
                                if (inputRef.current && inputRef.current.value !== "") {
                                  let t = skills;
                                  await setSkills([...skills, inputRef.current.value]);
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
                                          let res = await localStorage.getItem("postjob");
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
                            className="bg-blue-500 my-7 mx-2 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg"
                            onClick={() => saveEligible(job)}
                          >
                            Save
                          </button>
                        </Form>
                      </div>
                    )
                  }}
                </Formik>
              </div>

            </TabPanel>
            <TabPanel>
              <div className="panel-content">
                <Formik
                  initialValues={{
                    salary: job.salary ? job.salary : '',
                    // perks: job.perks ? job.perks : '',

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
                          <h1 style={{ color: `var(--primary)` }} className="text-xl border-b-[0.5px] px-3  text-left border-gray-400 w-full font-bold text-gray-700">
                            Salary and Perks
                          </h1>
                          <div className="my-7 mt-9 space-y-3 w-full">
                            <label className="text-left w-3/4 mx-auto block">
                              Salary
                            </label>
                            <Field
                              name="salary"
                              type="text"
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
                              wrapperStyle={{ width: "75%", margin: "0 auto", border: "1px solid black" }}

                              onEditorStateChange={onPerksEditorStateChange}
                            />
                          </div>
                          <button

                            className="bg-blue-500 my-5 px-5 py-3 my-5 mx-4 hover:bg-blue-700 text-white font-bold rounded-lg"
                            onClick={() => saveSalary(values)}
                          >
                            Save
                          </button>
                          <button

                            className="bg-blue-500 my-5 px-5 py-3 my-5 mx-4 hover:bg-blue-700 text-white font-bold rounded-lg"
                            onClick={()=>postJob(job)}
                          >
                            Submit
                          </button>
                        </Form>
                      </div>
                    )
                  }}
                </Formik>
              </div>
            </TabPanel>



          </Tabs>
        </div>

        : <p>Loading</p>}
    </div>
  );
};

export default UpdateJob;
