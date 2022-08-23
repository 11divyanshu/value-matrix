import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";

import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";

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
                <div className="my-2 shadow-md rounded-md p-2 bg-gray-100" key={index}>
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
                      onClick={() => {
                        setEducationalDetail(
                          educationalDetail.filter((item, i) => i !== index)
                        );
                        localStorage.setItem(
                          "education",
                          JSON.stringify(
                            educationalDetail.filter((item, i) => i !== index)
                          )
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
                    <div className="space-x-2 flex items-center">
                      <GrScorecard /> <p>{item.grade}</p>
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
            <p className="text-md font-semibold my-3">Add Education</p>
            <Formik
              initialValues={initialValues}
              validate={(values) => {
                if (showForm === false) return {};
                const errors = {};
                if (values.school === null || values.school.trim() === "") {
                  errors.school = "Required !";
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
                if (values.grade === null || values.grade.trim() === "") {
                  errors.grade = "Required !";
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
                  temp[edit] = values;
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
                  await localStorage.setItem("education", JSON.stringify(temp));
                  return;
                }
                let temp = educationalDetail;
                temp = [...educationalDetail, values];
                await setEducationalDetail(temp);
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
                await localStorage.setItem("education", JSON.stringify(temp));
                resetBtn.current.click();
              }}
            >
              {({ values }) => {
                return (
                  <Form className="w-4/5">
                    <div className="my-3">
                      <label>School *</label>
                      <Field
                        name="school"
                        type="text"
                        placeholder="Ex. Boston University"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.school}
                      />
                      <ErrorMessage
                        name="school"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="my-3">
                      <label>Degree *</label>
                      <Field
                        name="degree"
                        type="text"
                        placeholder="Ex. Bachelor's"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.degree}
                      />
                      <ErrorMessage
                        name="degree"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="my-3">
                      <label>Field of Study *</label>
                      <Field
                        name="field_of_study"
                        type="text"
                        placeholder="Ex. Business"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.field_of_study}
                      />
                      <ErrorMessage
                        name="field_of_study"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="flex flex-wrap">
                      <div className="my-3 md:w-1/2 pr-2">
                        <label>Start Date *</label>
                        <Field
                          name="start_date"
                          type="month"
                          className="w-full text-600"
                          style={{ borderRadius: "10px" }}
                          value={values.start_date}
                        />
                        <ErrorMessage
                          name="start_date"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>
                      <div className="my-3 md:w-1/2 pr-2">
                        <label>End Date (or Expected)*</label>
                        <Field
                          name="end_date"
                          type="month"
                          className="w-full text-600"
                          style={{ borderRadius: "10px" }}
                          value={values.end_date}
                        />
                        <ErrorMessage
                          name="end_date"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>
                    </div>
                    <div className="my-3">
                      <label>Grade *</label>
                      <Field
                        name="grade"
                        type="text"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.grade}
                      />
                      <ErrorMessage
                        name="grade"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="my-3">
                      <label>Description</label>
                      <Field
                        name="description"
                        type="textarea"
                        className="w-full text-600 border-[0.5px] border-[#6b7280] p-2"
                        style={{ borderRadius: "10px", border: "0.5px solid" }}
                        value={values.description}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="flex flex-wrap">
                      <button
                        type="submit"
                        className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 align-middle"
                      >
                        {edit === null ? "Add " : "Update"}
                      </button>
                      <button
                        type="button"
                        className="h-8 border-[0.5px] mx-3 border-red-600 text-red-600 rounded-sm block cursor-pointer px-8"
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
                );
              }}
            </Formik>
          </div>
        ) : (
          <div>
            <button
              className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 my-5"
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
          onClick={() => props.setStep(0)}
        >
          Prev
        </button>
        {educationalDetail && educationalDetail.length > 0 ? (
          <button
            className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
            onClick={() => props.setStep(2)}
          >
            Next
          </button>
        ) : (
          <button className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default EducationDetailForm;
