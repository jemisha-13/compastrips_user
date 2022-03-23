import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiPost } from "../../../helper/API/ApiData";
import { RootStateOrAny, useSelector } from "react-redux"
import Rating from "react-rating";
import AuthStorage from "../../../helper/AuthStorage";
import * as QueryString from "query-string";

interface itineraryList {
  country: string
  image: string[]
  course: string[]
  created_by_show: string
  creator_show: string
  creator: string
  end_date: Date
  end_time?: string
  host_count: number
  id: string
  isLike: boolean
  region: string
  review_count: number
  star: number
  start_date: Date
  start_time?: string
  title: string
}

const Tourlist: React.FC = () => {
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login)

  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("");

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  // const [err, setErr] = useState(false);
  const [data, setData] = useState<itineraryList[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef<any>();

  useEffect(() => {
    // getTourCards();
    getSearchedItinerary()
  }, [activeTab, page]);


  // const getTourCards = () => {
  //   setLoading(true);
  //   setErr(false);
  //   ApiPost(`itinerary/getItineraryOnHome?page_number=${page}&per_page=10`, {
  //     category: `${activeTab}`,
  //   })
  //     .then((res: any) => {
  //       setData((prev: any[]) => {
  //         return [...prev, ...res.data.itinerary];
  //       });
  //       setHasMore(res.data.itinerary.length > 0);
  //       setLoading(false);
  //     })
  //     .catch((e: any) => {
  //       setErr(true);
  //     });
  // };


  let searchParam = QueryString.parse(history.location.search);

  //search

  const getSearchedItinerary = () => {
    if (searchParam) {
      setLoading(true);
      // setErr(false);
      ApiPost(`itinerary/getItineraryOnHome?page_number=1&per_page=10`, {
        search_term: searchParam?.keyword,
        start_date: searchParam?.startDate,
        end_date: searchParam?.endDate,
        category: `${activeTab}`,
      })
        .then((res: any) => {
          setData(res.data.itinerary);
          setHasMore(res.data.itinerary.length > 0);
          setLoading(false);
        })
        .catch((e: any) => {
          // setErr(true);
        });
    }
  }

  useEffect(() => {
    if (searchParam?.keyword || searchParam?.startDate || searchParam?.endDate) {
      setData([]);
      getSearchedItinerary();
    }
  }, [location])

  //Like function
  const [delayLike, setDelayLike] = useState(false);
  const Like = (id: any) => {
    setDelayLike(true);
    localLike(id);
    ApiPost(`itinerary/wishlist/${id}`, {})
      .then((res) => {
        setDelayLike(false);
        // console.log("Liked", res);
      })
      .catch((err) => {
        console.log("Fail", err);
      });

  };

  const localLike = (itineraryId: string) => {
    setData(
      data.map((itinerary: any) => {
        if (itinerary.id === itineraryId) {
          itinerary.isLike = !itinerary.isLike;
        }
        return itinerary;
      })
    );
  };

  const lastTourListRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const Search = async (tab: string) => {
    setData([]);
    setPage(1);
    setActiveTab(tab);
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
    return month[y] + " " + w + ", " + z;
  };


  const changeTimeFormat = (time: string) => {
    let Time = time.split(":");
    return Time[0] + ":" + Time[1];
  }

  const { t } = useTranslation();

  return (
    <>
      <div>
        <ul className="tab-links">
          <li onClick={() => Search("")}>
            <h4
              className={
                activeTab === ""
                  ? "font-18-bold active h-27"
                  : "font-18-normal color-dark  h-27"
              }
            >
              {t("Homepage.NavBar.All")}
            </h4>
          </li>
          <li onClick={() => { AuthStorage.getLang() === "en" ? Search("Only Locals know") : Search("현지인만 아는") }}>
            <h4
              className={
                activeTab === (AuthStorage.getLang() === "en" ? "Only Locals know" : "현지인만 아는")
                  ? "font-18-bold active  h-27"
                  : "font-18-normal color-dark  h-27"
              }
            >
              {t("Homepage.NavBar.Local_Picks")}
            </h4>
          </li>
          <li onClick={() => Search("K-Pop")}>
            <h4
              className={
                activeTab === "K-Pop"
                  ? "font-18-bold active  h-27"
                  : "font-18-normal color-dark  h-27"
              }
            >
              K-pop
            </h4>
          </li>
          <li onClick={() => Search("Festivals & Events")}>
            <h4
              className={
                activeTab === "Festivals & Events"
                  ? "font-18-bold active  h-27"
                  : "font-18-normal color-dark  h-27"
              }
            >
              {t("Homepage.NavBar.Festivals")}
            </h4>
          </li>
          <li onClick={() => { AuthStorage.getLang() === "en" ? Search("Popular Destination") : Search("인기명소") }}>
            <h4
              className={
                activeTab === (AuthStorage.getLang() === "en" ? "Popular Destination" : "인기명소")
                  ? "font-18-bold active  h-27"
                  : "font-18-normal color-dark  h-27"
              }
            >
              {t("Homepage.NavBar.Popular")}
            </h4>
          </li>
        </ul>
      </div>
      <div className="">
        {data &&
          data.map((items: any, index: any) => (
            <div
              className="card-box mb-40 custom-flex-margin d-md-flex"
              ref={data.length === index + 1 ? lastTourListRef : null}
            >
              <div className="p-0">
                <Link to={`/itinerary?id=${items.id}`}>
                  <div className="card-image-main">
                    <img src={items?.image[0]} className="w-100" alt=""/>
                  </div>
                </Link>
              </div>
              <div className="p-0 w-100">
                <div className="main-tour-card-data">
                  <div className="d-md-flex w-100">
                    <div className="tour-card-data">
                      <Link to={`/itinerary?id=${items.id}`}>
                        <h4> {items.title.length >= 16 ? items.title.slice(0, 16) + "..." : items.title}</h4>
                      </Link>
                    </div>
                    <div className="tour-created ml-auto">
                      <p>
                        {items.created_by_show}{" "}<span className={(items.creator === "Host") ? "green-font" : "blue-font"}>  {items.creator_show} </span>
                      </p>
                    </div>
                  </div>

                  <div className="d-flex w-100">
                    <div className="tour-card-address">
                      <h4>
                        <img src="./img/location.svg" className="mr-2" alt=""/>
                        {items.region} , {items.country}{" "}
                      </h4>
                      <div className="d-flex star-row">
                        <div className="star-list">
                          <Rating
                            emptySymbol={<img src="./img/blankstar.svg" className="mr-1" alt=""/>}
                            fullSymbol={<img src="./img/star.svg" className="mr-1" alt=""/>}
                            initialRating={items.star}
                            readonly={true}
                            stop={5}
                          />
                        </div>
                        <div className="ml-4 star-reviews">
                          <p>
                            {" "}
                            {items.star} ∙ {t("TourList.Reviews")} {items.review_count}{" "}
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
                            disabled={delayLike}
                            checked={items.isLike}
                            onClick={is_loggedin ? () => Like(items.id) : () => { }}
                            className="instruments"
                          />
                          <label
                            htmlFor={items.id}
                            className={is_loggedin ? `text-white check` : `text-white`}
                          >
                            {!items.isLike && <img src="./img/Favourite.png" className="w-20" alt=""/>}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tages">
                    {items?.course?.map((tourtag: any) => (
                      <p className="single-tag">{tourtag.name}</p>
                    ))}
                  </div>

                  <div className="d-md-flex w-100">
                    <div className="tour-card-data-date">
                      {items.creator === "Host"
                        ?
                        <h4>
                          {changeDateType(items.start_date)} {changeTimeFormat(items.start_time)} - {changeTimeFormat(items.end_time)}
                        </h4>
                        :
                        <h4>
                          {changeDateType(items.start_date)} -{" "}
                          {changeDateType(items.end_date)}
                        </h4>
                      }
                    </div>
                    <div className="tout-created-host ml-auto">
                      <p>
                        {" "}
                        <span> {items.host_count}{t('TourList.People')}</span>{t('TourList.Host')}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Tourlist;
