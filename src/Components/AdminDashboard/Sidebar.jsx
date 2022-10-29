import {
  ProSidebar,
  SubMenu,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { adminDashboardRoutes } from "../../routes";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlinePlus,
} from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { LogoutAPI } from "../../service/api";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  const hasWindow = typeof window !== "undefined";

  const [permission, setPermissions] = React.useState({
    add_skills: false,
    add_users: false,
    list_candidates: false,
    list_companies: false,
    add_notifications: false,
    list_XI:false,

    default: true,
  });
  const Logout = async () => {
    console.log("CHeck");
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);
    await localStorage.setItem("user", null);
    await localStorage.setItem("access_token", null);
    window.location.href = "/login";
  };
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
  // const hasWindow = typeof window !== "undefined";
  const handleToggle = () => {
    setToggled(!toggled);
    setCollapsed(!collapsed);
  };

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
          list_XI:true,
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
    <div className="sidebarComponent z-20">
      <div className="h-screen fixed top-20 left-0">
        <div
          className="absolute  text-gray-9 left-5 -top-14   text-gray-700 text-xl menu"
          style={{ zIndex: 18 }}
        >
          <AiOutlineMenu
            className="text-md menu-bar"
            onClick={() => {
              handleToggle();
            }}
            style={{ zIndex: 20 }}
          />
        </div>
        <ProSidebar
          // toggled={menu}
          // onToggle={(prev)=>setMenu(!prev)}
          // width={280}

          className="fixed left-0 h-screen z-10 text-left active text-gray-500"
          style={{ backgroundColor: "#FAFAFA" }}
          breakPoint="xl"
          collapsed={collapsed}
          toggled={toggled}
          onToggle={handleToggle}
        >
          <div className="w-full px-6">
            <Link to="/admin">
              <button
                className=" hover:bg-blue-700 flex text-white justify-center font-bold py-2 w-full text-sm mt-4 text-center rounded-lg"
                style={{ backgroundColor: "#034488" }}
              >
                <p className="py-1 px-2 text-md">
                  {" "}
                  <AiOutlinePlus />
                </p>{" "}
                Post New Job
              </button>
            </Link>
          </div>
          <SidebarContent className="text-left mx-5 mt-7">
            <Menu iconShape="square">
              <MenuItem
                className="text-gray-700 font-semibold flex"
                active={
                  window.location.pathname === `/admin/` ||
                  window.location.pathname === `/admin`
                }
                //  onClick={()=>{ handleToggle()}}
              >
                {" "}
                <p className="text-xl flex mx-2">
                  <AiOutlineHome />
                  <p className="text-sm mx-4 text-gray-700 font-semibold">
                    Dashboard{" "}
                  </p>
                </p>
                <Link to={`/admin/`} />
              </MenuItem>

              <p className="text-gray-400 font-semibold font-sm mx-4 my-5">
                Analytics
              </p>
              {adminDashboardRoutes.map((item) => {
                if (
                  item.hide === false &&
                  permission[item.permission] !== false
                )
                  return (
                    <MenuItem
                      className="text-gray-700 font-semibold"
                      active={window.location.pathname === `/admin${item.path}`}
                      icon={item.icon}
                    >
                      {item.name}{" "}
                      <Link
                        to={`/admin${item.path}`}
                        onClick={() => {
                          setOpen(true);
                          // handleToggle()
                        }}
                      />
                    </MenuItem>
                  );
              })}
            </Menu>
            <Menu className=" font-semibold">
              <SubMenu
                // suffix={}
                title={<p className="text-sm font-semibold ">Validations</p>}
                icon={
                  <p className="text-xl">
                    <AiOutlineMenu />
                  </p>
                }
              >
                <MenuItem
                  className="text-gray-700 font-semibold py-1"
                  active={window.location.pathname === `/admin/jobvalidate`}
                  icon={<AiOutlineMenu />}
                >
                  Job Validation
                  <Link
                    to={`/admin/jobvalidate`}
                    onClick={() => {
                      setOpen(true);
                      // handleToggle()
                    }}
                  />
                </MenuItem>

                <MenuItem
                  className="text-gray-700 font-semibold py-1"
                  active={window.location.pathname === `/admin/companyValidate`}
                  icon={<AiOutlineMenu />}
                >
                  Company Validation
                  <Link
                    to={`/admin/companyValidate`}
                    onClick={() => {
                      setOpen(true);
                      // handleToggle()
                    }}
                  />
                </MenuItem>
                <MenuItem
                  className="text-gray-700 font-semibold py-1"
                  active={window.location.pathname === `/admin/titleValidate`}
                  icon={<AiOutlineMenu />}
                >
                  Title Validation
                  <Link
                    to={`/admin/titleValidate`}
                    onClick={() => {
                      setOpen(true);
                      // handleToggle()
                    }}
                  />
                </MenuItem>
                {/* <MenuItem className='text-gray-700 font-semibold py-1' active={window.location.pathname === `/admin/cityValidate`}
                    icon={<AiOutlineMenu/>}>City Validation<Link to={`/admin/cityValidate`}
                     onClick={() => { setOpen(true);
                      // handleToggle()
                    }


                    } /></MenuItem> */}
                {/* <MenuItem> 3</MenuItem> */}
              </SubMenu>
            </Menu>
          </SidebarContent>
          <div className="mx-4 my-24">
            <div className="flex m-2">
              <a
                href="/admin/profile"
                className="text-gray-700 mx-4 py-2 font-semibold"
              >
                <FiSettings />{" "}
              </a>
              <a
                href="/admin/profile"
                className="text-gray-700  font-semibold py-1"
              >
                Settings
              </a>
            </div>
            <div className="flex m-2" onClick={Logout}>
              <p className="text-gray-700 mx-4 py-2 font-semibold">
                <MdOutlineLogout />{" "}
              </p>
              <p className="text-gray-700  font-semibold py-1">Log Out</p>
            </div>
          </div>
        </ProSidebar>
      </div>
    </div>
  );
};

export default Sidebar;
