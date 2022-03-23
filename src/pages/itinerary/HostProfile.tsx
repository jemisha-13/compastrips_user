import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import InputField from "../../components/Inputfield";
import Buttons from "../../components/Buttons";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { RootStateOrAny, useSelector } from "react-redux";
import { ApiGet, ApiPost } from "../../helper/API/ApiData";
import NumberInput from "../../components/NumberInput";
import * as QueryString from "query-string";
import { useHistory } from "react-router";

interface formData {
  startsAt: string;
  hostType: string;
  other: string;
  pax: string;
  introduction: string;
  transportation: string;
}

const HostMyOwn = (props: any) => {
  const [hostingNotice, setHostingNotice] = useState(false);
  const [hostNotice, sethostNotice] = useState(false);
  const [hostTour, sethostTour] = useState(false);
  const [hostingDate, setHostingDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const history = useHistory();
  const params = QueryString.parse(history.location.search);

  const { t } = useTranslation();
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);

  //Form Data
  const resetFormData = {
    startsAt: "",
    hostType: "Local",
    other: "",
    pax: "",
    introduction: "",
    transportation: "",
  };

  const [formData, setFormData] = useState<formData>(resetFormData);

  // const resetDataErr = {
  //   startsAtErr: false,
  //   hostingDateErr: false,
  //   otherErr: false,
  //   paxErr: false,
  //   introductionErr: false,
  //   startTimeErr: false,
  //   endTimeErr: false,
  //   trasportationErr: false,
  //   emptyArray: false,
  // };

  // const [dataErr, setDataErr] = useState(resetDataErr);
  const [isDisabled, setIsDisabled] = useState(true);
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

    // setDataErr(Err);

    if (
      !Err.hostingDateErr &&
      !Err.introductionErr &&
      !Err.otherErr &&
      !Err.paxErr &&
      !Err.startsAtErr &&
      !Err.trasportationErr &&
      !Err.startTimeErr &&
      !Err.endTimeErr &&
      !Err.emptyArray
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // validation();
    setIsDisabled(!validation());
  }, [formData, startTime, endTime, isOtherTrasport]);

  const createHosting = (id: any) => {
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
    }).then((res: any) => {
      sethostNoticeBtn();
      props.setRefreshHost(Math.random());
    });
  };

  //Trasportation
  const trasportOption = [
    { name: t("Host_Own.Options.Car") },
    { name: t("Host_Own.Options.Taxi") },
    { name: t("Host_Own.Options.Public_Transportation") },
  ];

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
          if (minutes == 60) {
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
  }, []);

  const onHostDatePickerClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  const sethostNoticeBtn = () => {
    sethostTour(false);
    sethostNotice(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const removeHostProfile = () => {
    props.topFocus.current.scrollIntoView({ behavior: "smooth" });
    props.setShowHostProfile(false);
  };

  return (
    <>
      <div className="mt-80 w-600">
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
                {"Other" && <div className="radio-check">Other</div>}
              </label>
            </div>
          </div>
        </div>

        {formData.transportation === `${t("Host_Own.Options.Other")}` && (
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

      <div className="hostmyown-button-wrapper mb-21">
        <Buttons
          ButtonStyle="host-own-cancel-btn"
          onClick={() => {
            removeHostProfile();
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

      <Modal
        show={hostTour}
        onHide={() => {
          sethostTour(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Host_Popup.Host")}</h3>
          </div>
          <div className="welcome-content would-host mt-60 text-center">
            <p className="font-24-normal h-30 color-black">
              {t("Host_Popup.Title")}
            </p>
            <p className="mt-10">{t("Host_Popup.Body")}</p>
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
              {t("Host_Popup.Cancel")}
            </Buttons>
          </div>

          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => {
                createHosting(params.id);
              }}
            >
              {t("Host_Popup.Host_Btn")}
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
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Notice_Popup.Notice")}</h3>
          </div>
          <div className="welcome-content would-host-notice mt-60">
            <p className="h-60">{t("Notice_Popup.Body")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                sethostNotice(false);
                removeHostProfile();
              }}
            >
              {t("Notice_Popup.OK")}
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
