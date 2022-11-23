import * as React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

import { updatewhiteboard } from "../service/api";

import { BsArrowCounterclockwise, BsArrowClockwise, BsFillEraserFill, BsFillBrushFill, BsBucketFill } from "react-icons/bs";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem"
};

class Intvwhiteboard extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    this.state = {
        pencolor: "black"
    }
  }

  setpencolor = (value)=>{
    this.setState({pencolor: value});
  }

  saveimage = ()=>{
    this.canvas.current
        .exportImage("png")
        .then(async (data) => {
            let updatewb = await updatewhiteboard(this.props.id, data);
        })
        .catch(e => {
            console.log(e);
        });
  }

  render() {
    return (
      <div onMouseUp={this.saveimage}>
        <div className="flex py-2">
            <span className="text-white font-bold">Select Pen Color:</span>
            <span className="h-6 w-6 border border-white rounded-full ml-2 cursor-pointer bg-black" onClick={()=>{this.setpencolor("black")}}></span>
            <span className="h-6 w-6 border border-white rounded-full ml-2 cursor-pointer bg-red-500" onClick={()=>{this.setpencolor("red")}}></span>
            <span className="h-6 w-6 border border-white rounded-full ml-2 cursor-pointer bg-green-500" onClick={()=>{this.setpencolor("green")}}></span>
            <span className="h-6 w-6 border border-white rounded-full ml-2 cursor-pointer bg-blue-500" onClick={()=>{this.setpencolor("blue")}}></span>
            <span className="h-6 w-6 border border-white rounded-full ml-2 cursor-pointer bg-yellow-500" onClick={()=>{this.setpencolor("yellow")}}></span>
            <span className="text-white font-bold ml-auto">Actions:</span>
            <BsArrowCounterclockwise onClick={()=>{this.canvas.current.undo()}} className="text-white text-2xl ml-2 cursor-pointer"/>
            <BsArrowClockwise onClick={()=>{this.canvas.current.redo()}} className="text-white text-2xl ml-2 cursor-pointer"/>
            <BsFillBrushFill onClick={()=>{this.canvas.current.eraseMode(false)}} className="text-white text-2xl ml-2 cursor-pointer"/>
            <BsFillEraserFill onClick={()=>{this.canvas.current.eraseMode(true)}} className="text-white text-2xl ml-2 cursor-pointer"/>
            <BsBucketFill onClick={()=>{this.canvas.current.clearCanvas()}} className="text-white text-2xl ml-2 cursor-pointer"/>
        </div>
        <ReactSketchCanvas
            className="my-2"
            ref={this.canvas}
            style={styles}
            width="100%"
            height="600px"
            strokeWidth={4}
            strokeColor={this.state.pencolor}
        />
      </div>
    );
  }
};

export default Intvwhiteboard;