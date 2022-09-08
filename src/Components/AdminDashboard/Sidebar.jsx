import { ProSidebar, SidebarContent, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { adminDashboardRoutes } from "../../routes";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  const hasWindow = typeof window !== "undefined";

  const [permission, setPermissions] = React.useState({
    add_skills: false,
    add_users: false,
    list_candidates: false,
    list_companies: false,
    add_notifications: false,
    default: true,
  });

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");

      if (
        user1.permissions &&
        user1.permissions.length > 0 &&
        user1.permissions[0].admin_permissions
      ) {
        await setPermissions(user1.permissions[0].admin_permissions);
      }
      let user = await getUserFromId({ id: user1._id }, token);
      if (user.data.user.isAdmin) {
        await setPermissions({
          add_skills: true,
          add_users: true,
          list_candidates: true,
          list_companies: true,
          add_notifications: true,
          default: true,
        });
      } else if (
        user &&
        user.data.user &&
        user.data.user.user_type === "Admin_User" &&
        user.data.user.permissions
      ) {
        if (user.data.user.permissions[0]) {
          await setPermissions({
            ...user.data.user.permissions[0].admin_permissions,
            default: true,
          });
        }
      }
    };
    initial();
  }, []);

  return (
    <div className="relative h-screen">

      <div className="flex">
        <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
          <div className="space-y-3">
            <div className="flex items-center">
              {/* <h2 className="text-xl font-bold px-3">Dashboard</h2> */}
            </div>
            <div className="flex-1">
              <ul className="pt-2 pb-4 space-y-1 text-sm">
                {adminDashboardRoutes.map((item) => {
                  if (item.hide === false && permission[item.permission] !== false)
                    return (
                      <li className="rounded-sm">
                        <Link
                          to={`/admin${item.path}`}
                          onClick={() => setOpen(true)}
                        >
                          <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-gray-600">{item.icon} </p>  <p className="font-bold"> {item.name}</p> </span></Link>

                      </li>)
                })}

              </ul>
            </div>
          </div>
        </div>

      </div>


    </div >
  );
};

export default Sidebar;
