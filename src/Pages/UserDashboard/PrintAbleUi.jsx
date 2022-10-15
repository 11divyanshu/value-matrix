import React, { useRef, useEffect, useState } from 'react'
import Printable from "../UserDashboard/PrintAble"
import { useReactToPrint } from "react-to-print";
import { AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";
const PrintAbleUi = () => {
  const [print, setprint] = React.useState(false);

  const componentRef = useRef();
  const openPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Evaluation Report"
  })
  return (
    <div><button
    className=" hover:bg-blue-700 text-white font-bold py-2 px-8 md:mx-6 sm:mx-0 text-xl rounded"
    style={{ backgroundColor: "#034488" }}
    onClick={() => {
      setprint(true);
      openPdf()
    }}
  >
    <AiOutlinePrinter />
  </button>

{ <div className="hidden" >
  <div ref={componentRef}>
  <Printable />
  </div>
</div>}</div>
  )
}

export default PrintAbleUi