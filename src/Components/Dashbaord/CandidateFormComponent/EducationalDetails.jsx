import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";

import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { submitCandidateDetails, getDBSchoolList } from "../../../service/api";
import cities from "cities.json";
import { Combobox } from "@headlessui/react";

const EducationDetailForm = (props) => {
  const [educationalDetail, setEducationalDetail] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [showError, setShowError] = React.useState(true);
  const [edit, setEdit] = React.useState(null);

  const resetBtn = React.useRef(null);

  const [initialValues, setInitialValues] = React.useState({
    school: null,
    degree: null,
    field_of_study: null,
    start_date: null,
    end_date: null,
    grade: null,
    description: null,
  });

  React.useEffect(() => {
    const initial = async () => {
      let res = await getDBSchoolList();
      console.log(res);
      setSchoolList(res.data);
    };
    initial();
  }, []);


  const [schoolList, setSchoolList] = React.useState([]);
const [selectedSchool, setSelectedSchool] = React.useState(null);
const [schoolQuery, setSchoolQuery] = React.useState("");
const filteredSchool =
schoolQuery === ""
? schoolList.slice(0, 10)
: schoolList
  .filter((school) =>
    school.name.toLowerCase().includes(schoolQuery.toLowerCase())
  )
  .slice(0, 10);



  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await localStorage.getItem("candidateDetails"));
      if (e === null) return null;
      let ed = e.education;
      console.log(ed);
      if (ed !== "null" || ed !== null) {
        setEducationalDetail(ed);
      }
      if (educationalDetail === null) {
        setEducationalDetail([]);
      }
    };
    initial();
  }, []);

  return (
    <div>
      <div className="">
        <p className="font-bold text-lg">Educational Details</p>
        <div>
          {educationalDetail &&
            educationalDetail.map((item, index) => {
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
                        setEducationalDetail(
                          educationalDetail.filter((item, i) => i !== index)
                        );
                        let res = JSON.parse(
                          await localStorage.getItem("candidateDetails")
                        );
                        res.education = educationalDetail.filter(
                          (item, i) => i !== index
                        );
                        localStorage.setItem(
                          "candidateDetails",
                          JSON.stringify(res)
                        );
                      }}
                    />
                  </div>
                  <p className="font-semibold">{item.school}</p>
                  <div className="flex flex-wrap justify-between w-full py-1 text-gray-800 ">
                    <div className="flex space-x-2 text-sm items-center">
                      <FiInfo />
                      <p>{item.degree}</p> <p>|</p> <p>{item.field_of_study}</p>
                    </div>
                    {item.grade && (
                      <div className="space-x-2 flex items-center">
                        <GrScorecard /> <p>{item.grade}</p>
                      </div>
                    )}
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
            <p className="text-md font-semibold my-3">Add Education</p>
            <Formik
              initialValues={initialValues}
              validate={(values) => {
                if (showForm === false) return {};
                const errors = {};
                if (!selectedSchool || selectedSchool === " ") {
                  errors.school = "Required";
                }
                if (values.degree === null || values.degree.trim() === "") {
                  errors.degree = "Required !";
                }
                if (
                  values.field_of_study === null ||
                  values.field_of_study.trim() === ""
                ) {
                  errors.field_of_study = "Required !";
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
                return errors;
              }}
              onSubmit={async (values) => {
                let e = JSON.parse(
                  await localStorage.getItem("candidateDetails")
                );
                if (edit !== null) {
                  const temp = [...educationalDetail];
                  let school =selectedSchool;
                  temp[edit] = {...values, school : school};
                  await setEducationalDetail(temp);
                  await setEdit(null);
                  resetBtn.current.click();
                  e.education = temp;
                  await localStorage.setItem(
                    "candidateDetails",
                    JSON.stringify(e)
                  );
                  await props.setCandidateDetails({
                    education: temp,
                    ...props.candidateDetails,
                  });
                  return;
                }
                let temp = educationalDetail;
                let school =selectedSchool;

                temp = [...educationalDetail, {...values, school : school}];                await setEducationalDetail(temp);
                e.education = temp;
                await localStorage.setItem(
                  "candidateDetails",
                  JSON.stringify(e)
                );
                await setInitialValues({
                  school: null,
                  degree: null,
                  field_of_study: null,
                  start_date: null,
                  end_date: null,
                  grade: null,
                  description: null,
                });
                await props.setCandidateDetails({
                  education: educationalDetail,
                  ...props.candidateDetails,
                });
                resetBtn.current.click();
              }}
            >
              {({ values }) => {
                return (
                  // <Form className="w-4/5">
                  //   <div className="my-3">
                  //     <label>School *</label>
                  //     <Field
                  //       name="school"
                  //       type="text"
                  //       placeholder="Ex. Boston University"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.school}
                  //     />
                  //     <ErrorMessage
                  //       name="school"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   <div className="my-3">
                  //     <label>Degree *</label>
                  //     <Field
                  //       name="degree"
                  //       type="text"
                  //       placeholder="Ex. Bachelor's"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.degree}
                  //     />
                  //     <ErrorMessage
                  //       name="degree"
                  //       component="div"
                  //       className="text-sm text-red-600"
                  //     />
                  //   </div>
                  //   <div className="my-3">
                  //     <label>Field of Study *</label>
                  //     <Field
                  //       name="field_of_study"
                  //       type="text"
                  //       placeholder="Ex. Business"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.field_of_study}
                  //     />
                  //     <ErrorMessage
                  //       name="field_of_study"
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
                  //     <label>Grade</label>
                  //     <Field
                  //       name="grade"
                  //       type="text"
                  //       className="w-full text-600"
                  //       style={{ borderRadius: "10px" }}
                  //       value={values.grade}
                  //     />
                  //     <ErrorMessage
                  //       name="grade"
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
                  //   <div className="flex flex-wrap w-full text-center">
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
                  //         await setInitialValues({
                  //           school: null,
                  //           degree: null,
                  //           field_of_study: null,
                  //           start_date: null,
                  //           end_date: null,
                  //           grade: null,
                  //           description: null,
                  //         })
                  //       }}
                  //     >
                  //       Cancel
                  //     </button>
                  //   </div>
                  // </Form>
                  <Form className="w-full py-4">


                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">School </label>

                                  <div className="w-4/5">
                                    {/* <Field
                                    name="school"
                                    type="text"
                                    placeholder="Ex. Boston University"
                                    className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                    style={{
                                      borderRadius: "4px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.school}
                                  /> */}
                                    {edit !== null && (
                          <p>Current University : {values.school}</p>
                        )}
                        <Combobox
                          value={selectedSchool}
                          onChange={setSelectedSchool}
                        >
                          <Combobox.Input
                            onChange={(event) =>
                              setSchoolQuery(event.target.value)
                            }
                            className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                            style={{ borderRadius: "5px" }}
                          />
                          <Combobox.Options className="absolute z-100 bg-white">
                            {schoolQuery.length > 0 && (
                              <Combobox.Option
                                value={`${schoolQuery}`}
                                className="cursor-pointer"
                              >
                                Create "{schoolQuery}"
                              </Combobox.Option>
                            )}
                            {filteredSchool.map((school) => (
                              <Combobox.Option
                                key={school.name}
                                value={`${school.name}`}
                                className="cursor-pointer"
                              >
                                {school.name}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        </Combobox> 
                                    <ErrorMessage
                                      name="school"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">Degree </label>

                                  <div className="w-4/5"><Field
                                    name="degree"
                                    type="text"
                                    placeholder="Ex. Bachelor's"
                                    className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                    style={{
                                      borderRadius: "4px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.degree}
                                  />
                                    <ErrorMessage
                                      name="degree"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">Field </label>

                                  <div className="w-4/5"><Field
                                    name="field_of_study"
                                    type="text"
                                    placeholder="Ex. Business"
                                    className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                    style={{
                                      borderRadius: "4px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.field_of_study}
                                  />
                                    <ErrorMessage
                                      name="field_of_study"
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
                                <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">Grade</label>

                                  <div className="w-4/5"><Field
                                    name="grade"
                                    type="text"
                                    className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                    style={{
                                      borderRadius: "4px",
                                      border: "0.5px solid",
                                    }}
                                    value={values.grade}
                                  />
                                    <ErrorMessage
                                      name="grade"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">Description</label>

                                  <div className="w-4/5"><Field
                                    name="description"
                                    type="textarea"
                                    className="block border-gray-400 py-2 w-full h-20 border-[0.5px] border-[#6b7280] p-2"
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
                                <div className=" flex justify-center mt-4 text-center">
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
                                              await setInitialValues({
                                                school: null,
                                                degree: null,
                                                field_of_study: null,
                                                start_date: null,
                                                end_date: null,
                                                grade: null,
                                                description: null,
                                              })
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
              Add Education
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
                { education: details.education, user_id: user._id},
                access
              );
            props.setStep(0);
          }}
        >
          Prev
        </button>
        {educationalDetail && educationalDetail.length > 0 ? (
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
                { education: details.education, user_id: user._id},
                access
              );
              props.setStep(2);
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

export default EducationDetailForm;
