import { Accordion, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ApiGet, ApiPost } from "../../helper/API/ApiData";
import { useHistory } from "react-router-dom";
import * as QueryString from "query-string";
import { RootStateOrAny, useSelector } from "react-redux";
import Rating from "react-rating";
import { useTranslation } from "react-i18next";

const ItineraryDescription = (props: any) => {
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);


  const history = useHistory();
  const params = QueryString.parse(history.location.search);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    getItinerary();
  }, []);

  const getItinerary = () => {
    ApiGet(`itinerary/itinerary-course/${params.id}`)
      .then((data: any) => setData(data.data))
      .catch(() => setData({}));
  };

  //Like function
  const [delayLike, setDelayLike] = useState(false);
  const Like = (id: any) => {
    setDelayLike(true);
    setData((prev: any) => {
      return {
        ...prev,
        like: !prev.like,
      };
    });

    ApiPost(`itinerary/wishlist/${id}`, {})
      .then((res) => {
        // console.log("Liked", res);
        setDelayLike(false);
      })
      .catch((err) => {
        // console.log("Fail", err);
      });
  };

  const { t } = useTranslation();

  return (
    <div className="">
      {data && (
        <div>
          <div className="itinerary-title d-flex">
            <div>
              <h1 className="font-55-bold min-h-88 w-606 mt-56 color-dark">
                {data.title}
              </h1>
            </div>

            <span className="single-bigheart">
             
                <div className="heart-div">
                  <input
                    type="checkbox"
                    checked={data.like}
                    disabled={delayLike}
                    onClick={is_loggedin ? () => Like(data.id) : () => { }}
                    id="heart"
                    className="instruments"
                  />
                  <label
                    htmlFor="heart"
                    className={is_loggedin ? `text-white check` : `text-white`}
                  >
                    {!(data.like) && <img src="./img/Favourite.png" alt=""/>}
                  </label>
                </div>
              </span>
            
          </div>

          <div className="d-flex h-40 mt-30">
            <div>
              <img src="./img/location-vector.png" alt=""/>
            </div>
            <h3 className="font-c mb-0 ml-22 font-34-normal color-dark">
              {data.region}, {data.country}
            </h3>
          </div>

          <div className="tour-created">
            <p className="font-18-normal h-22 mt-16 color-black">
              {data.created_by_show}{" "}
              <span
                className={
                  data.creator === "Host"
                    ? "green-font font-18-bold"
                    : "blue-font font-18-bold"
                }
              >
                {data.creator_show}
              </span>
            </p>

            <div className="d-flex  mt-16">
              <div className="single-list-star">
                <Rating
                  emptySymbol={
                    <img src="./img/blankstar.svg" className="mr-1" alt=""/>
                  }
                  fullSymbol={<img src="./img/star.svg" className="mr-1" alt=""/>}
                  initialRating={props?.reviews.star}
                  readonly={true}
                  stop={5}
                />
              </div>
            </div>
          </div>

          <div className="itinerary-list-section">
            <h3 className="font-30-bold font-c h-40 ">{t('Itinerary_Desc.Itinerary')}</h3>
            <div className="custom-border-b mt-40"></div>
            <div className="mt-30">
              {data.courses &&
                data.courses.map((items: any, i: number) => (
                  <Accordion className="mb-40">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      className="p-0 pointer"
                    >
                      <div className="accordian-title">
                        <span className="round-number">{i + 1}</span>
                        <p className="font-20-normal color-dark">
                          {items.name}
                        </p>
                        <img
                          src="./img/dropdown-arrow.png"
                          alt=""
                          className="ml-auto"
                        />
                      </div>
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                      <div className="acc-body-content">{items.summary}</div>
                    </Accordion.Collapse>
                  </Accordion>
                ))}
              <div className="custom-border-b -mt-10"></div>
            </div>
          </div>

          <div className="about-tour-section">
            <h3 className="font-30-bold h-40  ">{t('Itinerary_Desc.About_the_tour')}</h3>

            <div className="mt-19">
              <p className="font-20-normal color-dark">{data.info}</p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDescription;
