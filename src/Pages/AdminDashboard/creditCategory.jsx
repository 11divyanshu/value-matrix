import React, { useState, Fragment, useEffect } from "react";
import {
    getcreditList,
    getCompanycreditList,
    updateUserDetails,
    ListCreditCategory,
    addCreditCategory,
    updateCreditCategory
} from "../../service/api";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { BsCalendar, BsLinkedin } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { Popover } from "@headlessui/react";
import { ImCross } from "react-icons/im";

const CreditCategory = () => {
    const [creditList, setCreditList] = React.useState([]);
    const [modal, setModal] = React.useState(null);
    const [item, setItem] = React.useState(null);
    const [edit, setEdit] = React.useState(null);
    const [add_jobs, setadd_jobs] = React.useState(false);
    const [add_users, setadd_users] = React.useState(false);
    const [listCan, setlistCan] = React.useState(false);
    const [page, setPage] = useState(1);
    const [permissions, setPermissions] = React.useState([
        {
            title: "Add Jobs",
            id: "add_jobs",
            value: add_jobs,
        },
        {
            title: "Add Users",
            id: "add_users",
            value: add_users,
        },
        {
            title: "List Candidates",
            id: "list_candidates",
            value: listCan,
        },
    ]);

    const navigate = useNavigate();

    React.useEffect(() => {
        const initial = async () => {
            let user = JSON.parse(await localStorage.getItem("user"));
            let res = await getUserFromId({ id: user._id }, user.access_token);
            console.log(res);
            if (res && res.data && res.data.user) {
                if (res.data.user.permissions[0].admin_permissions.list_XI === false) {
                    navigate(-1);
                }
            }
        };
        initial();
    }, []);

    React.useEffect(() => {
        const initial = async () => {
            let token = await localStorage.getItem("access_token");
            let user = JSON.parse(await localStorage.getItem("user"));
            let response = await ListCreditCategory();
            if (response && response.status === 200) {
                setCreditList(response.data.category);
            }
        };
        initial();
    }, []);

    const [showLevelForm, setShowLevelForm] = React.useState(false);
    const [loader, setLoader] = useState(false);
    const paginate = (p) => {
        setPage(p);
        for (var i = 1; i <= creditList.length; i++) {
            document.getElementById("AdminUserCrd" + i).classList.add("hidden");
        }
        for (var j = 1; j <= 5; j++) {
            document
                .getElementById("AdminUserCrd" + ((p - 1) * 5 + j))
                .classList.remove("hidden");
        }
    };

    return (
        <div className="p-5">
            <div className="flex justify-between">
                <p className="text-2xl font-semibold mx-10">Credit Category</p>
                <div className="mx-1">
                    <button
                        className=" p-1 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                            setModal(true);
                            setShowLevelForm(false);
                        }}
                    >
                        Add Category
                    </button>
                </div>
            </div>
            <div className="mt-3">
                <div className=" md:w-3/4 mb-4 md:mx-5">
                    {loader ? (
                        <p>...Loading</p>
                    ) : (
                        <>
                            {/* <div className="flex justify-between w-full bg-white">
                                <div
                                    className="py-4 px-5 md:py-2 md:px-2"
                                    style={{ borderRadius: "6px 6px 0 0" }}
                                >
                                    <p className="text-gray-900 w-full font-bold">

                                    </p>
                                </div>
                            </div> */}
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
                                                                    <div className="my-3 w-3/4 md:w-full text-left flex ">
                                                                        <div className="w-full my-7">

                                                                            <Formik
                                                                                initialValues={{
                                                                                    category: item ? item.category : " ",
                                                                                    amount: item ? item.amount : " ",

                                                                                }}

                                                                                validate={async (values) => {
                                                                                    const errors = {};

                                                                                    if (!values.category) {
                                                                                        errors.category = "Required";
                                                                                    }
                                                                                   
                                                                                    if (!values.amount) {
                                                                                        errors.amount = "Required";
                                                                                    }
                                                                                   



                                                                                    return errors;
                                                                                }}
                                                                                onSubmit={async (values) => {
                                                                                    if (item !== null) {
                                                                                        const update = await updateCreditCategory({ id: item._id, updates: values });
                                                                                        if(update && update.status==200){

                                                                                            swal({
                                                                                                title: "Success",
                                                                                                text: "Category Updated Successfully",
                                                                                                icon: "success",
                                                                                                button: "Ok",
                                                                                              });
                                                                                                setCreditList(update.data.category);
                                                                                            
                                                                                        }else{
                                                                                            swal({
                                                                                                title: "Oops!",
                                                                                                text: "Something Went Wrong",
                                                                                                icon: "error",
                                                                                                button: "Ok",
                                                                                              });
                                                                                        }
                                                                                        setModal(false)

                                                                                        return;
                                                                                    }
                                                                                    const add = await addCreditCategory(values);
                                                                                    console.log(values)
                                                                                    setModal(false);
                                                                                    if(add && add.status==200){

                                                                                        swal({
                                                                                            title: "Success",
                                                                                            text: "Category Added Successfully",
                                                                                            icon: "success",
                                                                                            button: "Ok",
                                                                                          });
                                                                                        let response = await ListCreditCategory();
                                                                                        if (response && response.status === 200) {
                                                                                            setCreditList(response.data.category);
                                                                                        }
                                                                                        setModal(false)
                                                                                    }else{
                                                                                        swal({
                                                                                            title: "Oops!",
                                                                                            text: "Something Went Wrong",
                                                                                            icon: "error",
                                                                                            button: "Ok",
                                                                                          });
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {({ values }) => (
                                                                                    <Form>
                                                                                        {/* <div className="flex flex-wrap w-full gap-y-5"> */}



                                                                                        <div className="w-full my-5">
                                                                                            <h2 className="font-semibold my-3">
                                                                                                Category
                                                                                            </h2>
                                                                                            <Field
                                                                                                className="w-full rounded-lg border-gray-100"
                                                                                                type="text"
                                                                                                name="category"
                                                                                                placeholder="Enter Value"
                                                                                                id=""
                                                                                            />
                                                                                            <ErrorMessage
                                                                                                name="category"
                                                                                                component="div"
                                                                                                className="text-sm text-red-600"
                                                                                            />
                                                                                        </div>
                                                                                       
                                                                                        <div className="w-full my-5">
                                                                                            <h2 className="font-semibold my-3">
                                                                                                Amount
                                                                                            </h2>
                                                                                            <Field
                                                                                                className="w-full rounded-lg border-gray-100"
                                                                                                type="number"
                                                                                                name="amount"
                                                                                                placeholder="Enter Value"
                                                                                                id=""
                                                                                            />
                                                                                             <ErrorMessage
                                                                                                name="amount"
                                                                                                component="div"
                                                                                                className="text-sm text-red-600"
                                                                                            />
                                                                                        </div>
                                                                                       

                                                                                        <div className="w-full my-3">
                                                                                            <button
                                                                                                className="bg-[#034488] text-white rounded-sm px-4 py-1"
                                                                                                type="submit"
                                                                                                onClick={() => {
                                                                                                    // setShowCategoryForm(true);
                                                                                                }}
                                                                                                style={{
                                                                                                    backgroundColor: "#034488",
                                                                                                    color: "#fff",
                                                                                                }}
                                                                                            >
                                                                                                Submit
                                                                                            </button>
                                                                                        </div>
                                                                                    </Form>
                                                                                )}
                                                                            </Formik>
                                                                        </div>
                                                                        <div>
                                                                            <button
                                                                                className="bg-[#034488] text-white rounded-sm py-1 my-2"
                                                                                onClick={() => setModal(false)}
                                                                                style={{
                                                                                    backgroundColor: "#fff",
                                                                                    color: "#034488",
                                                                                }}
                                                                            >
                                                                                <ImCross />
                                                                            </button>
                                                                        </div>
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
                        </>
                    )}
                </div>
                <div className="flex flex-col mx-10">
                    <div className="overflow-x-auto w-full sm:-mx-6 lg:-mx-8">
                        <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-white border-b">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                #
                                            </th>
                                            <th
                                                scope="col"
                                                className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                Category
                                            </th>
                                        
                                            <th
                                                scope="col"
                                                className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                Amount (in $)
                                            </th>
                                           
                                            <th
                                                scope="col"
                                                className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                                            ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditList.map((item, index) => {
                                            return (
                                                <>
                                                    <tr
                                                        id={"AdminUserCrd" + (index + 1)}
                                                        className={
                                                            index < 5 ? "bg-gray-100" : "bg-gray-100 hidden"
                                                        }
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                                                            {item.category}
                                                        </td>
                                                      
                                                        <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                                                            {item.amount}
                                                        </td>
                                                       
                                                        <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                                                            <Popover className="relative mt-1">
                                                                {({ open }) => (
                                                                    <>
                                                                        <Popover.Button
                                                                            className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                                                        >
                                                                            <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
                                                                        </Popover.Button>
                                                                        <Transition
                                                                            as={Fragment}
                                                                            enter="transition ease-out duration-200"
                                                                            enterFrom="opacity-0 translate-y-1"
                                                                            enterTo="opacity-100 translate-y-0"
                                                                            leave="transition ease-in duration-150"
                                                                            leaveFrom="opacity-100 translate-y-0"
                                                                            leaveTo="opacity-0 translate-y-1"
                                                                        >
                                                                            <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                                                                <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                                                                    <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
                                                                                        <div
                                                                                            className="flex items-center border-b text-gray-800 space-x-2"
                                                                                            onClick={async () => { 
                                                                                                setItem(item);
                                                                                                setModal(true);
                                                                                            }}
                                                                                        >
                                                                                            {/* <BsThreeDots className="text-md" /> */}
                                                                                            <p className="text-sm font-semibold py-2">
                                                                                                Update
                                                                                            </p>{" "}
                                                                                        </div>
                                                                                        <div className="flex items-center text-gray-800 space-x-2"
                                                                                         onClick={async () => { 
                                                                                            const update = await updateCreditCategory({ id: item._id, updates: {isDeleted:true} });
                                                                                            if(update && update.status==200){
    
                                                                                                swal({
                                                                                                    title: "Success",
                                                                                                    text: "Category Deleted",
                                                                                                    icon: "success",
                                                                                                    button: "Ok",
                                                                                                  });
                                                                                                    setCreditList(update.data.category);
                                                                                                
                                                                                            }else{
                                                                                                swal({
                                                                                                    title: "Oops!",
                                                                                                    text: "Something Went Wrong",
                                                                                                    icon: "error",
                                                                                                    button: "Ok",
                                                                                                  });
                                                                                            }
                                                                                        }}
                                                                                        >
                                                                                            {/* <BsThreeDots className="text-md" /> */}
                                                                                            <p className="text-sm font-semibold py-1 cursor-pointer">
                                                                                                Delete
                                                                                            </p>{" "}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Popover.Panel>
                                                                        </Transition>
                                                                    </>
                                                                )}
                                                            </Popover>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className={creditList.length > 5 ? "w-full" : "hidden"}>
                                    <div className="flex justify-between my-2 mx-1">
                                        <div>
                                            Page {page} of {Math.ceil(creditList.length / 5)}
                                        </div>
                                        <div>
                                            {" "}
                                            {creditList &&
                                                creditList.map((user, index) => {
                                                    return index % 5 == 0 ? (
                                                        <span
                                                            className="mx-2"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                paginate(index / 5 + 1);
                                                            }}
                                                        >
                                                            {index / 5 + 1}
                                                        </span>
                                                    ) : null;
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCategory;
