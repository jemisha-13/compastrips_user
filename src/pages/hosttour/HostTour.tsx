import React, { useState, useEffect } from "react";
import {Button } from "react-bootstrap";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useLocation, useHistory } from "react-router-dom";
import * as QueryString from "query-string"

import { ApiGet} from "../../helper/API/ApiData";
import ItineraryDescription from "../itinerary/ItineraryDescription";
import Reviews from "../itinerary/Reviews";
import HostList from "../itinerary/HostList";
import UserHostList from "../itinerary/UserHostList";


const HostTour = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [review, setReview] = useState<any>([]);


  const history = useHistory()
  const params = QueryString.parse(history.location.search);



  useEffect(() => {
    getItinerary();
  }, []);

  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getItinerary = () => {
    ApiGet(`itinerary/itinerary-course/${params.id}`)
      .then((data: any) => setData(data.data))
      .catch(() => setData([]));
    ApiGet(`itinerary/review-by-itinerary/${params.id}`)
      .then((data: any) => setReview(data.data))
      .catch(() => setReview([]));
  };

  return (
    <div className="mt-211 tour-single-page">
      {data && (
        <div className="main-container">
          <div className="d-flex">
            <div className="position-relative">
              <div className="itinerary-mainImg">
                <img src={data.images && data.images[0]} alt="" />
              </div>
              <Button
                className="itinerary-viewAll-btn"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                View All {data.images && data.images.length} Photos
              </Button>
            </div>
            <div>
              <div className="itinerary_img">

                <div className="d-flex">
                  <div className="">
                    <div>
                      <img src={data.images && data.images[1]} alt=""  className="mb-16 mr-17"/>
                    </div>
                  </div>

                  <div className="int-threeimg">
                    <div>
                      <img src={data.images && data.images[2]} alt="" className="mb-16"/>
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="">
                    <div >
                      <img src={data.images && data.images[3]} alt="" className="mr-17"/>
                    </div>
                  </div>
                  
                  <div className="">
                    <div className= "int-fourimg">
                      <img src={data.images && data.images[4]} alt=""/>
                    </div>
                  </div>
                </div>

              
                {isOpen && (
                  <Lightbox
                    mainSrc={data.images[photoIndex]}
                    nextSrc={data.images[(photoIndex + 1) % data.images.length]}
                    prevSrc={
                      data.images[
                      (photoIndex + data.images.length - 1) %
                      data.images.length
                      ]
                    }
                    imageTitle={photoIndex + 1 + "/" + data.images.length}
                    onCloseRequest={() => {
                      setIsOpen(false);
                    }}
                    onMovePrevRequest={() => {
                      setPhotoIndex(
                        (photoIndex + data.images.length - 1) %
                        data.images.length
                      );
                    }}
                    onMoveNextRequest={() => {
                      setPhotoIndex((photoIndex + 1) % data.images.length);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="d-flex">
          <div className="w-740">
            <ItineraryDescription />
            <Reviews reviews={review ? review : null} />
          </div>
          <div className="ml-auto">
            <HostList />
            <UserHostList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostTour;
