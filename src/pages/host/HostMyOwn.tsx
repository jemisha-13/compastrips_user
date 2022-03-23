import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import InputField from "../../components/Inputfield";
import Buttons from "../../components/Buttons";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiGet, ApiPost } from "../../helper/API/ApiData";
import AddEventsAndPlaces from "./AddEventsAndPlaces";
import { RootStateOrAny, useSelector } from "react-redux";
import NumberInput from "../../components/NumberInput";
import { useHistory, useLocation } from "react-router";
import TextareaAutosize from "react-textarea-autosize";

interface itineraryList {
  id: string;
  name: string;
  image: string[];
  region: string;
}

interface formData {
  title: string;
  aboutTour: string;
  startsAt: string;
  hostType: string;
  other: string;
  pax: string;
  introduction: string;
  transportation: string;
}

const HostMyOwn = () => {
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const { t } = useTranslation();
  const history = useHistory();
  const [hostingNotice, setHostingNotice] = useState(false);

  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  //Itinerary List
  const [itineraryList, setItineraryList] = useState<itineraryList[]>([]);

  //Checking Region
  const [regionErr, setRegionErr] = useState(false);
  const checkRegion = () => {
    setRegionErr(false);
    for (let i = 0; i < itineraryList.length - 1; i++) {
      if (itineraryList[i].region !== itineraryList[i + 1].region) {
        setRegionErr(true);
        break;
      }
    }
  };

  //Form Data
  const resetFormData = {
    title: "",
    aboutTour: "",
    startsAt: "",
    hostType: "Local",
    other: "",
    pax: "",
    introduction: "",
    transportation: "",
  };

  const [formData, setFormData] = useState<formData>(resetFormData);
  const [isDisabled, setIsDisabled] = useState(true);
  // const [generatedID, setGeneratedID] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("23:30");

  // const resetDataErr = {
  //   titleErr: false,
  //   aboutTourErr: false,
  //   startsAtErr: false,
  //   hostingDateErr: false,
  //   otherErr: false,
  //   paxErr: false,
  //   introductionErr: false,
  //   startTimeErr: false,
  //   endTimeErr: false,
  //   trasportationErr: false,
  //   emptyArray: false,
  // }

  // const [dataErr, setDataErr] = useState(resetDataErr);
  const [isOtherTrasport, setIsOtherTrasport] = useState(false);

  useEffect(() => {
    if (formData.transportation === `${t("Host_Own.Options.Other")}`) {
      setIsOtherTrasport(true);
    } else {
      setFormData((prev: any) => {
        return {
          ...prev,
          other: "",
        };
      });
      setIsOtherTrasport(false);
    }
  }, [formData.transportation]);

  const [canHost, setCanHost] = useState(false);
  const isAlreadyHosting = () => {
    ApiGet("hosting/isAlreadyHosted").then((res: any) => {
      setCanHost(res?.data?.status);
    });
  };

  const validation = () => {
    let Err = {
      titleErr: false,
      aboutTourErr: false,
      startsAtErr: false,
      hostingDateErr: false,
      otherErr: false,
      paxErr: false,
      introductionErr: false,
      startTimeErr: false,
      endTimeErr: false,
      trasportationErr: false,
      emptyArray: false,
    };

    if (!formData.title) {
      Err.titleErr = true;
    }
    if (!formData.aboutTour) {
      Err.aboutTourErr = true;
    }
    if (!hostingDate) {
      Err.hostingDateErr = true;
    }
    if (!formData.introduction) {
      Err.introductionErr = true;
    }
    if (isOtherTrasport && !formData.other) {
      Err.otherErr = true;
    }
    if (!formData.pax || formData.pax === "0") {
      Err.paxErr = true;
    }
    if (!formData.startsAt) {
      Err.startsAtErr = true;
    }
    if (!formData.transportation) {
      Err.trasportationErr = true;
    }
    if (!startTime) {
      Err.startTimeErr = true;
    }
    if (!endTime) {
      Err.endTimeErr = true;
    }
    if (!itineraryList.length) {
      Err.emptyArray = true;
    }

    // setDataErr(Err);

    if (
      !Err.titleErr &&
      !Err.aboutTourErr &&
      !Err.hostingDateErr &&
      !Err.introductionErr &&
      !Err.otherErr &&
      !Err.paxErr &&
      !Err.startsAtErr &&
      !Err.trasportationErr &&
      !Err.startTimeErr &&
      !Err.endTimeErr &&
      !regionErr &&
      !Err.emptyArray
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // validation();
    setIsDisabled(!validation());
  }, [formData, startTime, endTime, regionErr, isOtherTrasport, itineraryList]);

  //Creating Hosting
  const createHosting = (id: string) => {
    ApiPost("hosting/create", {
      type: formData.hostType,
      date: hostingDate,
      start_time: startTime,
      end_time: endTime,
      location: formData.startsAt,
      transportation: isOtherTrasport
        ? formData.other
        : formData.transportation,
      pax: formData.pax,
      host_information: formData.introduction,
      itinerary_id: id,
    }).then((res: any) => {});
  };

  const handleSubmit = () => {
    ApiPost("itinerary/create", {
      title: formData.title,
      information: formData.aboutTour,
      disclosure: "OPEN",
      start_date: hostingDate,
      end_date: hostingDate,
      courses: itineraryList.map((x: { id: any }) => x.id),
    }).then((res: any) => {
      createHosting(res.data.id);
      // setGeneratedID(res.data.id);
      sethostNoticeBtn();
      setFormData(resetFormData);
    });
  };

  //Trasportation
  const trasportOption = [
    { name: t("Host_Own.Options.Car") },
    { name: t("Host_Own.Options.Taxi") },
    { name: t("Host_Own.Options.Public_Transportation") },
  ];

  const [hostNotice, sethostNotice] = useState(false);
  const [hostTour, sethostTour] = useState(false);
  const [likeDelete, setlikeDelete] = useState(false);
  const [hasDelete, sethasDelete] = useState(false);
  const [hostingDate, setHostingDate] = useState<Date | null>();

  const [showTours, setShowTours] = useState<boolean>(false);

  //Time Dropdown
  const [days, setDays] = useState<any[]>([]);
  const [endT, setEndT] = useState<any[]>([]);
  const getDays = () => {
    let hours = [];
    let minutes = 0;
    let m = "0";
    let h = "0";

    for (let i = 0; i <= 24; i++) {
      for (let j = 0; j <= 1; j++) {
        if (i !== 24 && j < 30) {
          if (minutes === 60) {
            minutes = 0;
          }

          if (i < 10) {
            h = "0" + i.toString();
          } else {
            h = i.toString();
          }

          if (minutes < 10) {
            m = "0" + minutes.toString();
          } else {
            m = minutes.toString();
          }

          hours.push({
            value: h.toString() + ":" + m.toString(),
            label: h.toString() + ":" + m.toString(),
          });
          minutes += 30;
        }
      }
    }
    setDays(hours);
  };

  const getEndTime = () => {
    let end: any[] = [];
    let minutes = 0;
    let m = "0";
    let h = "0";
    let start_hour = startTime.split(":");

    for (let i = parseInt(start_hour[0]); i <= 23; i++) {
      for (let j = 0; j < 2; j++) {
        if (i < 10) {
          h = "0" + i.toString();
        } else {
          h = i.toString();
        }

        if (j === 0) {
          minutes = 0;
        } else {
          minutes = 30;
        }

        if (minutes < 10) {
          m = "0" + minutes.toString();
        } else {
          m = minutes.toString();
        }

        end.push({
          value: h + ":" + m.toString(),
          label: h.toString() + ":" + m.toString(),
        });
        if (start_hour[0] + ":" + start_hour[1] === h + ":" + m) {
          end.pop();
        }
        minutes += 30;
      }
    }

    // for (let i = 0; i <= (parseInt(start_hour[0]) * 2) - 1; i++) {
    //   var el = end.shift();
    //   end.push(el)
    // }
    // if (start_hour[1] === '30') {
    //   el = end.shift()
    //   end.push(el)
    // }
    if (start_hour[1] === "30") {
      end.shift();
    }
    end.push({ value: "23:59", label: "23:59" });
    setEndT(end);
  };

  useEffect(() => {
    setEndT([]);
    setEndTime("");

    getEndTime();
  }, [startTime]);

  useEffect(() => {
    isAlreadyHosting();
    getDays();
    setIsDisabled(!validation());
  }, []);

  const onHostDatePickerClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  const sethostNoticeBtn = () => {
    sethostTour(false);
    sethostNotice(true);
  };

  const sethasDeleteBtn = () => {
    sethasDelete(true);
    setlikeDelete(false);
  };

  //Delete Itinerary
  const [deleteID, setDeleteID] = useState("");
  const deleteItinerary = (id: string) => {
    setItineraryList((prev: any[]) =>
      prev.filter((x: { id: string }) => x.id !== id)
    );
  };

  const [tourDetails, setTourDetails] = useState(false);
  const [tourCourse, setTourCourse] = useState<any>();

  const getTourById = (id: string) => {
    ApiGet(`itinerary/tourcourse/${id}`).then((res: any) =>
      setTourCourse(res.data)
    );
  };

  useEffect(() => {
    checkRegion();
  }, [itineraryList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="host-own-page main-container">
        <div className="myAcc">
          <h1 className="h-88 color-dark">{t("Host_Own.Host_Own")}</h1>
        </div>
        <div className="itinerary">
          <div className="d-flex align-items-center">
            <div className="">
              <h3 className="font-30-bold color-dark h-40">
                {t("Host_Own.Itinerary")}
              </h3>
              <p
                className={
                  regionErr
                    ? "font-20-normal error-color h-30 mt-16"
                    : "font-20-normal blue-font h-30 mt-16"
                }
              >
                {t("Host_Own.Span")}
              </p>
            </div>
            <div className="ml-auto">
              <Buttons
                ButtonStyle="addBtn"
                onClick={() => {
                  setShowTours(true);
                }}
              >
                {t("Host_Own.Add")}
              </Buttons>
            </div>
          </div>
        </div>

        {itineraryList.length === 0 ? (
          <div>
            <div className="line mt-30"></div>
            <div className="selectionArea">
              <p className="font-20-normal color-darkgray h-30">
                {t("Host_Own.Placeholder.Places_Events")}
              </p>
            </div>
            <div className="line"></div>
          </div>
        ) : (
          <>
            <div>
              <div className="line -mt-10 mt-30"></div>
              {itineraryList?.map((data, i: number) => (
                <>
                  <div className="d-flex align-item-center mt-40">
                    <div className="round-number">{i + 1}</div>
                    <div>
                      <p className="font-20-normal color-dark">{data.name}</p>
                    </div>
                    <div className="ml-auto">
                      <Buttons
                        ButtonStyle="more-details-btn font-14-normal"
                        onClick={() => {
                          getTourById(data.id);
                          setTourDetails(true);
                        }}
                      >
                        {" "}
                        {t("Host_Own.More")}{" "}
                      </Buttons>
                      <Buttons
                        ButtonStyle="delete-itinerary-btn"
                        onClick={() => {
                          setlikeDelete(true);
                          setDeleteID(data.id);
                        }}
                      >
                        {" "}
                        {t("Host_Own.Delete")}{" "}
                      </Buttons>
                    </div>
                  </div>
                </>
              ))}
            </div>

            <div className="line mt-30"></div>
          </>
        )}

        <div className="mt-40 host-itiimage d-flex">
          {itineraryList?.map((data, i: number) => (
            <img src={data?.image[0]} alt="" />
          ))}
        </div>

        <div className="Owntitle-input">
          <InputField
            label={t("Host_Own.Title")}
            fromrowStyleclass=""
            name="title"
            value={formData.title}
            placeholder={t("Host_Own.Placeholder.Title")}
            type="text"
            InputstyleClass="custom-file-input h-62 mt-20"
            lablestyleClass="font-30-bold color-dark mt-80 h-40"
            onChange={(e: any) => {
              handleChange(e);
            }}
          />
        </div>

        <div className="w-100 Owntitle-input-2 mt-80 ">
          <label className="font-30-bold color-dark h-40">
            {t("Host_Own.About_Tour")}
          </label>
          <TextareaAutosize
            minRows={6}
            onChange={(e: any) => {
              handleChange(e);
            }}
            name="aboutTour"
            value={formData.aboutTour}
            placeholder={t("Host_Own.Placeholder.About_Tour")}
            className="custom-file-input mt-20 pading-inputs"
            maxLength={500}
          />
        </div>

        <div className="line mt-80"></div>

        <div className="mt-69 w-600">
          <h3 className="font-30-bold color-dark h-40">
            {t("Host_Own.Profile")}
          </h3>
          <div>
            <div className="own-profile-in w-100 mt-20">
              <div className="d-flex">
                <div className="hostpro mr-40">
                  <img src={userData?.avatar || "./img/Avatar.png"} alt="" />
                </div>
                <div className="">
                  <p className="font-20-normal color-darkgray h-30">
                    {t("Host_Own.Gender")}
                  </p>
                  <p className="font-20-normal color-darkgray h-30 mt-16">
                    {t("Host_Own.Age")}
                  </p>
                  <p className="font-20-normal color-darkgray h-30 mt-16">
                    {t("Host_Own.Nationality")}
                  </p>
                </div>
                <div className=" ml-auto">
                  <p className="font-20-bold text-right ">{userData?.gender}</p>
                  <p className="font-20-bold text-right mt-16">
                    {userData?.age_group}
                  </p>
                  <p className="font-20-bold text-right mt-16">
                    {userData?.nationality}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="line mt-90"></div>

        <div className="host-type-radio w-600">
          <h3 className="font-30-bold color-dark mt-80">
            {t("Host_Own.Host_Type")}
          </h3>

          <div className="mt-31 d-flex">
            <div className="radio-btn ">
              <label className="radio-btn-detail mb-0 mr-0">
                <input
                  defaultChecked
                  type="radio"
                  name="hostType"
                  id="host-type"
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                  value="Local"
                />
                {"Local Host" && (
                  <div className="radio-check p-0 m-0 text-center h-56">
                    {t("Host_Own.Local_Host")}
                  </div>
                )}
              </label>
            </div>
            <div className="radio-btn ">
              <label className="radio-btn-detail mb-0 ml-27">
                <input
                  type="radio"
                  name="hostType"
                  id="host-type"
                  value="Travel"
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                />
                {"Local Host" && (
                  <div className="radio-check p-0 m-0 text-center  h-56">
                    {t("Host_Own.Travel_Host")}
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="line mt-80"></div>

        <div>
          <div className="mt-80 w-600">
            <div className="host-myown-date h-40">
              <h3 className="font-30-bold color-dark">
                {t("Host_Own.Hosting_Date")}
              </h3>
              <p className="font-20-normal blue-font ml-auto">
                {t("Host_Own.Single_Day_Hosting")}
              </p>
            </div>

            <div className="mt-30 single-day-host d-flex">
              <div className="position-relative mr-17">
                <DatePicker
                  minDate={new Date()}
                  autoComplete="off"
                  selected={hostingDate}
                  dateFormat="yyyy.MM.dd"
                  placeholderText="YYYY-MM-DD"
                  id="hostDate"
                  onChange={(date: Date | null) => {
                    setHostingDate(date);
                  }}
                />
                <div className="single-day-calender">
                  <img
                    src="./img/calendar.png"
                    alt=""
                    onClick={() => {
                      onHostDatePickerClick("hostDate");
                    }}
                  />{" "}
                </div>
              </div>

              <div className="mr-32">
                <Select
                  className=""
                  options={days}
                  label=""
                  name="startDate"
                  isSearchable={false}
                  placeholder=""
                  onChange={(e: any) => {
                    setStartTime(e.value);
                  }}
                />
              </div>
              <div>
                <Select
                  className=""
                  options={endT}
                  value={{ value: endTime, label: endTime }}
                  select={endTime}
                  label=""
                  name="endDate"
                  isSearchable={false}
                  placeholder=""
                  onChange={(e: any) => {
                    setEndTime(e.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-600 Owntitle-input">
          <InputField
            label={t("Host_Own.Starts_At")}
            fromrowStyleclass=""
            name="startsAt"
            value={formData.startsAt}
            placeholder={t("Host_Own.Placeholder.Start_At")}
            type="text"
            InputstyleClass="hostmyown-input mt-30 h-62"
            lablestyleClass="font-30-bold color-dark mt-80 h-40"
            onChange={(e: any) => {
              handleChange(e);
            }}
          />
        </div>

        <div className="w-600 Owntitle-input">
          <h3 className="font-30-bold color-dark mt-80 h-40">
            {t("Host_Own.Transportation")}
          </h3>

          <div className="mt-30 trans-radio">
            <div className="d-flex flex-wrap">
              {trasportOption.map((t) => (
                <div className="radio-btn ">
                  <label className="radio-btn-detail">
                    <input
                      type="radio"
                      name="transportation"
                      id="transportation"
                      value={t.name}
                      onClick={(e: any) => {
                        handleChange(e);
                      }}
                    />
                    {t.name && <div className="radio-check">{t.name}</div>}
                  </label>
                </div>
              ))}
              <div className="radio-btn ">
                <label className="radio-btn-detail">
                  <input
                    type="radio"
                    name="transportation"
                    id="transportation"
                    value="Other"
                    onClick={(e: any) => {
                      handleChange(e);
                    }}
                  />
                  {"Other" && (
                    <div className="radio-check">
                      {t("Host_Own.Options.Other")}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {formData.transportation === "Other" && (
            <InputField
              label=""
              fromrowStyleclass=""
              name="other"
              value={formData.other}
              placeholder={t("Host_Own.Placeholder.Other")}
              type="text"
              InputstyleClass="hostmyown-input mt-20 h-62"
              lablestyleClass=""
              onChange={(e: any) => {
                handleChange(e);
              }}
            />
          )}
        </div>

        <div className="position-relative Owntitle-input w-600">
          <div className="d-flex mt-80">
            <h3 className="font-30-bold h-36 color-dark">
              {t("Host_Own.Pax_Number")}
              <span className="font-18-normal color-gray ml-2">
                {t("Host_Own.Excluding_Host")}
              </span>
            </h3>
          </div>

          <NumberInput
            name="pax"
            value={formData.pax.toString()}
            placeholder={t("Host_Own.Placeholder.Pax_Number")}
            InputstyleClass="hostmyown-input w-100 mt-27 pax-h-62"
            onChange={(e: any) => {
              handleChange(e);
            }}
            maxLength={1}
          />
          <p className="pax font-20-normal color-dark">{t("Host_Own.Pax")}</p>
        </div>

        <div className="Owntitle-input-2">
          <InputField
            label={t("Host_Own.Introduce_Yourself")}
            fromrowStyleclass=""
            name="introduction"
            value={formData.introduction}
            placeholder={t("Host_Own.Placeholder.Introduce_Yourself")}
            type="textarea"
            maxLength={500}
            InputstyleClass="hostmyown-input mt-30"
            lablestyleClass="font-30-bold h-40 color-dark mt-80"
            onChange={(e: any) => {
              handleChange(e);
            }}
          />
        </div>

        <div className="hostmyown-button-wrapper mb-118">
          <Buttons
            ButtonStyle="host-own-cancel-btn"
            onClick={() => {
              setFormData(resetFormData);
              history.push("/");
            }}
          >
            {t("Host_Own.Cancel")}
          </Buttons>
          <Buttons
            disabled={isDisabled}
            ButtonStyle={
              isDisabled
                ? "host-btn-disabled host-save-btn"
                : "host-btn host-save-btn"
            }
            onClick={() => {
              !canHost ? setHostingNotice(true) : sethostTour(true);
            }}
          >
            {t("Host_Own.Host")}
          </Buttons>
        </div>
      </div>

      <AddEventsAndPlaces
        set={setShowTours}
        value={showTours}
        setCourseList={setItineraryList}
        selectedCourse={itineraryList}
      />

      <Modal
        show={tourDetails}
        onHide={() => {
          setTourDetails(false);
        }}
        dialogClassName="tour-details-modal"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="p-0" closeButton>
          <Modal.Title id="tour-details-title">
            <h6 className="font-30-bold color-dark h-40">
              {t("Tour_Course_Details.Header")}
            </h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="itinery_details_modal p-0">
          <div className="tour-details-body">
            <table className="tour-details-table">
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.City")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.region}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Category")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.category}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Name")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.name}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Photos")}
                  </h6>
                </th>
                <td>
                  <div className="upload-pic">
                    {tourCourse?.image.map((data: any) => (
                      <img src={data} alt="" />
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Date")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.opening_date} - {tourCourse?.closing_date}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black about-th">
                    {t("Tour_Course_Details.About")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray about-td">
                    {tourCourse?.summary}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Address")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.address}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.URL")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.website}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Phone_Number")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.mobile}
                  </h6>
                </td>
              </tr>
              <tr>
                <th>
                  <h6 className="font-16-bold color-black">
                    {t("Tour_Course_Details.Nearest_Public_Trasportation")}
                  </h6>
                </th>
                <td>
                  <h6 className="font-16-normal color-darkgray h-28">
                    {tourCourse?.n_p_transportation}
                  </h6>
                </td>
              </tr>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={hostTour}
        onHide={() => {
          sethostTour(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0" closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Host_Own.Host_Popup.Host")}</h3>
          </div>
          <div className="welcome-content host-tour-modal mt-60">
            <p className="font-24-bold h-30 color-black">
              {t("Host_Own.Host_Popup.Title")}
            </p>
            <div className="mt-18"></div>

            <div className="d-flex mt-10">
              <div className="dots">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <div>
                <p>{t("Host_Own.Host_Popup.Point1")}</p>
              </div>
            </div>

            <div className="d-flex mt-10">
              <div className="dots">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <div>
                <p>{t("Host_Own.Host_Popup.Point2")}</p>
              </div>
            </div>

            <div className="d-flex mt-10">
              <div className="dots">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <div>
                <p>{t("Host_Own.Host_Popup.Point3")}</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-50">
          <div className="">
            <Buttons
              ButtonStyle="join-cancle-btn"
              onClick={() => {
                sethostTour(false);
              }}
            >
              {t("Host_Own.Host_Popup.Cancel")}
            </Buttons>
          </div>

          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("Host_Own.Host_Popup.Host_Btn")}
            </Buttons>
          </div>
        </div>
      </Modal>

      <Modal
        show={hostNotice}
        onHide={() => {
          sethostNotice(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0" closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Host_Own.Notice_Popup.Notice")}</h3>
          </div>
          <div className="welcome-content host-tour-modal-notice mt-60">
            <p className="">{t("Host_Own.Notice_Popup.Body")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                history.push("/");
                sethostNotice(false);
              }}
            >
              {t("Host_Own.Notice_Popup.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>

      <Modal
        show={likeDelete}
        onHide={() => {
          setlikeDelete(false);
        }}
        dialogClassName="welcome-modal del-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-36">{t("Host_Own.Delete_Course.Title")}</h3>
          </div>
          <div className="">
            <p className="font-24-normal h-36 color-black mt-36 text-center">
              {t("Host_Own.Delete_Course.Body")}
            </p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-40">
          <div className="">
            <Buttons
              ButtonStyle="join-cancle-btn"
              onClick={() => {
                setlikeDelete(false);
              }}
            >
              {t("Host_Own.Delete_Course.Cancel")}
            </Buttons>
          </div>

          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => {
                sethasDeleteBtn();
                deleteItinerary(deleteID);
              }}
            >
              {t("Host_Own.Delete_Course.Delete")}
            </Buttons>
          </div>
        </div>
      </Modal>

      <Modal
        show={hasDelete}
        onHide={() => {
          sethasDelete(false);
        }}
        dialogClassName="welcome-modal del-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-36">{t("Host_Own.Delete_Course_Popup.Title")}</h3>
          </div>
          <div className="">
            <p className="font-24-normal h-36 color-black mt-36 text-center">
              {t("Host_Own.Delete_Course_Popup.Body")}
            </p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-40">
          <div className="j-content-center d-flex">
            <Buttons
              ButtonStyle="app-sent-ok w-240"
              onClick={() => {
                sethasDelete(false);
              }}
            >
              {t("Host_Own.Delete_Course_Popup.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>

      <Modal
        show={hostingNotice}
        onHide={() => {
          setHostingNotice(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0" closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Host_Own.Already_Hosting.Title")}</h3>
          </div>
          <div className="welcome-content host-tour-modal-notice mt-60">
            <p className="text-center">{t("Host_Own.Already_Hosting.T1")}</p>
            <p className="text-center">{t("Host_Own.Already_Hosting.T2")}</p>
            <p className="text-center">{t("Host_Own.Already_Hosting.T3")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                setHostingNotice(false);
              }}
            >
              {t("Host_Own.Already_Hosting.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default HostMyOwn;
