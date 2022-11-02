import React from "react";
import "../../assets/stylesheet/rating.css";

const Rating = () => {
  return (
    <div className="w-full flex mx-5">
      <div>
        <h2 className="font-semibold">Rating</h2>
        <div class="rating w-full flex ">
          <input type="radio" id="star1" name="rating" value="1" />
          <label for="star1"></label>
          <input type="radio" id="star2" name="rating" value="2" />
          <label for="star2"></label>
          <input type="radio" id="star3" name="rating" value="3" />
          <label for="star3"></label>
          <input type="radio" id="star4" name="rating" value="4" />
          <label for="star4"></label>
          <input type="radio" id="star5" name="rating" value="5" />
          <label for="star5"></label>
        </div>
      </div>
      <div className="my-4">
        <button
          className="shadow-lg rounded-md mx-5 px-6 py-3 "
          style={{ backgroundColor: "#034488", color: "#fff" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Rating;
