import React, { useEffect } from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addInterviewQuestion, fetchInterviewQuestion ,updateInterviewQuestion} from "../../service/api";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../assets/images/loader.gif";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
import "../../assets/stylesheet/editor.scss";

import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Fragment } from "react";
import { Popover, Transition ,Dialog} from "@headlessui/react";

const AddQuestions = () => {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const [modal, setModal] = React.useState(null);

  // Screeing Questions
  const [questions, setQuestions] = React.useState([]);



  const [inputQue, setInputQue] = React.useState();
  const [convertedQuestion, setConvertedQuestion] = React.useState(null);

  const [questionError, setQuestionError] = React.useState(null);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
    type: "",
    level: "",
    experience: "",
    category: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [quesList, setQuesList] = React.useState(false);
  const [importQues, setimportQues] = React.useState([]);

  useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let token = user.access_token;
      const QuesList = await fetchInterviewQuestion(token);
      // console.log(QuesList);
      setQuesList(QuesList.data.ques)
    }
    initial();

  }, [])


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
        // console.log(json)
        let tempArray = [];


        json.forEach((item) => {
          // console.log(item)

          if (item["Question"] && item["Question"] !== "") {
            tempArray.push( { question: item["Question"], answer: item["Answer"], type: item["Type"], level: item["Level"], experience: item["Experience"], category: item["Category"] })
            // setimportQues([
            //   ...importQues ,
            //   { question: item["Question"], answer: item["Answer"], type: item["Type"], level: item["Level"], experience: item["Experience"], category: item["Category"] },
            // ]);
          }
        });

        setimportQues(tempArray);
        // console.log(questions)
        fileRef.current.value = "";
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  //Perks Editor
  const onQuestionEditorStateChange = (state) => {
    // console.log(state)
    setInputQue(state);
    convertQuestionToHTML();
  };

  const convertQuestionToHTML = async () => {
    let currentContentAsHTML = convertToHTML(inputQue.getCurrentContent());
    setConvertedQuestion(currentContentAsHTML);


  };
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  //description Editor


  const handleUpload = async () => {
    setLoading(true);
    let user = JSON.parse(await localStorage.getItem("user"));
    let token = user.access_token;
    // console.log(questions);
    let res = await addInterviewQuestion(
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
    else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
      setLoading(false);
    }
  };
  const handleImportUpload = async () => {
     setLoading(true);
    let user = JSON.parse(await localStorage.getItem("user"));
    let token = user.access_token;
    // console.log(importQues);
    importQues.forEach((item)=>{
      item.question = "<p>"+item.question+"</p>"
    })
    // console.log(importQues)
    let res = await addInterviewQuestion(
      { user_id: user._id, questions: importQues },
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
    else {
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
        <p className="font-bold text-2xl">Add Interview Questions</p>
        {/* <div className="my-4 flex items-center"> */}
        {/* <div className="my-4">
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
        </div> */}

        <div className="my-5">
          {showQuestionForm && (
            <Formik
              initialValues={initialQuestion}
              validate={(values) => {
                const errors = {};
                if (!convertedQuestion || convertedQuestion === null || convertedQuestion === "<p></p>") {
                  errors.question = "Required";
                }
                return errors;
              }}
              onSubmit={(values) => {
                // console.log(values);
                if (questionEditIndex !== null) {
                  let temp = [...questions];
                  temp[questionEditIndex] = values;
                  setQuestions(temp);
                  setQuestionEditIndex(null);
                  setShowQuestionForm(false);
                  setInitialQuestion({
                    question: "",
                    answer: "",
                    type: "",
                    level: "",
                    experience: "",
                    category: "",
                  });
                } else {
                  setQuestions([
                    ...questions,
                    { question: convertedQuestion, answer: values.answer, type: values.type, level: values.level, experience: values.experience, category: values.category },
                  ]);
                  setShowQuestionForm(false);
                  setInputQue(null);
                  setConvertedQuestion(null);
                  setInitialQuestion({
                    question: "",
                    answer: "",
                    type: "",
                    level: "",
                    experience: "",
                    category: "",
                  });
                }
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="my-6">
                    <label className="font-semibold">Question</label>
                    <Editor
                      editorState={inputQue}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onQuestionEditorStateChange}
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
                  <div className="flex my-6 gap-x-3">
                    <div className="md:w-2/4">
                      <label className="font-semibold">Type</label>
                      <Field
                        component="select"
                        id="type"
                        name="type"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Question Type</option>
                        <option value="Problem Statement">Problem Statement</option>
                        <option value="General Question">General Question</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="type"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="md:w-1/4">
                      <label className="font-semibold">Level</label>
                      <Field
                        component="select"
                        id="level"
                        name="level"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="level"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="md:w-1/4">
                      <label className="font-semibold">Experience</label>
                      <Field
                        component="select"
                        id="experience"
                        name="experience"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Experience</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                        <option value="Professional">Professional</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="experience"
                        className="text-red-600 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex my-6 gap-x-3">
                    <div className="md:w-full">
                      <label className="font-semibold">Category</label>
                      <Field
                        component="select"
                        id="category"
                        name="category"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Skill Category</option>
                        <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                        <option value="Front End Developer">Front End Developer</option>
                        <option value="React Developer">React Developer</option>
                        <option value="Angular Developer">Angular Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Python Developer">Python Developer</option>
                        <option value="Java Developer">Java Developer</option>
                        <option value="Android Developer">Android Developer</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="category"
                        className="text-red-600 text-sm"
                      />
                    </div>
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
                          type: "",
                          level: "",
                          experience: "",
                          category: "",
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

          <div className="my-3">
            {questions && questions.map((question, index) => {
              // console.log(question)
              return (
                <div className="my-5">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      Question {index + 1} :{" "}
                      <span className="font-normal">{question.question}</span>
                    </p>
                    <div className="flex space-x-3">
                      {/* <RiEditBoxLine
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          setShowQuestionForm(false);
                          setInitialQuestion(question);
                          setQuestionEditIndex(index);
                          setShowQuestionForm(true);
                        }}
                      /> */}
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
          <div className="flex">
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
            {questions.length > 0 && (
              <div className="">
                <button
                  onClick={handleUpload}
                  className="px-4 py-1 rounded-sm text-white mx-3"
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


          </div>
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
        <div className="my-3">
            {importQues && importQues.map((question, index) => {
              // console.log(question)
              return (
                <div className="my-5">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      Question {index + 1} :{" "}
                      <span className="font-normal">{question.question}</span>
                    </p>
                    <div className="flex space-x-3">
                      {/* <RiEditBoxLine
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          setShowQuestionForm(false);
                          setInitialQuestion(question);
                          setQuestionEditIndex(index);
                          setShowQuestionForm(true);
                        }}
                      /> */}
                      <AiOutlineDelete
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                          setimportQues(
                            importQues.filter(
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
          {importQues.length > 0 && (
              <div className="">
                <button
                  onClick={handleImportUpload}
                  className="px-4 py-1 rounded-sm text-white mx-3"
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
        </div>
      </div>
      {modal && (
        <Transition
          appear
          show={modal}
          as={Fragment}
          className="relative z-1050 w-full"
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-1050 w-5/6"
            onClose={() => { }}
            static={true}
          >
            <div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
            />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className={`${!modal ? "hidden" : "block"}`}>
                      <div className="w-full">
                        <div className="w-full">
                        <div className="my-5">
          
            <Formik
              initialValues={initialQuestion}
              validate={(values) => {
                const errors = {};
                if (!convertedQuestion || convertedQuestion === null || convertedQuestion === "<p></p>") {
                  errors.question = "Required";
                }
                return errors;
              }}
              onSubmit={async(values) => {
                if (questionEditIndex !== null) {
                  let update = await updateInterviewQuestion({id :questionEditIndex._id,updates:{question:convertedQuestion , answer:values.answer, type:values.type, level:values.level, experience:values.experience, category:values.category}})
                  if(update.status == 200){
                    // console.log("updated")
                    setModal(false)
                    window.location.reload();
                  }
                 
                  setQuestionEditIndex(null);
                 setInputQue(null);
                  setInitialQuestion({
                    question: "",
                    answer: "",
                    type: "",
                    level: "",
                    experience: "",
                    category: "",
                  });
                }
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="my-6">
                    <label className="font-semibold">Question</label>
                    <Editor
                      editorState={inputQue}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{
                        width: "100%",
                        border: "1px solid rgb(156 163 175 / 1)",
                        borderRadius: "5px",
                      }}
                      editorStyle={{
                        minHeight: "200px",
                        paddingLeft: "1rem",
                      }}
                      onEditorStateChange={onQuestionEditorStateChange}
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
                  <div className="flex my-6 gap-x-3">
                    <div className="md:w-2/4">
                      <label className="font-semibold">Type</label>
                      <Field
                        component="select"
                        id="type"
                        name="type"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Question Type</option>
                        <option value="Problem Statement">Problem Statement</option>
                        <option value="General Question">General Question</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="type"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="md:w-1/4">
                      <label className="font-semibold">Level</label>
                      <Field
                        component="select"
                        id="level"
                        name="level"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="level"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="md:w-1/4">
                      <label className="font-semibold">Experience</label>
                      <Field
                        component="select"
                        id="experience"
                        name="experience"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Experience</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                        <option value="Professional">Professional</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="experience"
                        className="text-red-600 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex my-6 gap-x-3">
                    <div className="md:w-full">
                      <label className="font-semibold">Category</label>
                      <Field
                        component="select"
                        id="category"
                        name="category"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                        multiple={false}
                      >
                        <option value="" selected disabled>Select Skill Category</option>
                        <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                        <option value="Front End Developer">Front End Developer</option>
                        <option value="React Developer">React Developer</option>
                        <option value="Angular Developer">Angular Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Python Developer">Python Developer</option>
                        <option value="Java Developer">Java Developer</option>
                        <option value="Android Developer">Android Developer</option>
                      </Field>
                      <ErrorMessage
                        component="div"
                        name="category"
                        className="text-red-600 text-sm"
                      />
                    </div>
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
                        setModal(false);
                        setInitialQuestion({
                          question: "",
                          answer: "",
                          type: "",
                          level: "",
                          experience: "",
                          category: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          

                        </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100 my-3"><p className="font-bold text-xl">Uploaded Questions</p>
        <div className="my-3">
          {quesList && quesList.map((question, index) => {
            return (
              <div className="my-5">
                <div className="flex justify-between">
                  <p className="font-semibold">
                    Question {index + 1} :{" "}
                    <span className="font-normal" dangerouslySetInnerHTML={createMarkup(question.question)}></span>
                  </p>
                  <div className="flex space-x-3">
                    <RiEditBoxLine
                      className="cursor-pointer text-blue-500"
                      onClick={() => {
                        const blocksFromHtml = htmlToDraft(question.question);
                        const { contentBlocks, entityMap } = blocksFromHtml;
                        const contentState = ContentState.createFromBlockArray(
                          contentBlocks,
                          entityMap
                        );
                         const editorState = EditorState.createWithContent(contentState);
                        setInputQue(editorState);
                        setModal(true)
                         setInitialQuestion({answer:question.answer});
                        setQuestionEditIndex(question);
                      }}
                    />
                    <AiOutlineDelete
                      className="cursor-pointer text-red-600"
                      onClick={async() => {
                        let update = await updateInterviewQuestion({id :questionEditIndex._id,updates:{isDeleted:true}})
                  if(update.status == 200){
                    // console.log("updated")
                    setModal(false)
                    window.location.reload();
                  }
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
                <p className="text-gray-600 font-semibold">
                  Type :{" "}
                  <span className="font-normal">{question.type}</span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Level :{" "}
                  <span className="font-normal">{question.level}</span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Experience :{" "}
                  <span className="font-normal">{question.experience}</span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Category :{" "}
                  <span className="font-normal">{question.category}</span>
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </div>
  );
};

export default AddQuestions;
