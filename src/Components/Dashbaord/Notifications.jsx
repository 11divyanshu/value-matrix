import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getUserNotification, markNotiReadForUser } from "../../service/api";
import { ReactSession } from "react-client-session";
import { timeDifferenceCalculator } from "time-difference-calculator";

// Assets
import { BsFillBellFill } from "react-icons/bs";

const NotificationPopOver = (props) => {
  const [notification, setNotification] = React.useState(null);
  const [showNoti, setShowNoti] = React.useState(null);

  const getNotification = async (user, token) => {
    let res = await getUserNotification(user, token);
    console.log(res.data.notifications);
    if (res) {
      setNotification(res.data.notifications);
      if(res.data.notifications && res.data.notifications[0]){
      let mp = new Map();
      res.data.notifications.forEach((element) => {
        mp.set(element._id, true);
      });
      setShowNoti(mp);
      }
    }
  };

  const markAsReadNoti = async (noti) => {
    try {
      let user = ReactSession.get("user");
      let token = ReactSession.get("access_token");
      let res = await markNotiReadForUser(
        { noti_id: noti._id, user_id: user._id },
        token
      );
      if (res) {
        let r = showNoti;
        showNoti.set(noti._id, false);
        setShowNoti(r);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markAllUtility = async (el, user_id, token) => {
    await markNotiReadForUser(
      { noti_id: el._id, user_id: user_id },
      token
    );
  };

  const MarkAllNotiRead = async () => {
    try {
      let user = ReactSession.get("user");
      let token = ReactSession.get("token");
      notification.forEach((el) => {
          markAllUtility(el, user._id, token);
      });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    let user = ReactSession.get("user");
    let token = ReactSession.get("access_token");
    getNotification(user, token);
  }, []);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
          >
            {notification && notification.length>0 && (
              <div class="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-red-600 rounded-full z-10"></div>
            )}
            <BsFillBellFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
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
            <Popover.Panel className="absolute md:left-1/2 left-[15vw] z-10 mt-3 md:w-[40vw] w-[80vw] max-w-sm -translate-x-full transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative gap-8 bg-white p-3 lg:grid-cols-2 flex justify-between">
                  <div className="flex items-center text-gray-800 space-x-2">
                    <BsFillBellFill className="text-md" />
                    <p>Notifications</p>{" "}
                    <p className="text-sm">
                      {notification && notification.length > 0 && (<p>({notification.length}  unread)</p>)}
                    </p>{" "}
                  </div>
                  {notification && notification.length>0 && (
                  <p
                    className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer"
                    onClick={MarkAllNotiRead}
                  >
                    Mark all as read
                  </p>)}
                </div>
                <div className="bg-gray-50">
                  {(notification === null || notification === undefined) && <p className="p-3">No New Notification. You are all caught up.</p>}
                  {notification && showNoti && (
                    <div>
                      {notification.map((item, index) => {
                        return (
                          <Transition
                            show={showNoti.get(item._id)}
                            className="p-3 border-b-[0.5px] border-gray-400 flex items-center"
                            key={item._id}
                          >
                            <div>
                              <p className="font-semibold text-sm capitalize">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.message}
                              </p>
                            </div>
                            <div className="text-end ml-auto text-xs">
                              <p
                                className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                onClick={() => {
                                  markAsReadNoti(item);
                                }}
                              >
                                Mark as read
                              </p>
                              <p>
                                {timeDifferenceCalculator(item.timeCreated)}
                              </p>
                            </div>
                          </Transition>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NotificationPopOver;
