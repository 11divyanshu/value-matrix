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
import { getUserFromId } from "../../service/api";


const AddJob = () => {
  const [Alert, setAlert] = React.useState(null);
  const [skills, setSkills] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

  //Description
  const [desc, setDescState] = React.useState();
  const  [convertedDesc, setConvertedDesc] = useState(null);

   //eligibility
   const [eligible, setEligibleState] = React.useState();
   const  [convertedEl, setConvertedEl] = useState(null);

      //Perks
      const [perks, setPerksState] = React.useState();
      const  [convertedPerks, setConvertedPerks] = useState(null);


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
    salary: '',
    perks: ''


  });

  React.useEffect(() => {
    const initial = async () => {
      let e = await (localStorage.getItem("postjob"));
      let u = await JSON.parse(localStorage.getItem("user"));

      if (e === null || e === undefined) {
        localStorage.setItem("postjob", JSON.stringify(user))
      };

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
      let res =await  getUserFromId({ id: user._id }, user.access_token);
      console.log(res);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].company_permissions.add_jobs === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();  
  }, []);

  const postJob = async (values) => {
    let access_token = localStorage.getItem("access_token");
    let user = JSON.parse(localStorage.getItem("user"));

    values.user_id = user._id;
    console.log(values);
    let res = await postJobAPI(values, access_token);
    if (res) {
      setAlert(true);
    }
    else {
      setAlert(false);
    }

    localStorage.removeItem("postjob");
    setUser({});
    setSkills([]);
  };

  const saveBasic = async (values) => {
    let job = await JSON.parse(localStorage.getItem("postjob"));

    console.log(values)

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
      title: "EditProfile",
      text: "Details Updated Succesfully",
      button: "Continue",
    });

  }

  //Perks Editor
  const onPerksEditorStateChange = (state) =>{
    setPerksState(state);
    convertPerksToHTML();
   }

   const convertPerksToHTML = async() => {
    let currentContentAsHTML = convertToHTML(perks.getCurrentContent());
    setConvertedPerks(currentContentAsHTML);
    // console.log(currentContentAsHTML)
    const job =  JSON.parse(await localStorage.getItem("postjob"));
    job.perks = currentContentAsHTML ; 
    setUser(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
  }



  //description Editor

   const onDescEditorStateChange = (state) =>{
    setDescState(state);
    convertDescToHTML();
   }

   const convertDescToHTML = async() => {
    let currentContentAsHTML = convertToHTML(desc.getCurrentContent());
    setConvertedDesc(currentContentAsHTML);
    // console.log(currentContentAsHTML)

    const job =  JSON.parse(await localStorage.getItem("postjob"));
    job.jobDesc = currentContentAsHTML ; 
    setUser(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
  }

  //Eligibility Editor



  const oneligibiltyStateChange = (state) => {
    setEligibleState(state);
  
    convertElToHTML();
    // console.log(editorState);
 
  }

  const convertElToHTML = async() => {
    let currentContentAsHTML = convertToHTML(eligible.getCurrentContent());
    setConvertedEl(currentContentAsHTML);
    console.log(currentContentAsHTML)

    const job =  JSON.parse(await localStorage.getItem("postjob"));
    job.eligibility = currentContentAsHTML ; 
    setUser(job);
    console.log(job);

    localStorage.setItem("postjob", JSON.stringify(job));
    
  }


  const saveEligible = async (content) => {

    

   
    localStorage.setItem("postjob", JSON.stringify(content));
    swal({
      icon: "success",
      title: "EditProfile",
      text: "Details Updated Succesfully",
      button: "Continue",
    });
  }


  const saveSalary = async (values) => {
    let job = await JSON.parse(localStorage.getItem("postjob"));

    job.salary = values.values.salary;
 



    console.log(job);

    setUser(job);
    localStorage.setItem("postjob", JSON.stringify(job));
    swal({
      icon: "success",
      title: "EditProfile",
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

  }

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
                  jobTitle: user ? user.jobTitle : '',
                  jobDesc: user ? user.jobDesc : '',
                  location: user ? user.location : '',
                  jobType: user ? user.jobType : '',
                  validTill: user ? user.validTill : '',
                  hiringOrganization: user ? user.hiringOrganization : '',

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
                          class="bg-blue-500 my-7 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg" onClick={() => saveBasic(values)}
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
                  eligibility: user.eligibility ? user.eligibility : '',
                  skills: user.skills ? user.skills : [],



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
                          class="bg-blue-500 my-7 mx-2 px-5 py-3 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => saveEligible(user)}
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
                  salary: user.salary ? user.salary : '',
                  perks: user.perks ? user.perks : '',

                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.salary || values.salary.trim() === "") {
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
                            wrapperStyle={{ width: "75%",margin:"0 auto", border: "1px solid black" }}

                             onEditorStateChange={onPerksEditorStateChange}
                          />
                        </div>
                        <button

                          class="bg-blue-500 my-5 px-5 py-3 my-5 mx-4 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => saveSalary(values)}
                        >
                          Save
                        </button>
                        <button

                          class="bg-blue-500 my-5 px-5 py-3 my-5 mx-4 hover:bg-blue-700 text-white font-bold rounded-lg"
                          onClick={() => postJob(user)}
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
          onSubmit={postJob}
        >
          {(values) => {
            return (
<<<<<<< HEAD
              // <Form className="w-full">
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Job Title</label>
              //     <Field
              //       name="jobTitle"
              //       type="text"
              //       placeholder=""
              //       className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
              //     />
              //     <ErrorMessage
              //       name="jobTitle"
              //       component="div"
              //       className="text-red-600 text-sm w-full"
              //     />
              //   </div>
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Job Description</label>
              //     <Field
              //       name="jobDesc"
              //       type="text"
              //       placeholder=""
              //       className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
              //     />
              //     <ErrorMessage
              //       name="jobDesc"
              //       component="div"
              //       className="text-red-600 text-sm w-full"
              //     />
              //   </div>
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Job Location</label>
              //     <Field
              //       name="location"
              //       type="text"
              //       placeholder=""
              //       className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
              //     />
              //     <ErrorMessage
              //       name="location"
              //       component="div"
              //       className="text-red-600 text-sm w-full"
              //     />
              //   </div>
              //   <div className="my-5 space-y-3">
              //     <label>Job Type:</label>
              //     <div
              //       role="group"
              //       aria-labelledby="my-radio-group"
              //       className="space-x-5 my-3"
              //     >
              //       <label>
              //         <Field
              //           type="radio"
              //           name="jobType"
              //           value="Full-Time"
              //           className="mr-2"
              //         />
              //         Full-Time
              //       </label>
              //       <label>
              //         <Field
              //           type="radio"
              //           name="jobType"
              //           value="Part-Time"
              //           className="mr-2"
              //         />
              //         Part-Time
              //       </label>
              //       <label>
              //         <Field
              //           type="radio"
              //           name="jobType"
              //           value="Internship"
              //           className="mr-2"
              //         />
              //         Internship
              //       </label>
              //       <label>
              //         <Field
              //           type="radio"
              //           name="jobType"
              //           value="Freelancing"
              //           className="mr-2"
              //         />
              //         Freelancing
              //       </label>
              //     </div>
              //   </div>
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">
              //       Applications Open Till :{" "}
              //     </label>
              //     <Field
              //       name="validTill"
              //       type="date"
              //       placeholder=""
              //       className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
              //       min={Date.now()}
              //     />
              //   </div>
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Hiring Organization</label>
              //     <Field
              //       name="hiringOrganization"
              //       type="text"
              //       placeholder=""
              //       className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
              //     />
              //     <ErrorMessage
              //       name="hiringOrganization"
              //       component="div"
              //       className="text-red-600 text-sm w-full"
              //     />
              //   </div>
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Basic Salary</label>
              //     <Field
              //       name="basicSalary"
              //       type="number"
              //       placeholder=""
              //       className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
              //     />
              //     <ErrorMessage
              //       name="basicSalary"
              //       component="div"
              //       className="text-red-600 text-sm w-full"
              //     />
              //   </div>
              //   <button
              //     type="submit"
              //     className="bg-blue-500 my-x-7p-5 px-2 py-1 rounded-sm text-white"
              //   >
lg       //     Submit
              //   </button>
              // </Form>
=======
              <Form className="w-full">
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Job Title</label>
                  <Field
                    name="jobTitle"
                    type="text"
                    placeholder=""
                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                    placeholder=""
                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                    min={Date.now()}
                  />
                </div>
                <div className="my-5 space-y-3 w-full">
                  <label className="block w-full">Hiring Organization</label>
                  <Field
                    name="hiringOrganization"
                    type="text"
                    placeholder=""
                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                  />
                  <ErrorMessage
                    name="basicSalary"
                    component="div"
                    className="text-red-600 text-sm w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 myx-7 p-5 px-2 py-1 rounded-sm text-white"
                >
  lg        Submit
                </button>
              </Form>
>>>>>>> 57aa91daf23d4623b2a0ac3766ccebb3bf7a9fc2
            );
          }}
        </Formik>
      </div> */}

      {/* <div class="flex items-start w-full py-5">
        <div class="flex items-start">
          <ul class="nav nav-tabs flex flex-col flex-wrap list-none border-b-0 pl-0 mr-4" id="tabs-tabVertical"
            role="tablist">
            <li class="nav-item flex-grow text-center" role="presentation">
              <a href="#tabs-homeVertical" class="
          nav-link
          block
          font-medium
          text-xs
          leading-tight
          uppercase
          border-x-0 border-t-0 border-b-2 border-transparent
          px-6
          py-3
          my-2
          hover:border-transparent hover:bg-gray-100
          focus:border-transparent
          active
        " id="tabs-home-tabVertical" data-bs-toggle="pill" data-bs-target="#tabs-homeVertical" role="tab"
                aria-controls="tabs-homeVertical" aria-selected="true">Home</a>
            </li>
            <li class="nav-item flex-grow text-center" role="presentation">
              <a href="#tabs-profileVertical" class="
          nav-link
          block
          font-medium
          text-xs
          leading-tight
          uppercase
          border-x-0 border-t-0 border-b-2 border-transparent
          px-6
          py-3
          my-2
          hover:border-transparent hover:bg-gray-100
          focus:border-transparent
        " id="tabs-profile-tabVertical" data-bs-toggle="pill" data-bs-target="#tabs-profileVertical" role="tab"
                aria-controls="tabs-profileVertical" aria-selected="false">Profile</a>
            </li>
            <li class="nav-item flex-grow text-center" role="presentation">
              <a href="#tabs-messagesVertical" class="
          nav-link
          block
          font-medium
          text-xs
          leading-tight
          uppercase
          border-x-0 border-t-0 border-b-2 border-transparent
          px-6
          py-3
          my-2
          hover:border-transparent hover:bg-gray-100
          focus:border-transparent
        " id="tabs-messages-tabVertical" data-bs-toggle="pill" data-bs-target="#tabs-messagesVertical" role="tab"
                aria-controls="tabs-messagesVertical" aria-selected="false">Messages</a>
            </li>
          </ul>
          <div class="tab-content" id="tabs-tabContentVertical">


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
              onSubmit={postJob}
            >
              {(values) => {
                return (
                  <div>

                    <div class="tab-pane fade show active" id="tabs-homeVertical" role="tabpanel"
                      aria-labelledby="tabs-home-tabVertical">
                      <Form className="w-full">
                        <div
                          class="tab-pane fade p-5 w-full shadow-md mx-auto"
                          id="tabs-homeVertical"
                          role="tabpanel"
                          aria-labelledby="tabs-home-tabVertical"
                        >
                          <div className="bg-white text-black p-3">
                            <div className="my-5 space-y-3 w-full" id="home">
                              <label className="block w-full">Job Title</label>
                              <Field
                                name="jobTitle"
                                type="text"
                                placeholder=""
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                                placeholder=""
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                                min={Date.now()}
                              />
                            </div>
                            <div className="my-5 space-y-3 w-full">
                              <label className="block w-full">Hiring Organization</label>
                              <Field
                                name="hiringOrganization"
                                type="text"
                                placeholder=""
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                              />
                              <ErrorMessage
                                name="basicSalary"
                                component="div"
                                className="text-red-600 text-sm w-full"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          class="tab-pane fade"
                          id="tabs-profileVertical"
                          role="tabpanel"
                          aria-labelledby="tabs-profile-tabVertical"
                        >
                          <div className="bg-white text-black p-3">
                            <h1 id="eligibilty" className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700">
                              Eligibility
                            </h1>


                            <div className="my-5 space-y-3 w-full">
                              <label className="block w-full">Minimum Eligibility</label>
                              <Field
                                name="eligibility"
                                type="textarea"
                                placeholder=""
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
                              />
                              <ErrorMessage
                                name="eligibility"
                                component="div"
                                className="text-red-600 text-sm w-full"
                              />
                            </div>
                            <div className="my-5 space-y-3 w-full">
                              <label className="block w-full">Skills</label>
                              <input
                                className="w-3/4 text-600 my-3 mr-3"
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
                                        let res = await localStorage.getItem("candidateDetails");
                                        res = JSON.parse(res);
                                        res.skills = t;
                                        await localStorage.setItem(
                                          "candidateDetails",
                                          JSON.stringify(res)
                                        );
                                        setError(null);
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          class="tab-pane fade"
                          id="tabs-messagesVertical"
                          role="tabpanel"
                          aria-labelledby="tabs-profile-tabVertical"
                        >
                          <div className="bg-white text-black p-3">
                            <h1 id="salary" className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700">
                              Salary And Perks
                            </h1>

                            <div className="my-5 space-y-3 w-full">
                              <label className="block w-full">
                                Salary
                              </label>
                              <Field
                                name="salary"
                                type="text"
                                placeholder=""
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"

                              />
                            </div>

                            <div className="my-5 space-y-3 w-full">
                              <label className="block w-full">
                                Perks
                              </label>
                              <Field
                                name="perks"
                                type="text"
                                placeholder=""
                                className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"

                              />
                            </div>

                          </div>
                        </div>

                        <button
                          type="submit"
                          className="bg-blue-500 my-5x-7-5 px-2 py-1 rounded-sm text-white"
                      lg                        Submit
                        </button>
                      </Form>
                    </div>
                    <div class="tab-pane fade" id="tabs-profileVertical" role="tabpanel" aria-labelledby="tabs-profile-tabVertical">
                      Tab 2 content vertical
                    </div>
                    <div class="tab-pane fade" id="tabs-messagesVertical" role="tabpanel"
                      aria-labelledby="tabs-profile-tabVertical">
                      Tab 3 content vertical
                    </div>
                  </div>



                )
              }}
            </Formik>
          </div> */}







      {/* <div className="bg-white text-black p-3">
              <h1 className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700">
                Job Profile Details
              </h1>
              <div className="flex justify-between w-full space-x-32 my-5">
                <div class="flex justify-center">
                  <div class="mb-3 xl:w-96">
                    <label
                      for="exampleText0"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        shadow-md
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleText0"
                      placeholder="e.g. UI/UX Designer"
                    />
                  </div>
                </div>
                <div class="flex justify-center">
                  <div class="mb-3 xl:w-96">
                    <label
                      for="exampleText0"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      class="
        form-control
        block
        shadow-md
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleText0"
                      placeholder="e.g. Bangalore"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full space-x-32 my-5">
                <div class="flex justify-center">
                  <div class="mb-3 xl:w-96">
                    <label
                      for="exampleText0"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Job Type
                    </label>
                    <input
                      type="text"
                      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        shadow-md
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleText0"
                      placeholder="e.g. Internship"
                    />
                  </div>
                </div>
                <div class="flex justify-center">
                  <div class="mb-3 xl:w-96">
                    <label
                      for="exampleText0"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      class="
        form-control
        block
        shadow-md
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleText0"
                      placeholder="Bangalore"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex w-full">
                  <div class="mb-3 xl:w-full">
                    <label
                      for="exampleFormControlTextarea1"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleFormControlTextarea1"
                      rows="3"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div>
                <div class="flex w-full">
                  <div class="mb-3 xl:w-full">
                    <label
                      for="exampleFormControlTextarea1"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Requirements
                    </label>
                    <textarea
                      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleFormControlTextarea1"
                      rows="3"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div> */}

      {/* <div
            class="tab-pane fade"
            id="tabs-profileVertical"
            role="tabpanel"
            aria-labelledby="tabs-profile-tabVertical"
          >
            <div className="bg-white text-black p-3">
              <h1 className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700">
                Eligibility
              </h1>
              <div>
                <div class="flex w-full py-4">
                  <div class="mb-3 xl:w-full">
                    <label
                      for="exampleFormControlTextarea1"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Minimum Eligibility
                    </label>
                    <textarea
                      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleFormControlTextarea1"
                      rows="3"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="mb-3 xl:w-96">
                  <label
                    for="exampleText0"
                    class="form-label inline-block mb-2 text-gray-700"
                  >
                    Skills
                  </label>
                  <input
                    type="text"
                    class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        shadow-md
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                    id="exampleText0"
                    placeholder="e.g. Figma"
                  />
                </div>
              </div>
            </div>
          </div> */}
      {/* <div
            class="tab-pane fade"
            id="tabs-messagesVertical"
            role="tabpanel"
            aria-labelledby="tabs-profile-tabVertical"
          >
            <div className="bg-white text-black p-3">
              <h1 className="text-xl border-b-[0.5px] pl-5  text-left px-5 border-gray-400 w-full font-bold text-gray-700">
                Salary And Perks
              </h1>
              <div class="flex my-4">
                <div class="mb-3 xl:w-96">
                  <label
                    for="exampleText0"
                    class="form-label inline-block mb-2 text-gray-700"
                  >
                    CTC
                  </label>
                  <input
                    type="text"
                    class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        shadow-md
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                    id="exampleText0"
                    placeholder="e.g. Figma"
                  />
                </div>
              </div>
              <div>
                <div class="flex w-full py-4">
                  <div class="mb-3 xl:w-full">
                    <label
                      for="exampleFormControlTextarea1"
                      class="form-label inline-block mb-2 text-gray-700"
                    >
                      Perks
                    </label>
                    <textarea
                      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                      id="exampleFormControlTextarea1"
                      rows="3"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
    </div>

  );
};

export default AddJob;
