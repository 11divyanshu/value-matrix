import React from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addTaxId,fetchCountry } from "../../service/api";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../assets/images/loader.gif";

const AddQuestions = () => {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);

  // Screeing Questions
  const [countries, setCountries] = React.useState([]);
  const [questionError, setQuestionError] = React.useState(null);
  const [initialData, setInitialData] = React.useState({
    country: "",
    id: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);

  const [user, setUser] = React.useState(null);
  const [access_token, setToken] = React.useState(null);



  const [loading, setLoading] = React.useState(false);

  const changeHandler = async (e) => {
    e.preventDefault();
  
  };
  React.useEffect(() => {
    const initial = async () => {
      let access_token1 = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      if (access_token1 === "null" || access_token === "undefined")
        await localStorage.setItem("access_token", user.access_token);
        
        const res = await fetchCountry();
        // console.log(res.data.countries[0].country);
        setCountries(res.data.countries);
      console.log(user);
      await setUser(user);
      await setToken(access_token1);
    };
    initial();
  }, []);

//   const handleUpload = async () => {
    
//   };

  return (
    <div className="p-5 bg-slate-100 h-full" style={{ minHeight: "90vh" }}>
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100">
        <p className="font-bold text-2xl">Add Tax Id</p>
        
        {/* {questions.length > 0 && (
          <div className="my-3">
            <button
              onClick={handleUpload}
              className="px-4 py-1 rounded-sm text-white"
              style={{ backgroundColor: "#034488" }}
            >
              {!loading ? (
                "Upload"
              ) : (
                <img src={Loader} alt="loader" className="h-9 mx-auto" />
              )}
            </button>
          </div>
        )} */}
        <div className="my-5">
          {showQuestionForm && (
            <Formik
              initialValues={{
                country: "",
                tax_id: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.country) {
                  errors.country = "Required";
                }
                if (!values.tax_id) {
                  errors.tax_id = "Required";
                }
                return errors;
              }}
              onSubmit={(values) => {
                console.log(values);
                const submit = async(values)=>{
                    setLoading(true);
                    let user = JSON.parse(await localStorage.getItem("user"));
                    let token = user.access_token;
                    let res = await addTaxId(
                        { data: values },
                        token 
                    );
                    console.log(res.data);
                    if (res && res.status === 200) {
                        setCountries(res.data.countries);

                      swal({
                        title: "Success",
                        text: "Questions Added Successfully",
                        icon: "success",
                        button: "Ok",
                      });
                      
                      setLoading(false);
                    //   setTimeout(() => {
                    //     window.location.reload();
                    //   }, 1000);
                    }
                    else{
                      swal({
                        title: "Error",
                        text: "Something went wrong",
                        icon: "error",
                        button: "Ok",
                      });
                      setLoading(false);
                    }
                }
                submit(values);
                // if (questionEditIndex !== null) {
                //   let temp = [...questions];
                //   temp[questionEditIndex] = values;
                //   setQuestions(temp);
                //   setQuestionEditIndex(null);
                //   setShowQuestionForm(false);
                //   setInitialQuestion({
                //     question: "",
                //     answer: "",
                //   });
                // } else {
                //   setQuestions([
                //     ...questions,
                //     { question: values.question, answer: values.answer },
                //   ]);
                //   setShowQuestionForm(false);
                //   setInitialQuestion({
                //     question: "",
                //     answer: "",
                //   });
                // }
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="my-6">
                    <label className="font-semibold">Country</label>
                    <Field
                      name="country"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      type="text"
                    />
                    <ErrorMessage
                      component="div"
                      name="country"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="my-6">
                    <label className="font-semibold">Tax Id</label>
                    <Field
                      name="tax_id"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      type="text"
                    />
                    <ErrorMessage
                      component="div"
                      name="tax_id"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                      style={{ backgroundColor: "#034488" }}
                    >
                      {questionEditIndex === null
                        ? "Add Tax Id"
                        : " Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="rounded-sm px-4 py-1 text-black border-2 rounded-sm border-black"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setInitialData({
                          country: "",
                          tax_id: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
          {!showQuestionForm && (
            <div>
              <button
                className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                style={{ backgroundColor: "#034488" }}
                onClick={() => {
                  setShowQuestionForm(true);
                }}
              >
                Add Tax Id
              </button>
            </div>
          )}
          <div className="my-3">
            {countries && countries.map((item, index) => {
              return (
                <div className="my-5">
                  <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-3">
                    <div>
                    <span className="font-normal mx-2 w-1/2">Country :{item.country.country}</span>
</div>
                    <div className="font-semibold ">
                      <span className="font-normal mx-2 w-1/2">Tax ID : {item.country.tax_id}</span>
                    </div>
                    <div className=" flex">
                        <div className="mx-2">
                      <RiEditBoxLine
                        className="cursor-pointer text-blue-500"
                        // onClick={() => {
                        //   setShowQuestionForm(false);
                        //   setInitialQuestion(question);
                        //   setQuestionEditIndex(index);
                        //   setShowQuestionForm(true);
                        // }}
                      />
                      </div>
                      <div className="mx-2">
                      <AiOutlineDelete
                        className="cursor-pointer text-red-600"
                        // onClick={() => {
                        //   setQuestions(
                        //     questions.filter(
                        //       (item) => item.question !== question.question
                        //     )
                        //   );
                        // }}
                      />
                      </div>
                    </div>
                  </div>
                  {/* {question.answer && (
                    <p className="text-gray-600 font-semibold">
                      Answer :{" "}
                      <span className="font-normal">{question.answer}</span>
                    </p>
                  )} */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
