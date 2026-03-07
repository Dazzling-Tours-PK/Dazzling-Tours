"use client";
import React, { useState } from "react";
import FlightCard from "../Card/FlightCard";

const FeaturedFlight = () => {
  const [isActive, setIsActive] = useState("OneWay");

  return (
    <section className="featured-flight-section section-padding fix">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <span className="sub-title wow fadeInUp">Airlines Flight</span>
            <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
              Featured Flight Deals
            </h2>
          </div>
          <ul className="nav">
            <li
              className={`nav-item wow fadeInUp ${isActive === "ALL" ? "active" : ""}`}
              onClick={() => setIsActive("ALL")}
              data-wow-delay=".3s"
            >
              <a
                href="#Mission"
                data-bs-toggle="tab"
                className="nav-link active"
              >
                ALL
              </a>
            </li>
            <li
              className={`nav-item wow fadeInUp ${isActive === "OneWay" ? "active" : ""}`}
              onClick={() => setIsActive("OneWay")}
              data-wow-delay=".5s"
            >
              <a href="#Vision" data-bs-toggle="tab" className="nav-link">
                ONE WAY
              </a>
            </li>
            <li
              className={`nav-item wow fadeInUp ${isActive === "RoundTrip" ? "active" : ""}`}
              onClick={() => setIsActive("RoundTrip")}
              data-wow-delay=".5s"
            >
              <a href="#Feature" data-bs-toggle="tab" className="nav-link">
                ROUND TRIP
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${isActive === "ALL" ? "active" : ""}`}>
            <div className="row">
              <div
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay=".3s"
              >
                <FlightCard
                  img="/assets/img/feature/05.jpg"
                  name="American Airlines"
                  oneway="One way Flight"
                  destination="London to Paris"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
              <div
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay=".5s"
              >
                <FlightCard
                  img="/assets/img/feature/06.jpg"
                  name="Qutar Airlines"
                  oneway="One way Flight"
                  destination="Parish To Dubai"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
              <div
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay=".7s"
              >
                <FlightCard
                  img="/assets/img/feature/07.jpg"
                  name="American Airlines"
                  oneway="One way Flight"
                  destination="London to Paris"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
            </div>
          </div>
          <div className={`tab-pane ${isActive === "OneWay" ? "active" : ""}`}>
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6">
                <FlightCard
                  img="/assets/img/feature/07.jpg"
                  name="American Airlines"
                  oneway="One way Flight"
                  destination="London to Paris"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <FlightCard
                  img="/assets/img/feature/06.jpg"
                  name="Qutar Airlines"
                  oneway="One way Flight"
                  destination="Parish To Dubai"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <FlightCard
                  img="/assets/img/feature/05.jpg"
                  name="American Airlines"
                  oneway="One way Flight"
                  destination="London to Paris"
                  price="$650.00"
                  review="480+ Reviews"
                ></FlightCard>
              </div>
            </div>
          </div>
          <div
            className={`tab-pane ${isActive === "RoundTrip" ? "active" : ""}`}
          >
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6">
                <FlightCard
                  img="/assets/img/feature/07.jpg"
                  name="American Airlines"
                  oneway="One way Flight"
                  destination="London to Paris"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <FlightCard
                  img="/assets/img/feature/05.jpg"
                  name="Qutar Airlines"
                  oneway="One way Flight"
                  destination="Parish To Dubai"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <FlightCard
                  img="/assets/img/feature/06.jpg"
                  name="American Airlines"
                  oneway="One way Flight"
                  destination="London to Paris"
                  price="$450.00"
                  review="450+ Reviews"
                ></FlightCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFlight;
