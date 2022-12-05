import React from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addEvaluationQuestion } from "../../service/api";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../assets/images/loader.gif";

const AddQuestions = () => {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);

  // Screeing Questions
  const [questions, setQuestions] = React.useState([]);
  const [questionError, setQuestionError] = React.useState(null);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);

  const [loading, setLoading] = React.useState(false);

  const changeHandler = async (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        json.forEach((item) => {
          if (item["Question"] && item["Question"] !== "") {
            setQuestions([
              ...questions,
              { question: item["Question"], answer: item["Answer"] },
            ]);
          }
        });
        fileRef.current.value = "";
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    let user = JSON.parse(await localStorage.getItem("user"));
    let token = user.access_token;
    let res = await addEvaluationQuestion(
      { user_id: user._id, questions: questions },
      token
    );
    // console.log(res);
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Questions Added Successfully",
        icon: "success",
        button: "Ok",
      });
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
  };

  return (
    <div className="p-5 bg-slate-100 h-full" style={{ minHeight: "90vh" }}>
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100">
        <p className="font-bold text-2xl">Add Job Questions</p>
        <div className="my-4 flex items-center">
          <div className="my-4">
            <p className="font-semibold">Import Spreadsheet</p>
            <p className="text-xs">
              ( Upload sheet with Questions, Answer as header )
            </p>
          </div>
          <label for="questionCSV">
            <p
              className="ml-10 rounded-sm cursor-pointer bg-blue-500 px-4 py-1 text-white"
              style={{ backgroundColor: "#034488" }}
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.click();
                }
              }}
            >
              Import
            </p>
          </label>
          <input
            type="File"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            name="questionCSV"
            ref={fileRef}
            className="hidden"
            onChange={changeHandler}
          />
        </div>
        {questions.length > 0 && (
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
        )}
        <div className="my-5">
          {showQuestionForm && (
            <Formik
              initialValues={initialQuestion}
              validate={(values) => {
                const errors = {};
                if (!values.question) {
                  errors.question = "Required";
                }
                return errors;
              }}
              onSubmit={(values) => {
                if (questionEditIndex !== null) {
                  let temp = [...questions];
                  temp[questionEditIndex] = values;
                  setQuestions(temp);
                  setQuestionEditIndex(null);
                  setShowQuestionForm(false);
                  setInitialQuestion({
                    question: "",
                    answer: "",
                  });
                } else {
                  setQuestions([
                    ...questions,
                    { question: values.question, answer: values.answer },
                  ]);
                  setShowQuestionForm(false);
                  setInitialQuestion({
                    question: "",
                    answer: "",
                  });
                }
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="my-6">
                    <label className="font-semibold">Question</label>
                    <Field
                      name="question"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      type="text"
                    />
                    <ErrorMessage
                      component="div"
                      name="question"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="my-6">
                    <label className="font-semibold">Ideal Answer</label>
                    <Field
                      name="answer"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                      type="text"
                    />
                    <ErrorMessage
                      component="div"
                      name="answer"
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
                        ? "Add Question"
                        : " Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="rounded-sm px-4 py-1 text-black border-2 rounded-sm border-black"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setInitialQuestion({
                          question: "",
                          answer: "",
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
                Add Question
              </button>
            </div>
          )}
          <div className="my-3">
            {questions.map((question, index) => {
              return (
                <div className="my-5">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      Question {index + 1} :{" "}
                      <span className="font-normal">{question.question}</span>
                    </p>
                    <div className="flex space-x-3">
                      <RiEditBoxLine
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          setShowQuestionForm(false);
                          setInitialQuestion(question);
                          setQuestionEditIndex(index);
                          setShowQuestionForm(true);
                        }}
                      />
                      <AiOutlineDelete
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                          setQuestions(
                            questions.filter(
                              (item) => item.question !== question.question
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  {question.answer && (
                    <p className="text-gray-600 font-semibold">
                      Answer :{" "}
                      <span className="font-normal">{question.answer}</span>
                    </p>
                  )}
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
