import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";

import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { BsCalendar } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { submitCandidateDetails } from "../../../service/api";

const AssociationDetailForm = (props) => {
  const [associateDetail, setAssociateDetail] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [showError, setShowError] = React.useState(true);
  const [edit, setEdit] = React.useState(null);

  const resetBtn = React.useRef(null);

  const [initialValues, setInitialValues] = React.useState({
    title: null,
    // employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,
  });

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await localStorage.getItem("candidateDetails"));
      if (e === null) return null;
      let ed = e.associate;
      if (ed !== "null" || ed !== null) {
        setAssociateDetail(ed);
      }
      if (associateDetail === null) {
        setAssociateDetail([]);
      }
    };
    initial();
  }, []);

  return (
    <div>
      <div>
        <p className="font-bold text-lg">Association</p>
        <div>
          {associateDetail &&
            associateDetail.map((item, index) => {
              return (
                <div
                  className="my-2 shadow-md rounded-md p-2 bg-gray-100"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                    <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setInitialValues(item);
                        setShowForm(true);
                      }}
                    />
                    <AiOutlineDelete
                      className="text-red-600 cursor-pointer"
                      onClick={async () => {
                        setAssociateDetail(
                          associateDetail.filter((item, i) => i !== index)
                        );
                        let res = JSON.parse(
                          await localStorage.getItem("candidateDetails")
                        );
                        res.associate = associateDetail.filter(
                          (item, i) => i !== index
                        );
                        localStorage.setItem(
                          "candidateDetails",
                          JSON.stringify(res)
                        );
                      }}
                    />
                  </div>
                  {/* <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">
                      {item.employment_type}
                    </p>{" "}
                  </div> */}
                  <div className="flex flex-wrap justify-between w-full py-1 text-gray-800 ">
                    <div className="space-x-2 flex items-center">
                      <FaRegBuilding />
                      <p>{item.company_name}</p>
                    </div>
                    <div className="space-x-2 flex items-center">
                      <CgWorkAlt />
                      <p>{item.industry}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BsCalendar />
                      <p className="text-sm text-gray-600 mr-5">
                        {item.start_date} - {item.end_date}
                      </p>
                    </div>
                  </div>
                  {item.description && (
                    <div className="py-2">{item.description}</div>
                  )}
                </div>
              );
            })}
        </div>
        {showForm ? (
          <div className={`${!showForm ? "hidden" : "block"}`}>
            <p className="text-md font-semibold my-3">Add Association</p>
            <Formik
              initialValues={initialValues}
              validate={(values) => {
                if (showForm === false) return {};
                const errors = {};
                if (!values.title) {
                  errors.title = "Required";
                }
                // if (!values.employment_type) {
                //   errors.employment_type = "Required";
                // }
                if (!values.company_name) {
                  errors.company_name = "Required";
                }
                if (!values.location) {
                  errors.location = "Required";
                }
                if (values.start_date === null) {
                  errors.start_date = "Required !";
                }
                if (values.end_date === null) {
                  errors.end_date = "Required !";
                }
                if (values.start_date > new Date()) {
                  errors.start_date =
                    "Start date cannot be greater than today's date";
                }
                if (values.start_date > values.end_date) {
                  errors.end_date = "End date cannot be less than start date";
                }
                if (!values.industry) {
                  errors.industry = "Required";
                }
                return errors;
              }}
              onSubmit={async (values) => {
                let e = JSON.parse(
                  await localStorage.getItem("candidateDetails")
                );
                if (edit !== null) {
                  const temp = [...associateDetail];
                  temp[edit] = values;
                  await setAssociateDetail(temp);
                  e.associate = temp;
                  await localStorage.setItem(
                    "candidateDetails",
                    JSON.stringify(e)
                  );
                  await setEdit(null);
                  resetBtn.current.click();
                  return;
                }
                let temp = associateDetail;
                temp = temp === undefined ? [] : temp;
                console.log(temp);
                temp.push(values);
                await setAssociateDetail(temp);
                e.associate = temp;
                await localStorage.setItem(
                  "candidateDetails",
                  JSON.stringify(e)
                );
                await setInitialValues({
                  title: null,
                  // employment_type: "",
                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                resetBtn.current.click();
              }}
            >
              {({ values }) => {
                return (
                  <Form className="w-full py-4">
                  <div className="md:w-1/2  flex w-full  space-y-1 my-5">
                    <label className="font-semibold text-lg w-2/5 mx-2">Title </label>
                    <div className="w-4/5"><Field
                      name="title"
                      type="text"
                      placeholder="Ex. Manager"
                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                      style={{ borderRadius: "4px" }}
                      value={values.title}
                    />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div className="md:w-1/2  flex w-full  space-y-1 my-5">

                    <label className="font-semibold text-lg w-2/5 mx-2">Company </label>
                    <div className="w-4/5"><Field
                      name="company_name"
                      type="text"
                      placeholder="Ex. Microsoft"
                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                      style={{ borderRadius: "4px" }}
                      value={values.company_name}
                    />
                      <ErrorMessage
                        name="company_name"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2  flex w-full  space-y-1 my-5">
                    <label className="font-semibold text-lg w-2/5 mx-2">Location </label>
                    <div className="w-4/5"><Field
                      name="location"
                      type="text"
                      placeholder="Ex. London"
                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                      style={{ borderRadius: "4px" }}
                      value={values.location}
                    />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">


                    <label className="font-semibold text-lg w-2/5 mx-2">Work Period </label>

<div className="w-4/5 flex justify-between" style={{justifyContent:"space-between"}}>
                    <div className=" my-1  flex mr-5 align-middle">
                      <label className="font-semibold text-lg py-2">Start From</label>
                      <div className="">
                        <Field
                          name="start_date"
                          type="month"
                          className="block border-gray-400 py-2 w-full mx-2 border-[0.5px] border-[#6b7280]"
                          style={{
                            borderRadius: "4px",
                            border: "0.5px solid",
                          }}
                          value={values.start_date}
                        />
                        <ErrorMessage
                          name="start_date"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>
                    </div>
                    <div className=" my-1  flex ml-2  align-middle">
                      <label className="font-semibold text-lg mx-2 py-2">End At</label>
                      <div className="">
                        <Field
                          name="end_date"
                          type="month"
                          className="block border-gray-400 py-2  border-[0.5px] border-[#6b7280]"
                          style={{
                            borderRadius: "4px",
                            border: "0.5px solid",
                          }}
                          value={values.end_date}
                        />
                        <ErrorMessage
                          name="end_date"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className="md:w-1/2  flex w-full  space-y-1 my-5">
                    <label className="font-semibold text-lg w-2/5 mx-2">Industry </label>
                    <div className="w-4/5"><Field
                      name="industry"
                      type="text"
                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                      style={{ borderRadius: "4px" }}
                      value={values.industry}
                    />
                      <ErrorMessage
                        name="industry"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2  flex w-full  space-y-1 my-5">
                    <label className="font-semibold text-lg w-2/5 mx-2">Description</label>
                    <div className="w-4/5"><Field
                      name="description"
                      type="textarea"
                      className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                      style={{
                        borderRadius: "4px",
                        border: "0.5px solid",
                      }}
                      value={values.description}
                    />

                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="flex px-5 w-full justify-center text-center">
                    <button
                      type="submit"
                      className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                      style={{ backgroundColor: "#034488" }}
                    >
                      {edit === null ? "Save Changes " : "Update"}
                    </button>
                    <button
                      type="button"
                      className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"

                      ref={resetBtn}
                            onClick={async () => {
                              await setShowError(false);
                              await setShowForm(false);
                            }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
                  // <Form className="w-4/5 space-y-3">
                  //   <div className="my-3">
                  //     <label>Title *</label>
                  //     <Field
                  //       name="title"
                  //       type="text"
                  //       placeholder="Ex. Manager"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.title}
                  //     />
                  //     <ErrorMessage
                  //       name="title"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   {/* <div className="my-3">
                  //     <label>Employment Type *</label>
                  //     <Field
                  //       name="employment_type"
                  //       as="select"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //     >
                  //       <option value="">Please Select</option>
                  //       <option value="Full Time">Full Time</option>
                  //       <option value="Part Time">Part Time</option>
                  //       <option value="Self Employed">Self Employed</option>
                  //       <option value="Internship">Internship</option>
                  //       <option value="Free Lancer">Free Lancer</option>
                  //     </Field>
                  //     <ErrorMessage
                  //       name="employment_type"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div> */}
                  //   <div className="my-3">
                  //     <label>Company *</label>
                  //     <Field
                  //       name="company_name"
                  //       type="text"
                  //       placeholder="Ex. Microsoft"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.company_name}
                  //     />
                  //     <ErrorMessage
                  //       name="company_name"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   <div className="my-3">
                  //     <label>Location *</label>
                  //     <Field
                  //       name="location"
                  //       type="text"
                  //       placeholder="Ex. London"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.location}
                  //     />
                  //     <ErrorMessage
                  //       name="location"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   <div className="flex flex-wrap">
                  //     <div className="my-3 md:w-1/2 pr-2">
                  //       <label>Start Date *</label>
                  //       <Field
                  //         name="start_date"
                  //         type="month"
                  //         className="w-full text-600"
                  //         style={{ borderRadius: "10px" }}
                  //         value={values.start_date}
                  //       />
                  //       <ErrorMessage
                  //         name="start_date"
                  //         component="div"
                  //         className="text-sm text-red-600"
                  //       />
                  //     </div>
                  //     <div className="my-3 md:w-1/2 pr-2">
                  //       <label>End Date (or Expected)*</label>
                  //       <Field
                  //         name="end_date"
                  //         type="month"
                  //         className="w-full text-600"
                  //         style={{ borderRadius: "10px" }}
                  //         value={values.end_date}
                  //       />
                  //       <ErrorMessage
                  //         name="end_date"
                  //         component="div"
                  //         className="text-sm text-red-600"
                  //       />
                  //     </div>
                  //   </div>
                  //   <div className="my-3">
                  //     <label>Industry *</label>
                  //     <Field
                  //       name="industry"
                  //       type="text"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.industry}
                  //     />
                  //     <ErrorMessage
                  //       name="industry"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   <div className="my-3">
                  //     <label>Description</label>
                  //     <Field
                  //       name="description"
                  //       type="textarea"
                  //       className="w-full text-600 border-[0.5px] border-[#6b7280] p-2"
                  //       style={{ borderRadius: "10px", border: "0.5px solid" }}
                  //       value={values.description}
                  //     />
                  //     <ErrorMessage
                  //       name="description"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   <div className="flex flex-wrap">
                  //     <button
                  //       type="submit"
                  //       className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 align-middle"
                  //       style={{backgroundColor:"#034488"}}
                  //     >
                  //       {edit === null ? "Add " : "Update"}
                  //     </button>
                  //     <button
                  //       type="button"
                  //       className="h-8 border-[0.5px] mx-3 border-black text-black rounded-sm block cursor-pointer px-8"
                  //       ref={resetBtn}
                  //       onClick={async () => {
                  //         await setShowError(false);
                  //         await setShowForm(false);
                  //       }}
                  //     >
                  //       Cancel
                  //     </button>
                  //   </div>
                  // </Form>
                );
              }}
            </Formik>
          </div>
        ) : (
          <div>
            <button
              className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 my-5"
              style={{backgroundColor:"#034488"}}
              onClick={async () => {
                await setShowError(true);
                await setShowForm(true);
              }}
            >
              Add associate
            </button>
          </div>
        )}
      </div>
      <div className="pt-5 flex w-full">
        <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          style={{backgroundColor:"#034488"}}
          onClick={async () => {
            let access = await localStorage.getItem("access_token");
            let details = JSON.parse(
              await localStorage.getItem("candidateDetails")
            );
            let user = JSON.parse(await localStorage.getItem("user"));
            await submitCandidateDetails(
              { associate: details.associate, user_id: user._id },
              access
            );
            props.setStep(2);
          }}
        >
          Prev
        </button>
        {associateDetail && associateDetail.length > 0 ? (
          <button
            className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
            style={{backgroundColor:"#034488"}}
            onClick={async () => {
              let access = await localStorage.getItem("access_token");
              let details = JSON.parse(
                await localStorage.getItem("candidateDetails")
              );
              let user = JSON.parse(await localStorage.getItem("user"));
              await submitCandidateDetails(
                { associate: details.associate, user_id: user._id },
                access
              );
              props.setStep(4);
            }}
          >
            Next
          </button>
        ) : (
          <button className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white" style={{backgroundColor:"#034388d7"}}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AssociationDetailForm;
