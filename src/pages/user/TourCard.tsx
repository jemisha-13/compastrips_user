import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ApiPost } from "../../helper/API/ApiData";
import Buttons from "../../components/Buttons";
import { useTranslation } from "react-i18next";
import Rating from "react-rating";

interface tourCardProps {
  items: any;
  canlike: boolean;
  UpdateCount: (UpdateCount: any) => void;
  setRefresh: (setRefresh: any) => void;
}

const TourCard: React.FC<any> = ({
  items,
  canlike,
  UpdateCount,
  setRefresh,
}: tourCardProps) => {
  const [like, setLike] = useState(items.isLike);

  const { t } = useTranslation();

  //Like Function
  const [delayLike, setDelayLike] = useState(false);
  const Like = (id: any) => {
    setDelayLike(true);
    setLike((prev: boolean) => !prev);
    if (!like) 
     UpdateCount((prev: number) => prev + 1);
    else
     UpdateCount((prev: number) => prev - 1);

    ApiPost(`itinerary/wishlist/${id}`, {}).then((res) => {
      setRefresh(Math.random());
      setDelayLike(false);
    });
  };

  const changeDateType = (date: string) => {
    const x = new Date(date);
    const y = x.getMonth();
    const w = x.getDate();
    const z = x.getFullYear().toString();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return month[y] + " " + w + "," + z;
  };

  const changeTimeFormat = (time: string) => {
    if (time) {
      let Time = time.split(":");
      return Time[0] + ":" + Time[1];
    }
  };

  return (
    <div>
      <div className="card-box mb-40 custom-flex-margin d-md-flex tourcard-in-myaccount">
        {!(items.creator === "Compastrips") && items.status === "CANCELED" && (
          <div className="canceled-tour-card">
            <h1 className="font-34-bold">{t("My_Account.Hosting_Canceled")}</h1>
            <Buttons
              ButtonStyle="Remove-btn mt-32"
              onClick={() => Like(items.id)}
            >
              {t("My_Account.Remove")}
            </Buttons>
          </div>
        )}
        <div className="p-0">
          <Link to={`/itinerary?id=${items.id}&hostingId=${items.hosting_id}`}>
            <div className="card-image-main">
              <img
                src={items?.image ? items?.image[0] : ""}
                className="w-100"
                alt=""
              />
            </div>
          </Link>
        </div>
        <div className="p-0 w-100">
          <div className="main-tour-card-data">
            <div className="d-md-flex w-100">
              <div className="tour-card-data">
                <Link to={`/itinerary?id=${items.id}`}>
                  <h4 className="font-28-bold h-34">{items.title}</h4>
                </Link>
              </div>
              <div className="tour-created ml-auto ">
                <p className="font-18">
                  {items.created_by_show}{" "}
                  <span
                    className={
                      items.creator === "Host"
                        ? "green-font font-18-bold"
                        : "blue-font font-18-bold"
                    }
                  >
                    {items.creator_show}
                  </span>
                </p>
              </div>
            </div>

            <div className="d-flex w-100">
              <div className="tour-card-address">
                <h4 className="font-18  mt-14">
                  <img src="./img/location.svg" className="mr-2" alt="" />
                  {items.region} , {items.country}
                </h4>
                <div className="d-flex star-row">
                  <div className="star-list">
                    <Rating
                      emptySymbol={
                        <img
                          src="./img/blankstar.svg"
                          className="mr-1"
                          alt=""
                        />
                      }
                      fullSymbol={
                        <img src="./img/star.svg" className="mr-1" alt="" />
                      }
                      initialRating={items.star}
                      readonly={true}
                      stop={5}
                    />
                  </div>
                  <div className="ml-4 star-reviews">
                    <p className="font-16">
                      {items.star} ∙ {t("TourList.Reviews")}{" "}
                      {items.review_count}
                    </p>
                  </div>
                </div>
              </div>
              <div className="tout-created ml-auto">
                <div className="download-heart-icon button d-flex">
                  <div className="heart-div">
                    <input
                      type="checkbox"
                      id={items.id}
                      checked={like}
                      disabled={delayLike}
                      onClick={canlike ? () => Like(items.id) : () => {}}
                      className="instruments"
                    />
                    <label htmlFor={items.id} className={`text-white check`}>
                      {!like && (
                        <img
                          src="./img/Favourite.png"
                          className="w-20"
                          alt=""
                        />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="tages">
              {items?.course?.map((tourtag: any) => (
                <p className="single-tag font-14">{tourtag.name}</p>
              ))}
            </div>

            <div className="d-md-flex w-100">
              <div className="tour-card-data-date">
                {items.creator === "Host" ? (
                  <h4 className="font-18">
                    {changeDateType(items.start_date)}{" "}
                    {changeTimeFormat(items.start_time)} -{" "}
                    {changeTimeFormat(items.end_time)}
                  </h4>
                ) : (
                  <h4 className="font-18">
                    {changeDateType(items.start_date)} -{" "}
                    {changeDateType(items.end_date)}
                  </h4>
                )}
              </div>
              <div className="tout-created-host ml-auto">
                <p className="font-18-bold">
                  <span>
                    {" "}
                    {items.host_count}
                    {t("TourList.People")}
                  </span>
                  {t("TourList.Host")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
