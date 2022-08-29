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
      if (user1.permissions && user1.permissions[0].admin_permissions) {
        await setPermissions(user1.permissions[0].admin_permissions);
      }
      let user = await getUserFromId({ id: user1._id }, token);
      if (
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
  }, [permission]);

  return (
    <div className="relative h-screen">
      <div className="fixed bg-blue-500 left-3 top-3 rounded-full text-white p-2">
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
        collapsedWidth={windowDimensions.width < 769 ? 1 : 65}
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
              Repute Hire
            </MenuItem>
            {adminDashboardRoutes.map((item) => {
              if (item.hide === false && permission[item.permission] !== false)
                return (
                  <MenuItem icon={item.icon}>
                    {item.name}{" "}
                    <Link
                      to={`/admin${item.path}`}
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
