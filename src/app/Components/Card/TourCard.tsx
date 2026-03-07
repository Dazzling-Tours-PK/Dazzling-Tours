import Image from "next/image";
import React from "react";

const TourCard = () => {
  return (
    <div className="tour-wrapper tour-field-area">
      <div className="tour-item style-5">
        <div className="icon">
          <Image
            src="/assets/img/icon/40.svg"
            alt="img"
            width={44}
            height={30}
          />
        </div>
        <div className="content">
          <h5>Departure City</h5>
          <div className="form">
            <select className="single-select w-100">
              <option>New York - United States</option>
              <option>New York - United States</option>
              <option>New York - United States</option>
              <option>New York - United States</option>
              <option>New York - United States</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tour-item">
        <div className="icon">
          <Image
            src="/assets/img/icon/41.svg"
            alt="img"
            width={39}
            height={30}
          />
        </div>
        <div className="content">
          <h5>Arrival city</h5>
          <div className="form">
            <select className="single-select w-100">
              <option>Dallas, Texas, USA</option>
              <option>Dallas, Texas, USA</option>
              <option>Dallas, Texas, USA</option>
              <option>Dallas, Texas, USA</option>
              <option>Dallas, Texas, USA</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tour-item">
        <div className="icon">
          <Image
            src="/assets/img/icon/42.svg"
            alt="img"
            width={30}
            height={30}
          />
        </div>
        <div className="content">
          <h5>Check In / Check Out</h5>
          <div className="form-clt">
            <div className="form-clt">
              <input type="date" id="date1" name="date1" />
            </div>
          </div>
        </div>
      </div>
      <div className="tour-item">
        <div className="icon">
          <Image
            src="/assets/img/icon/43.svg"
            alt="img"
            width={37}
            height={30}
          />
        </div>
        <div className="content">
          <h5>Passenger</h5>
          <div className="form">
            <select className="single-select w-100">
              <option>01 Adults</option>
              <option>02 Adults</option>
              <option>03 Adults</option>
              <option>04 Adults</option>
              <option>05 Adults</option>
            </select>
          </div>
        </div>
        <button type="submit" className="theme-btn">
          Search
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div>
  );
};

export default TourCard;
