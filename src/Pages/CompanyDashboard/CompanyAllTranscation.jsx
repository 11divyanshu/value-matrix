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

const CompanyAllTranscation = () => {
  const [userList, setUserList] = React.useState([]);
  const [Modal, setModal] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
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
  return (
    <div className="p-5">
      <p className="text-2xl font-semibold mx-10">All Transcation</p>
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
                        Transcation Date
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Transcation Time
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Transcation Type
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => {
                      return (
                        <>
                          <tr
                            className={`${
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } border-b`}
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
                                }}
                              >
                                Download Invoice
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
                                              Invoice
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
                                        </div>
                                        <div>
                                          <section class="py-20 bg-black">
                                            <div class="max-w-5xl mx-auto py-16 bg-white">
                                              <article class="overflow-hidden">
                                                <div class="bg-[white] rounded-b-md">
                                                  <div class="p-9">
                                                    <div class="space-y-6 text-slate-700">
                                                      <img
                                                        class="object-cover h-12"
                                                        src="https://pbs.twimg.com/profile_images/1513243060834123776/dL8-d7zI_400x400.png"
                                                      />

                                                      <p class="text-xl font-extrabold tracking-tight uppercase font-body">
                                                        Unwrapped.design
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div class="p-9">
                                                    <div class="flex w-full">
                                                      <div class="grid grid-cols-4 gap-12">
                                                        <div class="text-sm font-light text-slate-500">
                                                          <p class="text-sm font-normal text-slate-700">
                                                            Invoice Detail:
                                                          </p>
                                                          <p>Unwrapped</p>
                                                          <p>Fake Street 123</p>
                                                          <p>San Javier</p>
                                                          <p>CA 1234</p>
                                                        </div>
                                                        <div class="text-sm font-light text-slate-500">
                                                          <p class="text-sm font-normal text-slate-700">
                                                            Billed To
                                                          </p>
                                                          <p>
                                                            The Boring Company
                                                          </p>
                                                          <p>
                                                            Tesla Street 007
                                                          </p>
                                                          <p>Frisco</p>
                                                          <p>CA 0000</p>
                                                        </div>
                                                        <div class="text-sm font-light text-slate-500">
                                                          <p class="text-sm font-normal text-slate-700">
                                                            Invoice Number
                                                          </p>
                                                          <p>000000</p>

                                                          <p class="mt-2 text-sm font-normal text-slate-700">
                                                            Date of Issue
                                                          </p>
                                                          <p>00.00.00</p>
                                                        </div>
                                                        <div class="text-sm font-light text-slate-500">
                                                          <p class="text-sm font-normal text-slate-700">
                                                            Terms
                                                          </p>
                                                          <p>0 Days</p>

                                                          <p class="mt-2 text-sm font-normal text-slate-700">
                                                            Due
                                                          </p>
                                                          <p>00.00.00</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div class="p-9">
                                                    <div class="flex flex-col mx-0 mt-8">
                                                      <table class="min-w-full divide-y divide-slate-500">
                                                        <thead>
                                                          <tr>
                                                            <th
                                                              scope="col"
                                                              class="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0"
                                                            >
                                                              Description
                                                            </th>
                                                            <th
                                                              scope="col"
                                                              class="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                                                            >
                                                              Quantity
                                                            </th>
                                                            <th
                                                              scope="col"
                                                              class="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                                                            >
                                                              Rate
                                                            </th>
                                                            <th
                                                              scope="col"
                                                              class="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0"
                                                            >
                                                              Amount
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          <tr class="border-b border-slate-200">
                                                            <td class="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                                                              <div class="font-medium text-slate-700">
                                                                Tesla Truck
                                                              </div>
                                                              <div class="mt-0.5 text-slate-500 sm:hidden">
                                                                1 unit at $0.00
                                                              </div>
                                                            </td>
                                                            <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                              48
                                                            </td>
                                                            <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                              $0.00
                                                            </td>
                                                            <td class="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                              $0.00
                                                            </td>
                                                          </tr>
                                                          <tr class="border-b border-slate-200">
                                                            <td class="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                                                              <div class="font-medium text-slate-700">
                                                                Tesla Charging
                                                                Station
                                                              </div>
                                                              <div class="mt-0.5 text-slate-500 sm:hidden">
                                                                1 unit at $75.00
                                                              </div>
                                                            </td>
                                                            <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                              4
                                                            </td>
                                                            <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                              $0.00
                                                            </td>
                                                            <td class="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                              $0.00
                                                            </td>
                                                          </tr>

                                                          {/* <!-- Here you can write more products/tasks that you want to charge for--> */}
                                                        </tbody>
                                                        <tfoot>
                                                          <tr>
                                                            <th
                                                              scope="row"
                                                              colspan="3"
                                                              class="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0"
                                                            >
                                                              Subtotal
                                                            </th>
                                                            <th
                                                              scope="row"
                                                              class="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden"
                                                            >
                                                              Subtotal
                                                            </th>
                                                            <td class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                              $0.00
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <th
                                                              scope="row"
                                                              colspan="3"
                                                              class="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0"
                                                            >
                                                              Discount
                                                            </th>
                                                            <th
                                                              scope="row"
                                                              class="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden"
                                                            >
                                                              Discount
                                                            </th>
                                                            <td class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                              $0.00
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <th
                                                              scope="row"
                                                              colspan="3"
                                                              class="hidden pt-4 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0"
                                                            >
                                                              Tax
                                                            </th>
                                                            <th
                                                              scope="row"
                                                              class="pt-4 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden"
                                                            >
                                                              Tax
                                                            </th>
                                                            <td class="pt-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                              $0.00
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <th
                                                              scope="row"
                                                              colspan="3"
                                                              class="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0"
                                                            >
                                                              Total
                                                            </th>
                                                            <th
                                                              scope="row"
                                                              class="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden"
                                                            >
                                                              Total
                                                            </th>
                                                            <td class="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
                                                              $0.00
                                                            </td>
                                                          </tr>
                                                        </tfoot>
                                                      </table>
                                                    </div>
                                                  </div>

                                                  <div class="mt-48 p-9">
                                                    <div class="border-t pt-9 border-slate-200">
                                                      <div class="text-sm font-light text-slate-700">
                                                        <p>
                                                          Payment terms are 14
                                                          days. Please be aware
                                                          that according to the
                                                          Late Payment of
                                                          Unwrapped Debts Act
                                                          0000, freelancers are
                                                          entitled to claim a
                                                          00.00 late fee upon
                                                          non-payment of debts
                                                          after this time, at
                                                          which point a new
                                                          invoice will be
                                                          submitted with the
                                                          addition of this fee.
                                                          If payment of the
                                                          revised invoice is not
                                                          received within a
                                                          further 14 days,
                                                          additional interest
                                                          will be charged to the
                                                          overdue account and a
                                                          statutory rate of 8%
                                                          plus Bank of England
                                                          base of 0.5%,
                                                          totalling 8.5%.
                                                          Parties cannot
                                                          contract out of the
                                                          Act’s provisions.
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </article>
                                            </div>
                                          </section>
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
    </div>
  );
};

export default CompanyAllTranscation;
