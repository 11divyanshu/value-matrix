import React from "react";

// Assets
import {IoCall} from "react-icons/io5";
import {BsFillChatLeftTextFill, BsFillBellFill} from "react-icons/bs";

const HorizontalNav = ()=> {
    return(
        <div className="flex items-center border-b-2 w-full pl-4 py-4 shadow-md">
            <div className="text-slate-600 text-lg">
                Company Name
            </div>
            <div className="space-x-8 ml-auto flex mr-8 items-center">
                <IoCall className="text-gray-700 text-lg cursor-pointer hover:text-gray-800"/>
                <BsFillChatLeftTextFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800"/>
                <BsFillBellFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800"/>

<div className="flex space-x-3 items-center cursor-pointer">
    <div className="h-7 w-7 bg-blue-600 rounded-full"></div>
    <div className="text-xs">
        <p className="text-md text-semibold">Rohit Patel</p>
        <p className="text-xs text-gray-600">View Profile</p>
    </div>
</div>

            </div>
        </div>
    );
}

export default HorizontalNav;