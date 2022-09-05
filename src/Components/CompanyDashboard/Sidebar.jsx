import { ProSidebar, SidebarContent, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { companyDashboardRoutes } from "../../routes";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
} from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  // const hasWindow = typeof window !== "undefined";

  const [permission, setPermissions] = React.useState({
    add_jobs: true,
    add_users: true,
    list_candidates: true,
    default: true,
  });

  // function getWindowDimensions() {
  //   const width = hasWindow ? window.innerWidth : null;
  //   const height = hasWindow ? window.innerHeight : null;
  //   return {
  //     width,
  //     height,
  //   };
  // }

  // const [windowDimensions, setWindowDimensions] = React.useState(
  //   getWindowDimensions()
  // );

  // React.useEffect(() => {
  //   if (hasWindow) {
  //     function handleResize() {
  //       setWindowDimensions(getWindowDimensions());
  //     }

  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // }, [hasWindow]);

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");
      let user = await getUserFromId({ id: user1._id }, token);
      console.log(user);
      if (
        user &&
        user.data.user &&
        user.data.user.user_type === "Company_User" &&
        user.data.user.permissions
      ) {
        if (user.data.user.permissions[0]) {
          await setPermissions({
            ...user.data.user.permissions[0].company_permissions,
            default: true,
          });
        }
      }
      console.log(permission);
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
                {companyDashboardRoutes.map((item) => {
                  if (item.hide === false && permission[item.permission] !== false)
                    return (
                      <li className="rounded-sm">

                       
                        <Link
                          to={`/company${item.path}`}
                          onClick={() => setOpen(true)}
                        > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-gray-600">{item.icon} </p>  <p className="font-bold"> {item.name}</p> </span></Link>

                      </li>)
                })}
 
              </ul>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
};

export default Sidebar;
