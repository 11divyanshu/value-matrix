import React, { useState, Fragment } from "react";
import { getUserList, getCompanyUserList } from "../../service/api";
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

const CandiadateList = () => {
    const [userList, setUserList] = React.useState([]);
    const [Modal, setModal] = React.useState(null);

    React.useEffect(() => {
        const initial = async () => {
            let token = await localStorage.getItem("access_token");
            let user = JSON.parse(await localStorage.getItem("user"));
            let response = await getCompanyUserList(user._id);
            console.log(response);
            if (response && response.status === 200) {
                setUserList(response.data);
            }
        };
        initial();
    }, []);

    const navigate = useNavigate();

    //   React.useState(() => {
    //     const initial = async () => {
    //       let user = JSON.parse(await localStorage.getItem("user"));
    //       let res =await  getUserFromId({ id: user._id }, user.access_token);
    //       if (res && res.data && res.data.user) {
    //         if (
    //           res.data.user.permissions[0].admin_permissions.list_candidates === false
    //         ) {
    //           navigate(-1);
    //         }
    //       }
    //     };
    //     initial();  
    //   }, []);


    return (
        <div className="p-5">
            <p className="text-2xl font-semibold">Company Users List</p>
            <div className="mt-3">
                <div class="flex flex-col">
                    <div class="overflow-x-auto w-[90%] sm:-mx-6 lg:-mx-8">
                        <div class="py-2 inline-block w-full sm:px-6 lg:px-8">
                            <div class="overflow-hidden">
                                <table class="w-full">
                                    <thead class="bg-white border-b">
                                        <tr>
                                            <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                #
                                            </th>
                                            <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                Username
                                            </th>
                                            <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                First Name
                                            </th>
                                            <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                            >
                                                View Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((user, index) => {
                                            return (
                                                <>
                                                    <tr
                                                        class={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                            } border-b`}
                                                    >
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                            {user.username}
                                                        </td>
                                                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                            {user.firstName}
                                                        </td>
                                                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                            {user.email}
                                                        </td>
                                                        <td class="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                                                            <p onClick={() => { setModal(true) }}>View Detail</p>
                                                        </td>
                                                    </tr>


                                                    {Modal && user && (
                                                        <Transition
                                                            appear
                                                            show={Modal}
                                                            as={Fragment}
                                                            className="relative z-10000"
                                                            style={{ zIndex: 1000 }}
                                                        >
                                                            <Dialog
                                                                as="div"
                                                                className="relative z-10000"
                                                                onClose={() => { }}
                                                                static={true}
                                                            >
                                                                <div
                                                                    className="fixed inset-0 bg-black/30 z-10000"
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
                                                                    <div className="fixed inset-0 bg-black bg-opacity-25 z-10000" />
                                                                </Transition.Child>

                                                                <div className="fixed inset-0 overflow-y-auto z-10000">
                                                                    <div className="flex min-h-full items-center justify-center z-10000 p-4 text-center">
                                                                        <Transition.Child
                                                                            as={Fragment}
                                                                            enter="ease-out duration-300"
                                                                            enterFrom="opacity-0 scale-95"
                                                                            enterTo="opacity-100 scale-100"
                                                                            leave="ease-in duration-200"
                                                                            leaveFrom="opacity-100 scale-100"
                                                                            leaveTo="opacity-0 scale-95"
                                                                        >
                                                                            <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                                                                                <div>
                                                                                    <div className="flex justify-between w-full">
                                                                                        <p className="text-2xl font-bold">Candidate Details</p>   <button
                                                                                            type="button"
                                                                                            className="my-1 px-3 py-2 rounded-lg text-center bg-[#034488] text-white "
                                                                                            style={{ backgroundColor: "#034488" }}
                                                                                            onClick={()=>setModal(false)}
                                                                                        >
                                                                                            Close
                                                                                        </button></div>
                                                                                    <div className="flex w-full items-center">
                                                                                        <p className="text-xl font-bold my-5 capitalize">
                                                                                            {user.firstName} {user.lastname}
                                                                                        </p>

                                                                                    </div>
                                                                                    <div className="space-y-2 bg-gray-100 p-3 rounded-sm">
                                                                                        <p>
                                                                                            <span className="font-semibold">Username :</span>{" "}
                                                                                            {user.username}
                                                                                        </p>
                                                                                        <p>
                                                                                            <span className="font-semibold">Email :</span> {user.email}
                                                                                        </p>
                                                                                        <p>
                                                                                            <span className="font-semibold">Contact :</span>{" "}
                                                                                            {user.contact}
                                                                                        </p>
                                                                                        {user.address && (
                                                                                            <p>
                                                                                                <span className="font-semibold">Address :</span>{" "}
                                                                                                {user.address}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>


                                                                                    {user.education && user.education.length > 0 && (
                                                                                        <div className="bg-gray-100 my-3 p-3">
                                                                                            <p className="font-semibold">Education</p>
                                                                                            {user.education &&
                                                                                                user.education.length > 0 &&
                                                                                                user.education.map((edu) => {
                                                                                                    return (
                                                                                                        <div className="p-3 bg-white my-2 w-3/4">
                                                                                                            <p className="font-semibold">{edu.school}</p>
                                                                                                            <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                                                                                                                <div className="flex space-x-2 text-sm items-center">
                                                                                                                    <FiInfo />
                                                                                                                    <p>{edu.degree}</p> <p>|</p>{" "}
                                                                                                                    <p>{edu.field_of_study}</p>
                                                                                                                </div>
                                                                                                                {edu.grade && (
                                                                                                                    <div className="space-x-2 flex items-center">
                                                                                                                        <GrScorecard /> <p>{edu.grade}</p>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                    <BsCalendar />
                                                                                                                    <p className="text-sm text-gray-600 mr-5">
                                                                                                                        {edu.start_date} - {edu.end_date}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {edu.description && (
                                                                                                                <div className="py-2">{edu.description}</div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                        </div>
                                                                                    )}
                                                                                    {user.experience && user.experience.length > 0 && (
                                                                                        <div className="bg-gray-100 my-3 p-3">
                                                                                            <p className="font-semibold">Experience</p>
                                                                                            {user.experience &&
                                                                                                user.experience.length > 0 &&
                                                                                                user.experience.map((exp) => {
                                                                                                    return (
                                                                                                        <div className="p-3 bg-white my-2 w-3/4">
                                                                                                            <p className="font-semibold">{exp.title}</p>
                                                                                                            <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                                                                                                                <div className="space-x-2 flex items-center">
                                                                                                                    <FaRegBuilding />
                                                                                                                    <p>{exp.company_name}</p>
                                                                                                                </div>
                                                                                                                <div className="space-x-2 flex items-center">
                                                                                                                    <CgWorkAlt />
                                                                                                                    <p>{exp.industry}</p>
                                                                                                                </div>
                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                    <BsCalendar />
                                                                                                                    <p className="text-sm text-gray-600 mr-5">
                                                                                                                        {exp.start_date} - {exp.end_date}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {exp.description && (
                                                                                                                <div className="py-2">{exp.description}</div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                        </div>
                                                                                    )}
                                                                                    {user.associate && user.associate.length > 0 && (
                                                                                        <div className="bg-gray-100 my-3 p-3">
                                                                                            <p className="font-semibold">Association</p>
                                                                                            {user.associate &&
                                                                                                user.associate.length > 0 &&
                                                                                                user.associate.map((exp) => {
                                                                                                    return (
                                                                                                        <div className="p-3 bg-white my-2 w-3/4">
                                                                                                            <p className="font-semibold">{exp.title}</p>
                                                                                                            <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                                                                                                                <div className="space-x-2 flex items-center">
                                                                                                                    <FaRegBuilding />
                                                                                                                    <p>{exp.company_name}</p>
                                                                                                                </div>
                                                                                                                <div className="space-x-2 flex items-center">
                                                                                                                    <CgWorkAlt />
                                                                                                                    <p>{exp.industry}</p>
                                                                                                                </div>
                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                    <BsCalendar />
                                                                                                                    <p className="text-sm text-gray-600 mr-5">
                                                                                                                        {exp.start_date} - {exp.end_date}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {exp.description && (
                                                                                                                <div className="py-2">{exp.description}</div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                        </div>
                                                                                    )}
                                                                                    {user.tools && user.tools.length > 0 && (
                                                                                        <div className="bg-gray-100 my-3 p-3">
                                                                                            <p className="font-semibold">Skills</p>
                                                                                            <div className="bg-white p-3 my-2 flex flex-wrap space-x-4">
                                                                                                {user.tools &&
                                                                                                    user.tools.length > 0 &&
                                                                                                    user.tools.map((skill) => {
                                                                                                        return <div className="bg-gray-100 px-2 py-1">{skill}</div>;
                                                                                                    })}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                            </Dialog.Panel>
                                                                        </Transition.Child>
                                                                    </div>
                                                                </div>
                                                            </Dialog>
                                                        </Transition>
                                                    )}









                                                </>

                                            );

                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div><SkillsUpload/></div> */}
        </div>
    );
};

export default CandiadateList;
