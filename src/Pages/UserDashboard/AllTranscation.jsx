import React, { useState, Fragment } from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
  getTransactions,
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
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";

import logo from "../../assets/images/logo.png";

const AllTranscation = (props) => {
  const [user, setUser] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [transactionprint, setTransactionprint] = React.useState(null);
  const [Modal, setModal] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [page, setPage] = useState(1);
  const [index, setIndex] = React.useState(props.index);
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
      setUser(user);
      console.log(user);
      let response = await getTransactions(user._id);
      console.log(response);
      if (response && response.status === 200) {
        setUserList(response.data);
      }
    };
    initial();
  }, []);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= userList.length; i++) {
      document.getElementById("invcrd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("invcrd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };
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
                    {userList.map((item, index) => {
                      return (
                        <>
                          <tr
                            id={"invcrd" + (index + 1)}
                            className={
                              index < 5
                                ? "w-full px-5 bg-white py-1 border border-b"
                                : "w-full px-5 bg-white py-1 border border-b hidden"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {new Date(item.transactionDate).getDate() +
                                "-" +
                                (new Date(item.transactionDate).getMonth() +
                                  1) +
                                "-" +
                                new Date(item.transactionDate).getFullYear()}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {new Date(item.transactionDate).getHours() +
                                ":" +
                                new Date(
                                  item.transactionDate
                                ).getMinutes()}{" "}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              Credit
                            </td>
                            <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                              <p
                                onClick={() => {
                                  setTransactionprint(item);
                                  setModal(true);
                                }}
                              >
                                Download Invoice
                              </p>
                            </td>
                          </tr>

                          {Modal && item && (
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
                                          <div>
                                            <div className="flex justify-between w-full">
                                              <p className="text-2xl font-bold">
                                                Transaction Invoice
                                              </p>{" "}
                                              <div>
                                                <button
                                                  type="button"
                                                  className="my-1 px-3 py-2 rounded-lg text-center bg-[#034488] text-white "
                                                  style={{
                                                    backgroundColor: "#034488",
                                                  }}
                                                  onClick={() =>
                                                    setModal(false)
                                                  }
                                                >
                                                  Close
                                                </button>
                                                <button
                                                  className="my-1 px-3 py-2 rounded-lg mx-3 text-center bg-[#034488] text-white "
                                                  style={{
                                                    backgroundColor: "#034488",
                                                  }}
                                                  onClick={() => {
                                                    var node =
                                                      document.getElementById(
                                                        "my-node"
                                                      );

                                                    htmlToImage
                                                      .toPng(node)
                                                      .then(function (dataUrl) {
                                                        var img = new Image();
                                                        img.src = dataUrl;
                                                        // document.body.appendChild(img);
                                                        console.log(dataUrl);
                                                        window.jsPDF =
                                                          window.jspdf.jsPDF;
                                                        let doc = new jsPDF(
                                                          "p",
                                                          "mm",
                                                          "a4",
                                                          true,
                                                          "UTF-8",
                                                          true
                                                        );
                                                        let width =
                                                          doc.internal.pageSize.getWidth();
                                                        let height =
                                                          doc.internal.pageSize.getHeight()-60;

                                                        // Then you can use this width and height for your image to fit the entire PDF document.
                                                        let imgData = dataUrl;
                                                        doc.addImage(
                                                          imgData,
                                                          "JPEG",
                                                          0,
                                                          0,
                                                          width,
                                                          height
                                                        );
                                                        doc.save("Valuematrix_Transaction_Invoice.pdf");
                                                      })
                                                      .catch(function (error) {
                                                        console.error(
                                                          "oops, something went wrong!",
                                                          error
                                                        );
                                                      });
                                                  }}
                                                >
                                                  Save as PDF
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <section class="bg-black">
                                              <div class="max-w-5xl mx-auto py-16 bg-white">
                                                <article class="overflow-hidden">
                                                  <div class="bg-[white] rounded-b-md" id="my-node">
                                                    <div class="p-9">
                                                      <div class="py-6 text-slate-700">
                                                        <img
                                                          class="object-cover h-12"
                                                          src={logo}
                                                        />
                                                        <p className="font-bold mt-4">VALUEMATRIX LAB INC.</p>
                                                        <p className="font-semibold text-sm text-slate-500">16192 Coastal Highway, Lewes, Delaware, USA - 19958</p>
                                                      </div>
                                                    </div>
                                                    <div class="p-9">
                                                      <div class="flex w-full">
                                                        <div class="grid grid-cols-3 gap-12">
                                                          <div class="text-sm font-light text-slate-500">
                                                            <p class="text-sm font-semibold text-slate-700">
                                                              Billed To
                                                            </p>
                                                            <p>
                                                              {user?<>
                                                                {user.houseNo}, {user.street}, {user.city} {user.state}, {user.country} - {user.zip}
                                                              </>:null}
                                                            </p>
                                                          </div>
                                                          <div class="text-sm font-light text-slate-500">
                                                            <p class="text-sm font-semibold text-slate-700">
                                                              Invoice ID
                                                            </p>
                                                            <p>{transactionprint.invoiceID}</p>

                                                            <p class="mt-2 text-sm font-semibold text-slate-700">
                                                              Date of Issue
                                                            </p>
                                                            <p>
                                                              {" "}
                                                              {new Date(
                                                                transactionprint.transactionDate
                                                              ).getDate() +
                                                                "-" +
                                                                (new Date(
                                                                  transactionprint.transactionDate
                                                                ).getMonth() +
                                                                  1) +
                                                                "-" +
                                                                new Date(
                                                                  transactionprint.transactionDate
                                                                ).getFullYear()}
                                                            </p>
                                                          </div>
                                                          <div class="text-sm font-light text-slate-500">
                                                            {transactionprint.razorpayPaymentId?<>
                                                              <p class="text-sm font-semibold text-slate-700">
                                                                Order ID
                                                              </p>
                                                              <p>{transactionprint.razorpayOrderId}</p>

                                                              <p class="mt-2 text-sm font-semibold text-slate-700">
                                                                Payment ID
                                                              </p>
                                                              <p>{transactionprint.razorpayPaymentId}</p>
                                                            </>:<>
                                                              <p class="mt-2 text-sm font-semibold text-slate-700">
                                                                Status
                                                              </p>
                                                              <p>Unpaid</p>
                                                            </>}
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
                                                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-700 sm:pl-6 md:pl-0"
                                                              >
                                                                Description
                                                              </th>
                                                              <th
                                                                scope="col"
                                                                class="py-3.5 px-3 text-right text-sm font-semibold text-slate-700 sm:table-cell"
                                                              >
                                                                Quantity
                                                              </th>
                                                              <th
                                                                scope="col"
                                                                class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-slate-700 sm:pr-6 md:pr-0"
                                                              >
                                                                Amount
                                                              </th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            <tr class="border-b border-slate-200">
                                                              <td class="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                                                                <div class="font-medium text-slate-700">
                                                                  Credit Purchase
                                                                </div>
                                                              </td>
                                                              <td class="px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                                {transactionprint.credit}
                                                              </td>
                                                              <td class="pl-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                                INR {transactionprint.amount/100}
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    </div>

                                                    <div class="mt-48 p-9">
                                                      <div class="border-t pt-9 border-slate-200">
                                                        <div class="text-sm font-light text-slate-700">
                                                          <p className="hidden">
                                                            Payment terms are 14
                                                            days. Please be
                                                            aware that according
                                                            to the Late Payment
                                                            of Unwrapped Debts
                                                            Act 0000,
                                                            freelancers are
                                                            entitled to claim a
                                                            00.00 late fee upon
                                                            non-payment of debts
                                                            after this time, at
                                                            which point a new
                                                            invoice will be
                                                            submitted with the
                                                            addition of this
                                                            fee. If payment of
                                                            the revised invoice
                                                            is not received
                                                            within a further 14
                                                            days, additional
                                                            interest will be
                                                            charged to the
                                                            overdue account and
                                                            a statutory rate of
                                                            8% plus Bank of
                                                            England base of
                                                            0.5%, totalling
                                                            8.5%. Parties cannot
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
                <div className="flex justify-between my-2 mx-1">
                  {Math.ceil(userList.length / 5) ? (
                    <div>
                      Page {page} of {Math.ceil(userList.length / 5)}
                    </div>
                  ) : null}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTranscation;
