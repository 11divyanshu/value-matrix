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

  const hasWindow = typeof window !== "undefined";

  const [permission, setPermissions] = React.useState({
    add_jobs: true,
    add_users: true,
    list_candidates: true,
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
      <div className="fixed bg-blue-500 left-0 top-3 rounded-full text-white p-2">
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
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
