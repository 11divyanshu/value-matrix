import React from 'react'
import { GrValidate } from "react-icons/gr";
import { ImCancelCircle } from "react-icons/im";
export default function card(props) {
  return (
    <div className="m-3 text-center flex-column" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", height: "140px", width: "150px" }}>
      <div className='text-3xl text-center m-3'>
        
        
        {props.check ? <div style={{ background: "#90EE90", "color": "white", borderRadius: '50%' }} className="w-1/2 my-2 mx-auto text-center align-item-center p-4"><GrValidate /></div> : <div className="w-1/2 mx-auto my-2 text-center rounded align-item-center p-4" style={{ background: "#F76F72", borderRadius: '50%' }}>  <ImCancelCircle /></div>}</div>
      <hr></hr>
      <div className='my-2'>{props.name}</div>
    </div>
  )
}
