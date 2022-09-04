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
      {/* <div className="fixed bg-blue-500 left-0 top-3 rounded-full text-white p-2">
        <AiOutlineMenu
          className="text-md"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <ProSidebar
        style={{ backgroundColor: "red !important" }}
        width={200}
        collapsedWidth={windowDimensions.width < 769 ? 1 : 69}
        className="fixed left-0 h-screen z-10"
        collapsed={open}
      >
        <SidebarContent>
          <Menu iconShape="square">
            <MenuItem
              icon={
                open ? (
                  <AiOutlineMenu className="text-xl" />
                ) : (
                  <AiOutlineClose className="text-xl" />
                )
              }
              onClick={() => setOpen(!open)}
            >
              Value Matrix
            </MenuItem>
            {companyDashboardRoutes.map((item) => {
              if (item.hide === false && permission[item.permission] !== false)
                return (
                  <MenuItem icon={item.icon}>
                    {item.name}
                    <Link
                      to={`/company${item.path}`}
                      onClick={() => setOpen(true)}
                    />
                  </MenuItem>
                );
              return null;
            })}
          </Menu>
        </SidebarContent>
      </ProSidebar> */}

      {/* <div className="w-1/4 h-100">
<div className="py-3">
{companyDashboardRoutes.map((item) => {
              if (item.hide === false && permission[item.permission] !== false)
                return (
                  <Menu className="mx-4 py-2 flex font-300-gray" icon={item.icon}>
                    {item.name}
                    <Link
                      to={`/company${item.path}`}
                      onClick={() => setOpen(true)}
                    />
                  </Menu>
                );
              return null;
            })}
</div>
</div> */}

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

                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg> */}
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
