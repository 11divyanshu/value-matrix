import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { postJobAPI } from "../../service/api";

const AddJob = () => {
  const [Alert, setAlert] = React.useState(null);

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

      <div>
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
              // <Form className="w-full">
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Job Title</label>
              //     <Field
              //       name="jobTitle"
              //       type="text"
              //       placeholder=""
              //       className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
              //       className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
              //       className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
              //       className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
              //       min={Date.now()}
              //     />
              //   </div>
              //   <div className="my-5 space-y-3 w-full">
              //     <label className="block w-full">Hiring Organization</label>
              //     <Field
              //       name="hiringOrganization"
              //       type="text"
              //       placeholder=""
              //       className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
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
              //       className="border-[0.5px] border-gray-400 md:w-1/2 w-3/4 focus:outline-0 focus:border-0 p-1"
              //     />
              //     <ErrorMessage
              //       name="basicSalary"
              //       component="div"
              //       className="text-red-600 text-sm w-full"
              //     />
              //   </div>
              //   <button
              //     type="submit"
              //     className="bg-blue-500 px-2 py-1 rounded-sm text-white"
              //   >
              //     Submit
              //   </button>
              // </Form>

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
                  <div class="tab-pane fade show active" id="tabs-homeVertical" role="tabpanel"
                    aria-labelledby="tabs-home-tabVertical">
                    Tab 1 content vertical
                  </div>
                  <div class="tab-pane fade" id="tabs-profileVertical" role="tabpanel" aria-labelledby="tabs-profile-tabVertical">
                    Tab 2 content vertical
                  </div>
                  <div class="tab-pane fade" id="tabs-messagesVertical" role="tabpanel"
                    aria-labelledby="tabs-profile-tabVertical">
                    Tab 3 content vertical
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddJob;
