import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import * as QueryString from "query-string";
import ReadMore from "../../components/ReadMore";
import { ApiGet, ApiPost, ApiPut } from "../../helper/API/ApiData";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Buttons from "../../components/Buttons";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { checkImageURL, transporTation } from "../../helper/utils";
import {
  setChatId,
  setMessageState,
  setOtherUserData,
} from "../../redux/actions/chatDataAction";
import { db } from "../../firebaseConfig";
import firebase from "firebase";
import AuthStorage from "../../helper/AuthStorage";

interface CurrentUser {
  id: string;
  name: string;
  profile_url: string;
}
interface OtherUser {
  id: string;
  name: string;
  profile_url: string;
}

const HostList = (props: any) => {
  const { t } = useTranslation();
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);

  const [hostProfile, sethostProfile] = useState(false);
  const [hostingCom, SethostingCom] = useState(false);
  const [comHostNotice, SetcomHostNotice] = useState(false);
  // const [index, setIndex] = useState(0)

  //Raj
  const [hostList, setHostList] = useState<any>([]);
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const [checkCancleBox, setCheckCancleBox] = useState(false);
  const [host, setHost] = useState<any>();
  const [participantList, setParticipantList] = useState([]);
  const [hostProfileData, setHostProfileData] = useState<any>();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [hostLike, setHostLike] = useState(false);
  const [isHostingCompleted, setIsHostingCompleted] = useState(false);

  //Popup State
  const [hostNotice, sethostNotice] = useState(false);
  const [cancleHosting, setCancleHosting] = useState(false);

  const history = useHistory();

  const params = QueryString.parse(history.location.search);

  useEffect(() => {
    if (params.hostingId) props.setIsCompas(params.hostingId);
  }, []);

  const date = (date: string) => {
    const newDate = new Date(date);
    return `${newDate.toLocaleString("default", {
      month: "long",
    })} ${newDate.getDate()}, ${newDate.getFullYear()} (${newDate.toLocaleString(
      "en-us",
      { weekday: "long" }
    )})`;
  };

  // handlers
  const handleHostProfile = (index: any) => {
    sethostProfile(true);
    ApiGet(`hosting/hostByHostingId/${hostList[index].id}`).then((res: any) => {
      setHostProfileData(res.data);
      setIsLiked(res.data.user.like);
      setHostLike(res.data.user.like);
    });
  };

  const focusHostProfile = () => {
    if (props.showHostProfile) {
      props.focus.current.scrollIntoView({ behavior: "smooth" });
    } else {
      props.setShowHostProfile(true);
    }
  };

  const cancleHostingFunction = () => {
    sethostNotice(true);
    setCancleHosting(false);
    ApiPut(`hosting/cancelHosting/${host.hosting.id}`, {}).then((res: any) => {
      setHost(null);
      setCheckCancleBox(false);
      props.setRefreshPax(Math.random());
    });
  };

  // Work by Ravi Chodvadiya
  const redirectToJoin = (id: any) => {
    props.setIsCompas(id);
    let searchParams = "?id=" + params.id + "&hostingId=" + id;

    history.push(window.location.pathname + searchParams);
  };

  // Like functonality
  const [delayLike, setDelayLike] = useState(false);
  const Like = (id: string) => {
    setDelayLike(true);
    setIsLiked(!isLiked);
    ApiPost(`user/wishlist/${id}`, {})
      .then((res: any) => {
        // console.log("Liked", res);
        setDelayLike(false);
      })
      .catch((err: any) => {
        // console.log("Fail", err);
      });
  };

  const hostLiked = (id: string) => {
    setHostLike(!hostLike);
    ApiPost(`user/wishlist/${id}`, {}).then((res: any) => {
      // console.log("Liked", res);
    });
  };

  //Checking for hosting completion
  const checkIsComplete = (date: string, endTime: string) => {
    let time = moment(
      moment(date).format("YYYY:MM:DD") + " " + endTime,
      "YYYY:MM:DD HH:mm"
    );
    return time.toDate() < moment(new Date(), "YYYY:MM:DD HH:mm").toDate();
  };

  //Complete Hosting
  const completeHosting = () => {
    ApiPut(`hosting/completeHosting/${hostList[0].id}`, {}).then((res: any) => {
      SethostingComBtn();
      setIsHostingCompleted(true);
      // setCheckReviewButton(true);
      props.setIsHostingCompleted(true);
      props.setRefreshPax(Math.random());
    });
  };

  // Effects
  useEffect(() => {
    ApiGet(`hosting/host-itinerary/${params.id}`).then((res: any) => {
      setHostList(res.data);
      // res.data.map((x: any) => {
      //   x.status != "COMPLETED" &&
      //     x.participants.map((xx: any) => {
      //       if (userData.id === xx.user.id) {
      //         redirectToJoin(x.id);
      //       }
      //     });
      // });
    });
  }, [checkCancleBox, props.refresh]);

  useEffect(() => {
    if (userData) {
      ApiGet(`hosting/isrequested-hosting/${params.id}`).then((res: any) => {
        if (res.data) {
          ApiGet(`hosting/hostByHostingId/${res.data.id}`).then((ress: any) => {
            setHost(ress.data ? ress.data : null);
            if (ress.data?.hosting?.status === "COMPLETED") {
              setIsHostingCompleted(true);
            }
            setHostLike(ress.data ? ress.data.user.like : null);
          });
          setCheckCancleBox(true);
        } else {
          setCheckCancleBox(false);
        }
      });
    } else {
      setCheckCancleBox(false);
    }
  }, [hostList, userData, props.refreshHost]);

  useEffect(() => {
    if (host) {
      ApiGet(`hosting/accept-participants/${host.hosting.id}`).then(
        (res: any) => {
          setParticipantList(res.data.participants);
        }
      );
    }
  }, [host, props.refresh]);

  useEffect(() => {
    if (props.showHostProfile) {
      props.focus.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.showHostProfile]);

  const SethostingComBtn = () => {
    SethostingCom(false);
    SetcomHostNotice(true);
  };

  // Create a chat
  const dispatch = useDispatch();
  const { chatData, message_open } = useSelector(
    (state: RootStateOrAny) => state.chatData
  );
  const createChat = async (
    current_user: CurrentUser,
    other_user: OtherUser
  ) => {
    let doc_id: string;
    if (
      !current_user.id &&
      !other_user.id &&
      current_user.id === other_user.id
    ) {
      return;
    }
    if (current_user.id > other_user.id) {
      doc_id = current_user.id + other_user.id;
    } else {
      doc_id = other_user.id + current_user.id;
    }

    if (chatData.find((x: any) => x.id === doc_id)) {
      dispatch(setChatId(doc_id));
      dispatch(setOtherUserData(other_user));
      dispatch(setMessageState(!message_open));
    } else {
      const ref = db.collection("users").doc(doc_id);
      await ref.set(
        {
          [`${current_user.id}_count`]: 0,
          [`${other_user.id}_count`]: 0,
          lastMessage: "",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          ids: [current_user.id, other_user.id],
          [`${current_user.id}`]: {
            id: current_user.id,
            name: current_user.name,
            profile_url: current_user.profile_url,
          },
          [`${other_user.id}`]: {
            id: other_user.id,
            name: other_user.name,
            profile_url: other_user.profile_url,
          },
        },
        { merge: true }
      );

      dispatch(setChatId(doc_id));
      dispatch(setOtherUserData(other_user));
      dispatch(setMessageState(!message_open));
    }
  };

  // component helper function
  const showParticipants = () => (
    <div className="info-joinhost pax-host-list mt-30">
      <div className="mt-30">
        <p className="font-16-bold">
          <span
            className={
              host.hosting.participate_count === host.hosting.pax
                ? "orange-font"
                : "blue-font"
            }
          >
            {t("Host_Own.pax1")} {host.hosting.participate_count}
            {t("Host_Own.pax3")}
          </span>
          /{host.hosting.pax}
          {t("Host_Own.pax3")} {t("Host_Own.pax2")}
        </p>
      </div>
      {participantList.map((participant: any) => (
        <div className=" mt-20 host-info ">
          <div className="d-flex align-items-center w-380px">
            <img
              src={participant.user.avatar || "./img/Avatar.png"}
              className="pax-img"
              alt=""
            />
            <h5 className="font-20-bold color-dark mr-9 ml-30">
              {participant.user.user_name.length > 8
                ? participant.user.user_name.slice(0, 8) + ".."
                : participant.user.user_name}
            </h5>
            <img
              src={checkImageURL(participant.user.nationality)}
              alt="flag"
              className="round-flags"
            />
            <div className="d-flex ml-auto">
              <div className="hots-tags ml-10 mr-10 w-60">
                <p className="info mb-0 h-24">
                  {participant.user.gender === "MALE" ? t("Male") : t("Female")}
                </p>
              </div>
              <div className="hots-tags w-60 mr-0">
                <p className="info mb-0">
                  {participant.user.age_group}
                  {t("Age_Groups")}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const showHostList = () =>
    hostList.map((items: any, i: any) => {
      return (
        <div className="">
          <div className="host-list position-relative">
            <div className="p-0 ">
              <div className="host d-flex" onClick={() => handleHostProfile(i)}>
                <div>
                  <img src={items.user.avatar || "./img/Avatar.png"} alt="" />
                </div>
                <div className="ml-20">
                  <div className="d-flex img-join-host h-36 ">
                    <h5 className="font-20-bold color-dark mr-18">
                      {items.user.user_name.length > 8
                        ? items.user.user_name.slice(0, 8) + ".."
                        : items.user.user_name}
                    </h5>
                    <img
                      src={checkImageURL(items.user.nationality)}
                      alt="flag"
                    />
                  </div>
                  <div className="host-info mt-14">
                    <div
                      className={
                        items.type === "Local"
                          ? "local-host-bg hots-tags"
                          : "travel-host-bg hots-tags"
                      }
                    >
                      <p className="info">
                        {items.type === "Local"
                          ? t("Local_Host")
                          : t("Traveler_Host")}
                      </p>
                    </div>
                    <div className="hots-tags">
                      <p className="info">
                        {items.user.gender === "MALE" ? t("Male") : t("Female")}
                      </p>
                    </div>
                    <div className="hots-tags">
                      <p className="info">
                        {items.user.age_group}
                        {t("Age_Groups")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="member-count mt-23">
                <small className="font-18-normal color-darkgray h-22">
                  {date(items.date)} {items.start_time.slice(0, 5)} -
                  {items.end_time.slice(0, 5)}
                </small>
                <p className="font-18-bold h-27">
                  {t("Host_Own.pax1")}
                  <span>
                    {items.participate_count}
                    {t("Host_Own.pax3")}
                  </span>
                  /{items.pax}
                  {t("Host_Own.pax3")} {t("Host_Own.pax2")}
                </p>
              </div>
              <div
                className="host-rigtarrow cursor-p"
                onClick={() => {
                  redirectToJoin(items.id);
                }}
              >
                <img src="./img/right-arrow.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      );
    });

  const emptyParticipants = () => (
    <div className="info-joinhost pax-host-list mt-30">
      <div className="mt-30">
        <p className="font-16-bold">
          {t("Host_Own.pax1")} 0{t("Host_Own.pax3")}/{host.hosting.pax}
          {t("Host_Own.pax3")} {t("Host_Own.pax2")}
        </p>
      </div>

      <p className="font-18-normal color-darkgray mt-60 mb-60">
        {t("Empty_Participates.Text")}
      </p>
    </div>
  );

  const emptyHostlist = () => (
    <div className="info-joinhost pax-host-list">
      <p className="font-18-normal color-darkgray pt-70 pb-93 text-center">
        {t("Empty_Hostlist.Text")}
      </p>
    </div>
  );

  const completeHostingBtn = () => (
    <>
      <div className="">
        <Button
          className="cancle-my-host p-0"
          onClick={() => {
            is_loggedin && props.setRefreshHost(Math.random());
            setCancleHosting(true);
          }}
        >
          {t("Host_Details.Cancel_Btn.P1")} <br />{" "}
          {t("Host_Details.Cancel_Btn.P2")}
        </Button>
      </div>
      <div className="">
        {checkIsComplete(host?.hosting?.date, host?.hosting?.end) &&
        participantList.length !== 0 ? (
          <Button
            className="comp-my-host-blue p-0"
            onClick={() => {
              is_loggedin && SethostingCom(true);
            }}
          >
            {t("Host_Details.Hosting_Complete.P1")} <br />{" "}
            {t("Host_Details.Hosting_Complete.P2")}
          </Button>
        ) : (
          <Button
            className="comp-my-host p-0"
            disabled={checkIsComplete(host?.hosting?.date, host?.hosting?.end)}
          >
            {t("Host_Details.Hosting_Complete.P1")} <br />{" "}
            {t("Host_Details.Hosting_Complete.P2")}
          </Button>
        )}
      </div>
    </>
  );

  const hostDetails = () => (
    <div className="host-listuser">
      <div className="p-0 ">
        <div className="host d-flex">
          <div>
            <img src={host.user.avatar || "./img/Avatar.png"} alt="" />
          </div>
          <div className="ml-20">
            <div className="d-flex">
              <div className="d-flex img-join-host h-36 ">
                <h5 className="font-20-bold color-dark mr-18">
                  {host.user.user_name.length > 8
                    ? host.user.user_name.slice(0, 8) + ".."
                    : host.user.user_name}
                </h5>
                <img src={checkImageURL(host.user.flag)} alt="flag" />
              </div>

              <div className="d-flex join-pro ml-auto">
                {host?.user.id !== userData.id && (
                  <div className="join-msg ">
                    <img
                      src="./img/msg.svg"
                      alt=""
                      onClick={() => {
                        createChat(
                          {
                            id: userData.id,
                            name: userData.user_name,
                            profile_url: userData.avatar,
                          },
                          {
                            id: host?.user.id,
                            name: host?.user.user_name,
                            profile_url: host?.user.avatar,
                          }
                        );
                      }}
                    />
                  </div>
                )}
                <div className="tout-created ml-auto">
                  <div className="download-heart-icon button">
                    <div className="heart-div">
                      <input
                        type="checkbox"
                        id="id"
                        className="instruments"
                        checked={hostLike}
                        onClick={() => {
                          hostLiked(host.user.id);
                        }}
                      />
                      <label htmlFor="id" className="text-white check mb-0">
                        {!hostLike && <img src="./img/Favourite.png" alt="" />}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="host-info mt-14">
              <div
                className={
                  host?.hosting.type === "Local"
                    ? "local-host-bg hots-tags"
                    : "travel-host-bg hots-tags"
                }
              >
                <p className="info">
                  {host.hosting.type === "Local"
                    ? t("Local_Host")
                    : t("Traveler_Host")}
                </p>
              </div>
              <div className="hots-tags">
                <p className="info">
                  {host.user.gender === "MALE" ? t("Male") : t("Female")}
                </p>
              </div>
              <div className="hots-tags">
                <p className="info">
                  {host.user.age}
                  {t("Age_Groups")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex mt-40 mb-40">
          {isHostingCompleted ? (
            <div className="single-host-appstatus mt-40">
              <label className=" p-0">
                {t("Host_Details.Hosting_Completed")}
              </label>
            </div>
          ) : (
            completeHostingBtn()
          )}
        </div>

        <div className="info-joinhost">
          <div className="d-flex mt-30">
            <p className="font-16-normal color-darkgray h-26">
              {t("Host_Details.Date&Time")}
            </p>
            <p className="ml-auto font-16-bold color-dark h-26">
              {host.hosting.date.replaceAll("-", ".")}{" "}
              {host.hosting.start.slice(0, 5)}
              {" - "}
              {host.hosting.end.slice(0, 5)}
            </p>
          </div>
          <div className="d-flex mt-20">
            <p className="font-16-normal color-darkgray h-26">
              {t("Host_Details.Starts_At")}
            </p>
            <p className="ml-auto font-16-bold color-dark h-26">
              {host.hosting.location}
            </p>
          </div>
          <div className="d-flex mt-18">
            <p className="font-16-normal color-darkgray h-26">
              {t("Host_Details.Transportation")}
            </p>
            <p className="ml-auto font-16-bold color-dark h-26">
              {AuthStorage.getLang() === "ko"
                ? transporTation(host.hosting.transportation)
                : host.hosting.transportation}
            </p>
          </div>
        </div>

        <div className="info-joinhost  mt-30">
          <p className="font-18-normal color-black mt-30 ">
            {host.hosting.info}
          </p>
        </div>

        {/* if current user is host and there are participants for that hosting */}
        {host.hosting.participate_count
          ? showParticipants()
          : emptyParticipants()}
      </div>
    </div>
  );

  return (
    <>
      <div className="host-list-card">
        <div className="text-center ">
          {!checkCancleBox && (
            <Button
              className="hosts-btn "
              onClick={() => is_loggedin && focusHostProfile()}
            >
              {t("Empty_Hostlist.Host_Btn")}
            </Button>
          )}
        </div>

        {/* if user has already hosted or not */}
        {host
          ? hostDetails()
          : hostList.length
          ? showHostList()
          : emptyHostlist()}
      </div>

      <Modal
        show={hostProfile}
        onHide={() => {
          sethostProfile(false);
        }}
        dialogClassName="welcome-modal host-modal-pro"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0" closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Host_Profile_Popup.Title")}</h3>
          </div>
          <div className="custom-border-b mt-40"></div>
          {hostProfileData ? (
            <>
              <div className="w-100 mt-33">
                <div className="host d-flex">
                  <div>
                    <img
                      src={hostProfileData?.user?.avatar || "./img/Avatar.png"}
                      alt=""
                    />
                  </div>
                  <div className="ml-20 w-100">
                    <div className="d-flex">
                      <div className="d-flex img-join-host h-36 ">
                        <h5 className="font-20-bold color-dark mr-18">
                          {hostProfileData.user.user_name.length > 8
                            ? hostProfileData.user.user_name.slice(0, 8) + ".."
                            : hostProfileData.user.user_name}
                        </h5>
                        <img
                          src={checkImageURL(hostProfileData.user.flag)}
                          alt="flag"
                        />
                      </div>

                      <div className="d-flex join-pro ml-auto">
                        {hostProfileData?.user.id !== userData.id && (
                          <div className="join-msg ">
                            <img
                              src="./img/msg.svg"
                              alt=""
                              onClick={() => {
                                createChat(
                                  {
                                    id: userData.id,
                                    name: userData.user_name,
                                    profile_url: userData.avatar,
                                  },
                                  {
                                    id: hostProfileData?.user.id,
                                    name: hostProfileData?.user.user_name,
                                    profile_url: hostProfileData?.user.avatar,
                                  }
                                );
                              }}
                            />
                          </div>
                        )}
                        <div className="tout-created ml-auto">
                          <div className="download-heart-icon button">
                            <div className="heart-div">
                              <input
                                type="checkbox"
                                checked={isLiked}
                                disabled={delayLike}
                                onClick={() =>
                                  is_loggedin && Like(hostProfileData?.user.id)
                                }
                                id="id2"
                                className="instruments"
                              />
                              <label
                                htmlFor="id2"
                                className="text-white check mb-0"
                              >
                                {!isLiked && (
                                  <img src="./img/Favourite.png" alt="" />
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="host-info mt-14">
                      <div
                        className={
                          hostProfileData.hosting.type === "Local"
                            ? "local-host-bg hots-tags"
                            : "travel-host-bg hots-tags"
                        }
                      >
                        <p className="info">
                          {hostProfileData.hosting.type === "Local"
                            ? t("Local_Host")
                            : t("Traveler_Host")}
                        </p>
                      </div>
                      <div className="hots-tags">
                        <p className="info">
                          {hostProfileData.user.gender === "MALE"
                            ? t("Male")
                            : t("Female")}
                        </p>
                      </div>
                      <div className="hots-tags">
                        <p className="info">
                          {hostProfileData.user.age}
                          {t("Age_Groups")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="custom-border-b mt-30"></div>

              <div className="mt-30">
                <p className="font-20-bold color-dark h-24">
                  {t("Host_Profile_Popup.Now_Hosting")}
                </p>

                <div className="mt-24 d-flex">
                  <div className="mr-50 host-profile-modal">
                    <img src={hostProfileData.course.image} alt="" />
                    {/* <img src="./img / Image Base.svg" /> */}
                  </div>
                  <div>
                    <p className="font-20-bold color-black h-24">
                      {hostProfileData.itinerary.title}
                    </p>
                    <p className="font-16-normal color-darkgray h-22 mt-6">
                      @{hostProfileData.itinerary.region}
                      {hostProfileData.itinerary.country}
                    </p>
                    <p className="font-16-normal color-darkgray h-24 mt-10">
                      ★ {hostProfileData.review.star}｜{" "}
                      {t("Host_Profile_Popup.Reviews1")}
                      {hostProfileData.review.review}
                      {t("Host_Profile_Popup.Reviews2")} ｜
                      <span>
                        <img src="./img/onlyheart.svg" alt="" />
                      </span>
                      {hostProfileData.review.like}
                    </p>
                    <div className="mt-18">
                      <h6 className="font-18-normal color-black ls-one">
                        <ReadMore>
                          {hostProfileData.course.courses.map(
                            (x: any, i: any) => {
                              return `${i + 1}. ${x} `;
                            }
                          )}
                        </ReadMore>
                      </h6>
                      <p className="font-16-normal color-darkgray mt-10">
                        {hostProfileData.hosting.date.replaceAll("-", ".")}
                        {hostProfileData.hosting.start.slice(0, 5)}
                        {" - "}
                        {hostProfileData.hosting.end.slice(0, 5)}
                      </p>
                      <h1 className="font-16-bold h-20 mt-20">
                        {t("Host_Own.pax1")}
                        <span className="blue-font">
                          {hostProfileData.hosting.participate_count}
                        </span>
                        /{hostProfileData.hosting.pax}
                        {t("ViewHost.pax1")} {t("ViewHost.pax2")}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </Modal.Body>
      </Modal>

      {/* Cancel Hosting Popup */}
      <Modal
        show={cancleHosting}
        onHide={() => {
          setCancleHosting(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Hosting_Popup.Title")}</h3>
          </div>
          <div className="welcome-content welcome-body mt-60">
            <h3 className="font-20-normal color-black">
              {t("Cancel_Hosting_Popup.Question")}
            </h3>
            <p className="font-18-normal color-darkgray mt-34">
              {t("Cancel_Hosting_Popup.Text")}
            </p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-40">
          <div className="">
            <Buttons
              ButtonStyle="join-cancle-btn"
              onClick={() => {
                setCancleHosting(false);
              }}
            >
              {t("Cancel_Hosting_Popup.Cancel")}
            </Buttons>
          </div>
          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => cancleHostingFunction()}
            >
              {t("Cancel_Hosting_Popup.Confirm")}
            </Buttons>
          </div>
        </div>
      </Modal>

      {/* Cancel Hosting Notice Popup */}
      <Modal
        show={hostNotice}
        onHide={() => {
          sethostNotice(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0"></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Notice_Popup.Notice")}</h3>
          </div>
          <div className="accept-notice mt-60">
            <p className="h-60">{t("Cancel_Notice_Popup.Body")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                sethostNotice(false);
              }}
            >
              {t("Cancel_Notice_Popup.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>

      {/* Hosting Completed Popup */}
      <Modal
        show={hostingCom}
        onHide={() => {
          SethostingCom(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-34">{t("Hosting_Complete.Title")}</h3>
          </div>
          <div className="com-hosting mt-60">
            <p className="text-center font-18-normal color-darkgray h-27">
              {t("Hosting_Complete.Text")}
            </p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-50">
          <div className="">
            <Buttons
              ButtonStyle="join-cancle-btn"
              onClick={() => SethostingCom(false)}
            >
              {t("Hosting_Complete.Cancel")}
            </Buttons>
          </div>
          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => completeHosting()}
            >
              {t("Hosting_Complete.Yes")}
            </Buttons>
          </div>
        </div>
      </Modal>

      {/* Hosting Complete Notice Popup */}
      <Modal
        show={comHostNotice}
        onHide={() => {
          SetcomHostNotice(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0"></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title h-34">
            <h3>{t("Hosting_Complete.Notice.Title")}</h3>
          </div>
          <div className="yes-notice mt-60">
            <p className="font-17-normal">
              {t("Hosting_Complete.Notice.Body")}
            </p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                SetcomHostNotice(false);
              }}
            >
              {t("Hosting_Complete.Notice.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HostList;
