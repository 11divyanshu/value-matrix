import React from "react";
import { Link } from "react-router-dom";
// Assets
import {BiMenu} from "react-icons/bi";
import { dashboardRoutes } from "../../routes";



const VerticalNav = (props) => {
    return(
        <div className="min-h-screen bg-blue-500 fixed min-w-24 z-100 py-5 text-center justify-center items-center px-4">
                <div>
                    <BiMenu className="text-white mx-auto text-xl" onClick={()=>props.open(true)} />
                    {dashboardRoutes.map(item=>{
                        return(
                            <Link to={item.path}>
                                <p className="text-xl my-8 text-white">{item.icon}</p>
                            </Link>
                        );
                    })}
                </div>
        </div>
    )
}

export default VerticalNav;