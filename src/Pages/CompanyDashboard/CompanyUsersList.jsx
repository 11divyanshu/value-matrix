import React, { useState, Fragment } from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
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

const CandiadateList = (props) => {
  const [userList, setUserList] = React.useState([]);
  const [Modal, setModal] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [index, setIndex] = React.useState(props.index);
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

  // const navigate = useNavigate();

  //   React.useState(() => {
  //     const initial = async () => {
  //       let user = JSON.parse(await localStorage.getItem("user"));
  //       let res =await  getUserFromId({ id: user._id }, user.access_token);
  //       if (res && res.data && res.data.user) {

  //       }
  //     };
  //     initial();
  //   }, []);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= userList.length; i++) {
      document.getElementById("intercard" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("intercard" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  return (
    <div className="p-5">
      <p className="text-2xl font-semibold mx-10">Company Users List</p>
      <div className="mt-3">
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
                        Username
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
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
                            id={"intercard" + (index + 1)}
                            className={
                              index < 5
                                ? "w-full px-5 bg-white py-1 my-2"
                                : "w-full px-5 bg-white py-1 my-2 hidden"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {user.username}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {user.firstName}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {user.email}
                            </td>
                            <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                              <p
                                onClick={() => {
                                  setModal(true);

                                  setadd_jobs(
                                    user.permissions[0].company_permissions
                                      .add_jobs
                                  );
                                  setadd_users(
                                    user.permissions[0].company_permissions
                                      .add_users
                                  );
                                  setlistCan(
                                    user.permissions[0].company_permissions
                                      .list_candidates
                                  );
                                  setPermissions([
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
                                }}
                              >
                                View Detail
                              </p>
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
                                onClose={() => {}}
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
                                            <p className="text-2xl font-bold">
                                              User Details
                                            </p>{" "}
                                            <button
                                              type="button"
                                              className="my-1 px-3 py-2 rounded-lg text-center bg-[#034488] text-white "
                                              style={{
                                                backgroundColor: "#034488",
                                              }}
                                              onClick={() => setModal(false)}
                                            >
                                              Close
                                            </button>
                                          </div>
                                          <div className="flex w-full items-center">
                                            <p className="text-xl font-bold my-5 capitalize">
                                              {user.firstName} {user.lastname}
                                            </p>
                                          </div>
                                          <div className="space-y-2 bg-gray-100 p-3 rounded-sm">
                                            <p>
                                              <span className="font-semibold">
                                                Username :
                                              </span>{" "}
                                              {user.username}
                                            </p>
                                            <p>
                                              <span className="font-semibold">
                                                Email :
                                              </span>{" "}
                                              {user.email}
                                            </p>
                                            <p>
                                              <span className="font-semibold">
                                                Contact :
                                              </span>{" "}
                                              {user.contact}
                                            </p>
                                            {user.address && (
                                              <p>
                                                <span className="font-semibold">
                                                  Address :
                                                </span>{" "}
                                                {user.address}
                                              </p>
                                            )}
                                          </div>
                                          {user.education &&
                                            user.education.length > 0 && (
                                              <div className="bg-gray-100 my-3 p-3">
                                                <p className="font-semibold">
                                                  Education
                                                </p>
                                                {user.education &&
                                                  user.education.length > 0 &&
                                                  user.education.map((edu) => {
                                                    return (
                                                      <div className="p-3 bg-white my-2 w-3/4">
                                                        <p className="font-semibold">
                                                          {edu.school}
                                                        </p>
                                                        <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                                                          <div className="flex space-x-2 text-sm items-center">
                                                            <FiInfo />
                                                            <p>
                                                              {edu.degree}
                                                            </p>{" "}
                                                            <p>|</p>{" "}
                                                            <p>
                                                              {
                                                                edu.field_of_study
                                                              }
                                                            </p>
                                                          </div>
                                                          {edu.grade && (
                                                            <div className="space-x-2 flex items-center">
                                                              <GrScorecard />{" "}
                                                              <p>{edu.grade}</p>
                                                            </div>
                                                          )}
                                                          <div className="flex items-center space-x-2">
                                                            <BsCalendar />
                                                            <p className="text-sm text-gray-600 mr-5">
                                                              {edu.start_date} -{" "}
                                                              {edu.end_date}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        {edu.description && (
                                                          <div className="py-2">
                                                            {edu.description}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                              </div>
                                            )}
                                          {user.experience &&
                                            user.experience.length > 0 && (
                                              <div className="bg-gray-100 my-3 p-3">
                                                <p className="font-semibold">
                                                  Experience
                                                </p>
                                                {user.experience &&
                                                  user.experience.length > 0 &&
                                                  user.experience.map((exp) => {
                                                    return (
                                                      <div className="p-3 bg-white my-2 w-3/4">
                                                        <p className="font-semibold">
                                                          {exp.title}
                                                        </p>
                                                        <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                                                          <div className="space-x-2 flex items-center">
                                                            <FaRegBuilding />
                                                            <p>
                                                              {exp.company_name}
                                                            </p>
                                                          </div>
                                                          <div className="space-x-2 flex items-center">
                                                            <CgWorkAlt />
                                                            <p>
                                                              {exp.industry}
                                                            </p>
                                                          </div>
                                                          <div className="flex items-center space-x-2">
                                                            <BsCalendar />
                                                            <p className="text-sm text-gray-600 mr-5">
                                                              {exp.start_date} -{" "}
                                                              {exp.end_date}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        {exp.description && (
                                                          <div className="py-2">
                                                            {exp.description}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                              </div>
                                            )}
                                          {user.associate &&
                                            user.associate.length > 0 && (
                                              <div className="bg-gray-100 my-3 p-3">
                                                <p className="font-semibold">
                                                  Association
                                                </p>
                                                {user.associate &&
                                                  user.associate.length > 0 &&
                                                  user.associate.map((exp) => {
                                                    return (
                                                      <div className="p-3 bg-white my-2 w-3/4">
                                                        <p className="font-semibold">
                                                          {exp.title}
                                                        </p>
                                                        <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                                                          <div className="space-x-2 flex items-center">
                                                            <FaRegBuilding />
                                                            <p>
                                                              {exp.company_name}
                                                            </p>
                                                          </div>
                                                          <div className="space-x-2 flex items-center">
                                                            <CgWorkAlt />
                                                            <p>
                                                              {exp.industry}
                                                            </p>
                                                          </div>
                                                          <div className="flex items-center space-x-2">
                                                            <BsCalendar />
                                                            <p className="text-sm text-gray-600 mr-5">
                                                              {exp.start_date} -{" "}
                                                              {exp.end_date}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        {exp.description && (
                                                          <div className="py-2">
                                                            {exp.description}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                              </div>
                                            )}
                                          <div className="my-3">
                                            <label
                                              htmlFor="permissions"
                                              className=" my-2 text-gray-700 text-xl font-bold"
                                            >
                                              User permissions
                                            </label>

                                            <div className=" my-4">
                                              <Formik
                                                initialValues={{
                                                  add_jobs: add_jobs,
                                                  add_users: add_users,
                                                  list_candidates: listCan,
                                                }}
                                                validate={(values) => {
                                                  const errors = {};

                                                  // let r = values.permission.filter((item) => item.value);
                                                  // if (r.length === 0) {
                                                  //     errors.permission = "Please select atleast one permission";
                                                  // }
                                                  return errors;
                                                }}
                                                onSubmit={async () => {
                                                  let permission = {
                                                    add_jobs: add_jobs,
                                                    add_users: add_users,
                                                    list_candidates: listCan,
                                                  };
                                                  console.log(permission);

                                                  let res =
                                                    await updateUserDetails(
                                                      {
                                                        email: user.email,
                                                        contact: user.contact,
                                                        username: user.username,
                                                        user_id: user._id,

                                                        updates: {
                                                          permissions: [
                                                            {
                                                              company_permissions:
                                                                permission,
                                                              admin_permissions:
                                                                null,
                                                            },
                                                          ],
                                                        },
                                                      },
                                                      user.access_token
                                                    );
                                                  if (res) {
                                                    swal({
                                                      title:
                                                        "User Updated Successfully !",
                                                      message: "Success",
                                                      icon: "success",
                                                      button: "Continue",
                                                    });
                                                  }
                                                }}
                                              >
                                                {({ values }) => {
                                                  return (
                                                    <Form className="container bg-white p-5  w-4/5">
                                                      <div className="block">
                                                        <div>
                                                          {" "}
                                                          <Field
                                                            type="checkbox"
                                                            name="add_jobs"
                                                            className="my-1 "
                                                            onClick={() => {
                                                              let temp =
                                                                permissions;

                                                              temp[0].value =
                                                                !temp[0].value;
                                                              setadd_jobs(
                                                                !add_jobs
                                                              );
                                                              setPermissions(
                                                                temp
                                                              );
                                                            }}
                                                          />
                                                          <label
                                                            htmlFor="permissions"
                                                            className="text-gray-700 mx-3 font-bold"
                                                          >
                                                            Add Jobs
                                                          </label>
                                                        </div>

                                                        <div>
                                                          <Field
                                                            type="checkbox"
                                                            name="add_users"
                                                            className="my-1 "
                                                            onClick={() => {
                                                              let temp =
                                                                permissions;
                                                              setadd_users(
                                                                !add_users
                                                              );

                                                              temp[1].value =
                                                                !temp[1].value;
                                                              setPermissions(
                                                                temp
                                                              );
                                                            }}
                                                          />
                                                          <label
                                                            htmlFor="permissions"
                                                            className="text-gray-700 mx-3 font-bold"
                                                          >
                                                            Add Users
                                                          </label>
                                                        </div>

                                                        <div>
                                                          <Field
                                                            type="checkbox"
                                                            name="list_candidates"
                                                            className="my-1 "
                                                            onClick={() => {
                                                              let temp =
                                                                permissions;
                                                              setlistCan(
                                                                !listCan
                                                              );
                                                              temp[2].value =
                                                                !temp[2].value;
                                                              setPermissions(
                                                                temp
                                                              );
                                                            }}
                                                          />
                                                          <label
                                                            htmlFor="permissions"
                                                            className="text-gray-700 mx-3 font-bold"
                                                          >
                                                            List Candidates
                                                          </label>
                                                        </div>
                                                      </div>

                                                      <button
                                                        className="bg-[#034488] text-white rounded-sm py-1 my-4 px-4"
                                                        type="submit"
                                                        style={{
                                                          backgroundColor:
                                                            "#034488",
                                                        }}
                                                      >
                                                        Update
                                                      </button>
                                                    </Form>
                                                  );
                                                }}
                                              </Formik>
                                            </div>
                                          </div>{" "}
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
                <div className="w-full">
                  {Math.ceil(userList.length / 5) != 0?
                    <div className="flex justify-between my-2 mx-1">
                      <div>
                        Page {page} of {Math.ceil(userList.length / 5)}
                      </div>
                      <div>
                        {" "}
                        {userList &&
                          userList.map((userList, index) => {
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
                  :<h5 className="text-center font-bold mt-4">No Users Found</h5>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandiadateList;
