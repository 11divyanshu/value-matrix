import React from "react";
import { Formik, ErrorMessage, Field, Form } from "formik";

import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { submitCompanyDetails } from "../../../service/api";

const BillingDetailForm = (props) => {
  const [billingDetail, setBillingDetail] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [showError, setShowError] = React.useState(true);
  const [edit, setEdit] = React.useState(null);
  const [addButton, setAddButton] = React.useState(true)
  const [submitError, setSubmitError] = React.useState(null);

  const resetBtn = React.useRef(null);

  const [initialValues, setInitialValues] = React.useState({
   gst:null,
    pan: null,
    location:null,
   
  });

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await localStorage.getItem("companyDetails"));
      if (e === null) return null;
      let ed = e.billing;
      // console.log(ed);
      if (ed !== "null" || ed !== null) {
        setBillingDetail(ed);
      }
      if (billingDetail === null) {
        setBillingDetail([]);
      }
    };
    initial();
  }, []);

  
  const handleSubmit = async () => {    
    let res = JSON.parse(await localStorage.getItem("companyDetails"));
    let user = JSON.parse(await localStorage.getItem("user"));
    res.user_id = user._id;
    // console.log(res);
    let access_token = await localStorage.getItem("access_token");
    // console.log(access_token)
    let response = await submitCompanyDetails(res, access_token);
    if (response && response.status === 200) {
      await localStorage.setItem("user", JSON.stringify(response.data.user));
      // await localStorage.removeItem("companyDetails");
      window.location.reload();
    } else {
      setSubmitError("Something went wrong");
    }
  };


  return (
    <div>
      <div className="">
        <p className="font-bold text-lg">Billing Credentials</p>
        <div>
          {billingDetail &&
            billingDetail.map((item, index) => {
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
                        setBillingDetail(
                          billingDetail.filter((item, i) => i !== index)
                        );
                        localStorage.setItem(
                          "billing",
                          JSON.stringify(
                            billingDetail.filter((item, i) => i !== index)
                          )
                        );
                      }}
                    />
                  </div>

                  <p className="font-semibold">{item.location}</p>
                  {item.gst && (
                    <div className="py-2">{item.gst}</div>
                  )}
               
                <label className="font-semibold">Pan</label>
                  
                  <p>{item.pan}</p>
                 

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

                if (values.gst === null || values.gst.trim() === "") {
                  errors.gst = "Required !";
                }
                if (values.pan === null || values.pan.trim() === "") {
                  errors.pan = "Required !";
                }
               

                return errors;
              }}
              onSubmit={async (values) => {
                // console.log(values);
                let e = JSON.parse(
                  await localStorage.getItem("companyDetails")
                );
                if (edit !== null) {
                  const temp = [...billingDetail];
                  temp[edit] = values;
                  await setBillingDetail(temp);
                  await setEdit(null);
                  resetBtn.current.click();
                  e.billing = temp;
                  await localStorage.setItem(
                    "companyDetails",
                    JSON.stringify(e)
                  );
                  await props.setCompanyDetails({
                    billing: temp,
                    ...props.companyDetails,
                  });
                  await localStorage.setItem("billing", JSON.stringify(temp));
                  return;
                }
                
                let temp = billingDetail;
                temp = [...billingDetail, values];
                await setBillingDetail(temp);
                e.billing = temp;
                await localStorage.setItem(
                  "companyDetails",
                  JSON.stringify(e)
                );
                await setInitialValues({
                    gst:null,
                    Pan: null,
                    location:null,
                });
                await props.setCompanyDetails({
                  billing: billingDetail,
                  ...props.companyDetails,
                });
                await localStorage.setItem("billing", JSON.stringify(temp));
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
                     <label>Country</label>
           <Field
             component="select"
             id="location"
             name="location"
             className="w-full h-20 text-600 border-[0.5px] border-[#6b7280] p-2"
             multiple={false}
             value={values.location}
           >
             <option value="IND">India</option>
             <option value="NZ">New Zealand</option>
             <option value="USA">USA</option>
             <option value="UK">UK</option>
             <option value="OTHER">Other</option>
           </Field>
           </div>

                    <div className="my-3">
                      <label>Tax ID</label>
                      <Field
                        name="gst"
                        type="textarea"
                        className="w-full h-20 text-600 border-[0.5px] border-[#6b7280] p-2"
                        style={{ borderRadius: "10px", border: "0.5px solid" , wordBreak:"break" }}
                        value={values.billing}
                      />
                      <ErrorMessage
                        name="billing"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="my-3">
                      <label>PAN *</label>
                      <Field
                        name="pan"
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
              Add billing
            </button>}
          </div>
        )}
      </div>
      <div className="pt-5 flex w-full">
        <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          onClick={() => props.setStep(1)}
        >
          Prev
        </button>
        {billingDetail && billingDetail.length > 0 ? (
          <button className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white" onClick={()=>{handleSubmit()}}>
          Submit
        </button>
      ) : (
        <button disabled className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
          Submit
        </button>
        )}
      </div>
    </div>
  );
};

export default BillingDetailForm;
