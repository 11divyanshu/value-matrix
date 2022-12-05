import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";

import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";

const EducationDetailForm = (props) => {
  const [aboutDetail, setAboutDetail] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [showError, setShowError] = React.useState(true);
  const [edit, setEdit] = React.useState(null);
  const [addButton, setAddButton] = React.useState(true)

  const resetBtn = React.useRef(null);

  const [initialValues, setInitialValues] = React.useState({
   motto:null,
    website: null,
    industry: null,
    found: null,
    company_size: null,
    desc: null,
  });

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await localStorage.getItem("companyDetails"));
      if (e === null) return null;
      let ed = e.about;
      // console.log(ed);
      if (ed !== "null" || ed !== null) {
        setAboutDetail(ed);
      }
      if (aboutDetail === null) {
        setAboutDetail([]);
      }
    };
    initial();
  }, []);

  return (
    <div>
      <div className="">
        <p className="font-bold text-lg">About</p>
        <div>
          {aboutDetail &&
            aboutDetail.map((item, index) => {
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
                        setAboutDetail(
                          aboutDetail.filter((item, i) => i !== index)
                        );
                        localStorage.setItem(
                          "about",
                          JSON.stringify(
                            aboutDetail.filter((item, i) => i !== index)
                          )
                        );
                      }}
                    />
                  </div>
                  <p className="font-semibold">About</p>
                  {item.about && (
                    <div className="py-2">{item.desc}</div>
                  )}
                  <p>{item.motto}</p>
                  <div className="flex flex-wrap justify-between w-full py-1 text-gray-800 ">

                    <div className="flex space-x-2 text-sm items-center">
                      <FiInfo />
                      <p>{item.industry}</p> <p>|</p> <p>{item.company_size}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <BsCalendar />
                      <p className="text-sm text-gray-600 mr-5">
                        {item.found}
                      </p>
                    </div>
                    <div className="space-x-2 flex items-center">
                      <GrScorecard /> <p>{item.website}</p>
                    </div>
                  </div>

                </div>
              );
            })}
        </div>
        {showForm ? (
          <div className={`${!showForm ? "hidden" : "block"}`}>
            <Formik
              initialValues={initialValues}
              validate={(values) => {
                if (showForm === false) return {};
                const errors = {};

                if (values.company_size === null || values.company_size.trim() === "") {
                  errors.company_size = "Required !";
                }
                if (values.motto === null || values.motto.trim() === "") {
                  errors.motto = "Required !";
                }
                if (
                  values.industry === null ||
                  values.industry.trim() === ""
                ) {
                  errors.industry = "Required !";
                }
                if (values.found === null) {
                  errors.found = "Required !";
                }

                if (values.website === null || values.website.trim() === "") {
                  errors.website = "Required !";
                }
                if (values.found > new Date()) {
                  errors.found =
                    "Company Found cannot be greater than today's date";
                }

                return errors;
              }}
              onSubmit={async (values) => {
                let e = JSON.parse(
                  await localStorage.getItem("companyDetails")
                );
                if (edit !== null) {
                  const temp = [...aboutDetail];
                  temp[edit] = values;
                  await setAboutDetail(temp);
                  await setEdit(null);
                  resetBtn.current.click();
                  e.about = temp;
                  await localStorage.setItem(
                    "companyDetails",
                    JSON.stringify(e)
                  );
                  await props.setCompanyDetails({
                    about: temp,
                    ...props.companyDetails,
                  });
                  await localStorage.setItem("about", JSON.stringify(temp));
                  return;
                }
                
                let temp = aboutDetail;
                temp = [...aboutDetail, values];
                await setAboutDetail(temp);
                e.about = temp;
                await localStorage.setItem(
                  "companyDetails",
                  JSON.stringify(e)
                );
                await setInitialValues({
                  motto:null,
                  website: null,
                  industry: null,
                  found: null,
                  company_size: null,
                  desc: null,
                });
                await props.setCompanyDetails({
                  about: aboutDetail,
                  ...props.companyDetails,
                });
                await localStorage.setItem("about", JSON.stringify(temp));
                resetBtn.current.click();

                setAddButton(false);
              }}
            >
              {({ values }) => {
                return (
                  <Form className="w-4/5">
                    {/* <div className="my-3">
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
                    </div> */}

                    <div className="my-3">
                      <label>About</label>
                      <Field
                        name="about"
                        type="textarea"
                        className="w-full h-20 text-600 border-[0.5px] border-[#6b7280] p-2"
                        style={{ borderRadius: "10px", border: "0.5px solid" , wordBreak:"break" }}
                        value={values.about}
                      />
                      <ErrorMessage
                        name="about"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="my-3">
                      <label>motto *</label>
                      <Field
                        name="motto"
                        type="text"
                        placeholder="Ex. Bachelor's"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.motto}
                      />
                      <ErrorMessage
                        name="motto"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>

                    <div className="my-3">
                      <label>company_size *</label>
                      <Field
                        name="company_size"
                        type="text"
                        placeholder="Ex. Bachelor's"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.company_size}
                      />
                      <ErrorMessage
                        name="company_size"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="my-3">
                      <label>Industry *</label>
                      <Field
                        name="industry"
                        type="text"
                        placeholder="Ex. Business"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.industry}
                      />
                      <ErrorMessage
                        name="industry"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="flex flex-wrap">
                      <div className="my-3 md:w-1/2 pr-2">
                        <label>Company Founded *</label>
                        <Field
                          name="found"
                          type="month"
                          className="w-full text-600"
                          style={{ borderRadius: "10px" }}
                          value={values.found}
                        />
                        <ErrorMessage
                          name="found"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>

                    </div>
                    <div className="my-3">
                      <label>Website *</label>
                      <Field
                        name="website"
                        type="text"
                        className="w-full text-600"
                        style={{ borderRadius: "10px" }}
                        value={values.website}
                      />
                      <ErrorMessage
                        name="website"
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
            {addButton && 
            <button
              className="h-8 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 my-5"
              onClick={async () => {
                await setShowError(true);
                await setShowForm(true);
              }}
              
            >
              Add about
            </button>}
          </div>
        )}
      </div>
      <div className="pt-5 flex w-full">
        {/* <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          onClick={() => props.setStep(0)}
        >
          Prev
        </button> */}
        {aboutDetail && aboutDetail.length > 0 ? (
          <button
            className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
            onClick={() => props.setStep(1)}
          >
            Next
          </button>
        ) : (
          <button  className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default EducationDetailForm;
