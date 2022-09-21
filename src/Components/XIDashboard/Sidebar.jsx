import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { XIDashboardRoutes } from "../../routes";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
  AiOutlineHome,
  AiOutlinePlus
} from "react-icons/ai";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { ImHome } from "react-icons/im";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { LogoutAPI } from "../../service/api";

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
   const hasWindow = typeof window !== "undefined";
   const [close, setClose] = React.useState(null);


  const Logout = async () => {
    console.log("CHeck");
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);
    await localStorage.setItem("user", null);
    await localStorage.setItem("access_token", null);
    window.location.href = "/login";
  };
  const [permission, setPermissions] = React.useState({
    add_jobs: true,
    add_users: true,
    list_candidates: true,
    default: true,
  });

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    console.log(width);
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
      setClose(getWindowDimensions().width)


      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);
  const handleToggle = () => {
    if(close < 1336){
      setToggled(!toggled);
      setCollapsed(!collapsed);}
     };

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");
      let user = await getUserFromId({ id: user1._id }, token);
      console.log(user);
      // if (
      //   user &&
      //   user.data.user &&
      //   user.data.user.user_type === "Company_User" &&
      //   user.data.user.permissions
      // ) {
      //   if (user.data.user.permissions[0]) {
      //     await setPermissions({
      //       ...user.data.user.permissions[0].company_permissions,
      //       default: true,
      //     });
      //   }
      // }
      console.log(permission);
    };
    initial();
  }, []);

  return (
    <div className='sidebarComponent z-20'>
    <div className="h-screen fixed top-20 left-0" style={{marginTop:"-10px"}}>
      <div className="absolute text-gray-9 left-5 -top-10   text-gray-800 text-xl menu" style={{zIndex:18}}>
      <AiOutlineMenu className="text-md menu-bar" onClick={()=>{handleToggle();}}  style={{zIndex:20}}/>
      </div>

      <ProSidebar
        // toggled={menu}
        // onToggle={(prev)=>setMenu(!prev)}
        // width={}

        className="fixed left-0 h-screen z-10 text-left active text-gray-500"
        style={{backgroundColor:"#FAFAFA" , zIndex:-1}}
        breakPoint="xl"
        collapsed={collapsed}
        toggled={toggled}
        onToggle={handleToggle}
      >
        <div className="w-full px-6">
          <Link to="">
            <button
              class=" hover:bg-blue-700 flex text-white font-bold py-2 w-full text-sm mt-4 text-center align-center rounded-lg"
              style={{backgroundColor:"#034488"}}

            >
             <p className="mx-auto flex"><p className="py-1 px-2 text-md"> <AiOutlinePlus/></p> Post New Job</p>
            </button>
          </Link>
        </div>
        <SidebarContent className="text-left mx-5 mt-7">
          <Menu iconShape="square">
            <MenuItem
              className="text-gray-700 font-semibold flex"
              active={window.location.pathname === `/XI/` || window.location.pathname === `/XI`}
              // onClick={()=>{ handleToggle();}}
            >
              {" "}
              <p className="text-xl flex mx-2">
                <AiOutlineHome />
                <p className="text-sm mx-4 text-gray-700 font-semibold">
                  Dashboard{" "}
                </p>
              </p>
              <Link to={`/XI/`} />
            </MenuItem>

            {/* <hr></hr> */}
            <p className='text-gray-400 font-bold text-xs mx-4 my-5'>ANALYTICS</p>

            {XIDashboardRoutes.map((item) => {
              if (item.hide === false && permission[item.permission] !== false)
                return (
                  // <Link
                  //   to={`/company${item.path}`}
                  //   onClick={() => setOpen(true)}
                  // > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-gray-600">{item.icon} </p>  <p className="font-bold"> {item.name}</p> </span></Link>

                  <MenuItem
                    className="text-gray-700 font-semibold"
                    active={window.location.pathname === `/XI${item.path}`}
                    icon={item.icon}
                  >
                    {item.name}{" "}
                    <Link
                      to={`/XI${item.path}`}
                      onClick={() => {
                        setOpen(true);
                         handleToggle();
                      }}
                    />
                  </MenuItem>
                );
            })}
          </Menu>
        </SidebarContent>
        <div className="mx-4 my-24">
          <div className="flex m-2 cursor-pointer">
          <a href="/XI/profile" className='text-gray-700 mx-4 py-2 font-semibold'><FiSettings/> </a><a href="/XI/profile" className='text-gray-700  font-semibold py-1'>Settings</a>
          </div>
          <div className="flex m-2 cursor-pointer" onClick={Logout}>
            <p className="text-gray-700 mx-4 py-2 font-semibold">
              <MdOutlineLogout />{" "}
            </p>
            <p className="text-gray-700  font-semibold py-1 cursor-pointer">Log Out</p>
          </div>
        </div>
      </ProSidebar>
    </div>
    </div>
  );
};

export default Sidebar;