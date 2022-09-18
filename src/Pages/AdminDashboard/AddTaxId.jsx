import React from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addTaxId,fetchCountry,findAndUpdateTax,findAndDeleteTax } from "../../service/api";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../assets/images/loader.gif";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const AddQuestions = () => {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);
  let [isOpen, setIsOpen] = useState(true)


  // Screeing Questions
  const [countries, setCountries] = React.useState([]);
  // const [questionError, setQuestionError] = React.useState(null);
  const [initialData, setInitialData] = React.useState({
    country: "",
    id: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);

  const [user, setUser] = React.useState(null);
  const [access_token, setToken] = React.useState(null);



  const [loading, setLoading] = React.useState(false);

 
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  React.useEffect(() => {
    const initial = async () => {
      let access_token1 = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      if (access_token1 === "null" || access_token === "undefined")
        await localStorage.setItem("access_token", user.access_token);
        
        const res = await fetchCountry();
        localStorage.setItem("taxid",JSON.stringify(res.data.countries))

        // console.log(res.data.countries[0].country);
        setCountries(res.data.countries);
      console.log(user);
      await setUser(user);
      await setToken(access_token1);
    };
    initial();
  }, []);
  const DeleteTax = async(id)=>{
    console.log("delete");
                       
    const taxid = id;
    let user = JSON.parse(await localStorage.getItem("user"));
    let token = user.access_token;
console.log(token);
    let res = await findAndDeleteTax( taxid, token);

    if (res  && res.status === 200) {
      setCountries(res.data.countries);

    swal({
      title: "Success",
      text: "Tax ID Deleted Successfully",
      icon: "success",
      button: "Ok",
    });
   
    
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
   
  }

  }

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

<Transition appear show={isOpen} as={Fragment} className="relative z-10000">
<Dialog as="div" className="relative z-10000" onClose={closeModal}>
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

  <div className="fixed inset-0 overflow-y-auto">
    <div className="flex min-h-full items-center justify-center p-4 text-center">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Add Tax ID
          </Dialog.Title>
            <Formik
              initialValues={initialData}
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

                    if (editIndex !== null) {
                        const taxid = editIndex;
                           let res = await findAndUpdateTax(
                            taxid,{ data: values }, token
                           );
                           localStorage.setItem("taxid",JSON.stringify(res.data.countries));

                           console.log(res.data);
                           if (res) {
                               setCountries(res.data.countries);
       
                             swal({
                               title: "Success",
                               text: "Tax ID Updated Successfully",
                               icon: "success",
                               button: "Ok",
                             });
                             setLoading(false);
                             setShowQuestionForm(false)
                             setIsOpen(false)
                             
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



return;
                    }
                    let res = await addTaxId(
                        { data: values },
                        token 
                    );
                    localStorage.setItem("taxid",JSON.stringify(res.data.countries));
                    console.log(res.data);
                    if (res && res.status === 200) {
                        setCountries(res.data.countries);

                      swal({
                        title: "Success",
                        text: "Tax ID Added Successfully",
                        icon: "success",
                        button: "Ok",
                      });
                      setLoading(false);
                      setShowQuestionForm(false)
                      setIsOpen(false)
                      
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
                // if (EditIndex !== null) {
                //   let temp = [...questions];
                //   temp[EditIndex] = values;
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
                  {loading && <button
                      type="submit"
                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                      style={{ backgroundColor: "#034488" }}
                    >
                      <img src={Loader} alt="loader" className="h-9 mx-auto" />
                    </button>}

                    {!loading && <button
                      type="submit"
                      className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                      style={{ backgroundColor: "#034488" }}
                    >
                      {editIndex === null
                        ? "Add Tax Id"
                        : " Save Changes"}
                    </button>}
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
            </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
          )}
          {!showQuestionForm && (
            <div>
              <button
                className="bg-[#034488] rounded-sm px-4 py-1 text-white"
                style={{ backgroundColor: "#034488" }}
                onClick={() => {
                  setIsOpen(true)
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
                    <span className="font-normal mx-2 w-1/2">Country :{item.country}</span>
</div>
                    <div className="font-semibold ">
                      <span className="font-normal mx-2 w-1/2">Tax ID : {item.tax_id}</span>
                    </div>
                    <div className=" flex">
                        <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        //  setEdit(index);
                        setInitialData(
                          item
                        );
                        setIsOpen(true);
                        setShowQuestionForm(true);
                        setEditIndex(item._id)
                      }}
                    />
                    <AiOutlineDelete
                      className="text-red-600 cursor-pointer mx-3"
                      onClick={ () => {DeleteTax(item._id) }}
                    />
                    </div>
                  </div>
                
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
