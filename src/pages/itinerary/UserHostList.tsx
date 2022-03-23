import { useState, useEffect } from "react";
import { Button, Modal} from "react-bootstrap";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Buttons from "../../components/Buttons";
import { ApiGet, ApiPost, ApiPut } from "../../helper/API/ApiData";
import * as QueryString from "query-string";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Rating from "react-rating";
import InputField from "../../components/Inputfield";
import { checkImageURL, transporTation } from "../../helper/utils";
import { setChatId, setMessageState, setOtherUserData } from "../../redux/actions/chatDataAction";
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


const UserHostList = (props: any) => {
  const [joinHost, setjoinHost] = useState(false);
  const [appApply, setappApply] = useState(false);
  const [cancleApp, setcancleApp] = useState(false);
  const [cancleConfirm, setcancleConfirm] = useState(false);
  const [reqCancle, setreqCancle] = useState(false);
  const [conDelete, setconDelete] = useState(false);

  //Review
  const [feedback, setFeedback] = useState<string>("");
  const [stars, setStars] = useState<number>(0);

  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);

  //Popup State
  const [hostNotice, sethostNotice] = useState(false);
  const [cancleHosting, setCancleHosting] = useState(false);
  const [reviewPopup, setReviewPopup] = useState(false);
  const [reviewNot, setreviewNot] = useState(false);

  const history = useHistory();
  const params = QueryString.parse(history.location.search);

  const [userHostList, setUserHostList] = useState<any>();
  const [participantList, setParticipantList] = useState<any[]>([]);
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // buttons states
  const [checkJoinButton, setCheckJoinButton] = useState(false);
  const [checkCancleBox, setCheckCancleBox] = useState(false);
  const [checkHostingCancle, setCheckHostingCancle] = useState(false);
  const [checkDeclined, setCheckDeclined] = useState(false);
  const [applicationAccepted, setApplicationAccepted] = useState(false);
  const [standBy, setStandBy] = useState(false);
  const [checkReviewButton, setCheckReviewButton] = useState(false);
  const [hostingCom, SethostingCom] = useState(false);
  const [comHostNotice, SetcomHostNotice] = useState(false);
  const [isHostingCompleted, setIsHostingCompleted] = useState(false);
  const [isReviewSubmited, setIsReviewSubmited] = useState(false);

  const reqdelBtn = () => {
    setreqCancle(false);
    setconDelete(true);

    ApiPost(`hosting/participate/${userHostList.id}`, {}).then((ress: any) => {
      getHosting();
      setCheckCancleBox(false);
    });
  }

  //For Translation
  const { t } = useTranslation();

  // handlers
  const getHosting = () => {
    ApiGet(`hosting/host-itinerary/${params.id}`).then((res: any) => {
      const data = props.isCompas ? res?.data?.find((x: any) =>
        x.id === props.isCompas
      ) : res.data[0]
      setIsLiked(data?.user.like)
      setUserHostList(data);
      getParticipants(data?.id);
      {
        if (res.data[0]?.status === "COMPLETED") {
          setIsHostingCompleted(true);
          setCheckReviewButton(true);
        }
      }
    });
  };

  const setapplyBtn = () => {
    setjoinHost(false);
    setappApply(true);
  };

  const ReviewSubBtn = () => {
    setReviewPopup(false);
    setreviewNot(true);
  };

  const cancleConfirmBtn = () => {
    setcancleApp(false);
    setcancleConfirm(true);

    ApiPost(`hosting/participate/${userHostList.id}`, {}).then((ress: any) => {
      getHosting();
      setCheckCancleBox(false);
    });
  };

  const getParticipants = (id: string) => {
    ApiGet(`hosting/accept-participants/${id}`).then((res: any) => {
      setParticipantList(res.data.participants);
      setIsReviewSubmited(res.data.is_reviewed);
    });
  };

  const sendApplication = () => {
    ApiPost(`hosting/participate/${userHostList.id}`, {}).then((ress: any) => {
      setCheckCancleBox(true);
    });
  };

  const handleJoinHosting = () => {
    sendApplication();
    setapplyBtn();
  };

  const SethostingComBtn = () => {
    SethostingCom(false);
    SetcomHostNotice(true);
  }

  const cancleHostingFunction = () => {
    setCancleHosting(false);
    ApiPut(`hosting/cancelHosting/${userHostList.id}`, {}).then((res: any) => {
      sethostNotice(true);
    });
  }


  //Complete Hosting
  const completeHosting = () => {
    ApiPut(`hosting/completeHosting/${userHostList.id}`, {})
      .then((res: any) => {
        SethostingComBtn();
        setIsHostingCompleted(true);
        setCheckReviewButton(true);
        props.setIsHostingCompleted(true);
        // props.setRefreshPax(Math.random());
      })
  }

  //Send Review
  const sendReviews = () => {

    ApiPost('hosting/makeReview',
      {
        star: stars,
        content: feedback,
        hosting_id: userHostList.id
      })
      .then((res: any) => {
        setIsReviewSubmited(true);
        ReviewSubBtn();
        props.setRefreshReview(Math.random());
      })
  }

  //Like functonality
  const [delayLike, setDelayLike] = useState(false);

  const Like = (id: string) => {

    setIsLiked(!isLiked);
    setDelayLike(true);

    ApiPost(`user/wishlist/${id}`, {})
      .then((res: any) => {
        // console.log("Liked", res);
        setDelayLike(false);
      })
  };


  //Checking for hosting completion
  const checkIsComplete = (date: string, endTime: string) => {
    let time = moment(moment(date).format("YYYY:MM:DD") + " " + endTime, "YYYY:MM:DD HH:mm");
    return (time.toDate() < moment(new Date, "YYYY:MM:DD HH:mm").toDate())
  }


  // Effects
  useEffect(() => {
    getHosting();
  }, [props.refresh]);

  useEffect(() => {
    if (userHostList) {
      if (userData && userHostList.user.id === userData.id) {
        setCheckHostingCancle(true);
      }
      else {
        userData && is_loggedin && ApiGet(`hosting/isrequested-participants/${userHostList.id}`).then(
          (res: any) => {
            if (res.data) {
              if (res.data.status === "DECLINED") {
                setCheckDeclined(true);
              }
              else {
                setCheckCancleBox(true);
              }
              setApplicationAccepted(res.data.status === "ACCEPTED");
              setStandBy(res.data.status === "STAND_BY");
            }
            else {
              setCheckJoinButton(true)
            }
          }
        );
        setCheckJoinButton(true)
      }
    }
  }, [userHostList, userData]);

  useEffect(() => {
    handleButtons();
  }, [checkDeclined, checkCancleBox, checkHostingCancle, userHostList])


  // Create a chat
  const dispatch = useDispatch();
  const { chatData, message_open } = useSelector((state: RootStateOrAny) => state.chatData);
  const createChat = async (
    current_user: CurrentUser,
    other_user: OtherUser
  ) => {
    let doc_id: string;
    if (!current_user.id && !other_user.id && current_user.id === other_user.id) {
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


  // component helper functions
  const hostDetails = () => (
    <div className="host d-flex">
      <div>
        <img src={userHostList.user.avatar || "./img/Avatar.png"} alt=""/>
      </div>
      <div className="ml-20">
        <div className="d-flex">
          <div className="d-flex img-join-host h-36 ">
            <h5 className="font-20-bold color-dark mr-18">
              {(userHostList.user.user_name).length < 9 ? userHostList.user.user_name : (userHostList.user.user_name).slice(0, 9) + "..."}
            </h5>
            <img src={checkImageURL(userHostList.user.nationality)} alt="flag" />
          </div>

          <div className="d-flex join-pro ml-auto">
            {userHostList?.user?.id !== userData.id && <div className="join-msg ">
              <img src="./img/msg.svg" alt="" onClick={() => {
                createChat(
                  {
                    id: userData.id,
                    name: userData.user_name,
                    profile_url: userData.avatar,
                  },
                  {
                    id: userHostList?.user.id,
                    name: userHostList?.user.user_name,
                    profile_url: userHostList?.user.avatar,
                  }
                )
              }} />
            </div>}
            <div className="tout-created ml-auto">
              <div className="download-heart-icon button">
                <div className="heart-div">
                  <input type="checkbox" checked={isLiked}
                    disabled={delayLike}
                    onClick={() => is_loggedin && Like(userHostList?.user.id)} id="id" className="instruments" />
                  <label htmlFor="id" className="text-white check mb-0">
                    {!isLiked && <img src="./img/Favourite.png" alt=""/>}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="host-info mt-14">
          <div
            className={
              userHostList.type === "Local"
                ? "local-host-bg hots-tags"
                : "travel-host-bg hots-tags"
            }
          >
            <p className="info">{userHostList.type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
          </div>
          <div className="hots-tags">
            <p className="info">{userHostList.user.gender === "MALE" ? t("Male") : t("Female")}</p>
          </div>
          <div className="hots-tags">
            <p className="info">{userHostList.user.age_group}{t("Age_Groups")}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const joinButton = () => (
    <div className="">
      {/* <Button
        className="hosts-btn mt-15 p-0"
        onClick={() => {
          // applicationAccepted ?
          is_loggedin && setReviewPopup(true);
        }}
      >
        {t("Host_Details.Write_Review")}
      </Button> */}
      <Button
        className="hosts-btn p-0"
        onClick={() => {
          is_loggedin && setjoinHost(true);
        }}
      >
        {t("Host_Details.Join")}
      </Button>
    </div>
  );

  const completeHostingBtn = () => (
    <>
      <div className="">
        <Button
          className="cancle-my-host p-0"
          onClick={() => {
            is_loggedin && setCancleHosting(true);
          }}
        >
          {t("Host_Details.Cancel_Btn.P1")} <br /> {t("Host_Details.Cancel_Btn.P2")}
        </Button>
      </div>
      <div className="">
        {checkIsComplete(userHostList.date, userHostList.end_time) && participantList.length !== 0
          ?
          <Button
            className="comp-my-host-blue p-0"
            // disabled={checkIsComplete(userHostList.date, userHostList.end_time)}
            onClick={() => {
              is_loggedin && SethostingCom(true);
            }}
          >
            {t("Host_Details.Hosting_Complete.P1")} <br /> {t("Host_Details.Hosting_Complete.P2")}
          </Button>
          :
          <Button
            className="comp-my-host p-0"
            disabled={checkIsComplete(userHostList.date, userHostList.end_time)}
          >
            {t("Host_Details.Hosting_Complete.P1")} <br /> {t("Host_Details.Hosting_Complete.P2")}
          </Button>
        }
      </div>
    </>
  )


  const cancleHostingButton = () => (
    <div className="d-flex mt-40 mb-40">

      {isHostingCompleted
        ?
        <>
          <div className="single-host-appstatus mt-40">
            <label className=" p-0">{t("Host_Details.Hosting_Completed")}</label>
          </div>

        </>
        :
        completeHostingBtn()
      }
    </div>
  );

  const cancleApplicationButton = () => (
    <>
      {
        checkReviewButton
          ?
          reviewButton()
          :
          <>
            <div className="single-host-appstatus mt-40">
              <label className=" p-0">{applicationAccepted ? t("Host_Details.Application_Accepted") : t("Host_Details.Application_Sent")}</label>
            </div>

            <div className="">
              <Button
                className="hosts-btn mt-15 p-0"
                onClick={() => {
                  // applicationAccepted ?
                  is_loggedin && (applicationAccepted ? setreqCancle(true) : setcancleApp(true))
                }}
              >
                {t("Host_Details.Cancel_My_Application")}
              </Button>
            </div>
          </>
      }
    </>
  );

  const showParticipants = () => (
    <div className="info-joinhost pax-host-list mt-30">
      <div className="mt-30">
        <p className="font-16-bold">{t("Host_Own.pax1")}
          <span className={(userHostList.participate_count === userHostList.pax) ? "orange-font" : "blue-font"}> {userHostList.participate_count}{t("Host_Own.pax3")}</span>/
          {userHostList.pax}{t("Host_Own.pax3")} {t("Host_Own.pax2")}
        </p>
      </div>
      {participantList.map((participant: any) => (
        <div className=" mt-20 host-info ">
          <div className="d-flex align-items-center w-380px">
            <img src={participant.user.avatar || "./img/Avatar.png"} className="pax-img" alt=""/>
            <h5 className="font-20-bold color-dark mr-9 ml-30">
              {(participant.user.user_name).length >= 8 ? (participant.user.user_name).slice(0, 8) + ".." : participant.user.user_name}
            </h5>
            <img src={checkImageURL(participant.user.nationality)} alt="flag" className="round-flags" />
            <div className="d-flex ml-auto">
              <div className="hots-tags ml-10 mr-10 w-60">
                <p className="info mb-0 h-24">{participant.user.gender === "MALE" ? t("Male") : t("Female")}</p>
              </div>
              <div className="hots-tags w-60 mr-0">
                <p className="info mb-0">{participant.user.age_group}{t("Age_Groups")}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const emptyParticipant = () => (
    <div className="info-joinhost pax-host-list mt-30">
      <div className="mt-30">
        <p className="font-16-bold">{t("Host_Own.pax1")} 0{t("Host_Own.pax3")}/{userHostList.pax}{t("Host_Own.pax3")} {t("Host_Own.pax2")}</p>
      </div>

      <p className="font-18-normal text-center color-darkgray mt-60 mb-60">
        {t("Empty_Participates.Text")}
      </p>
    </div>
  );

  const showHostingData = () => (
    <>
      <div className="info-joinhost">
        <div className="d-flex mt-30">
          <p className="font-16-normal color-darkgray h-26">{t("Host_Details.Date&Time")}</p>
          <p className="ml-auto font-16-bold color-dark h-26">
            {userHostList.date.replaceAll("-", ".")}{" "}
            {userHostList.start_time.slice(0, 5)}
            {" - "}
            {userHostList.end_time.slice(0, 5)}
          </p>
        </div>
        <div className="d-flex mt-20">
          <p className="font-16-normal color-darkgray h-26">{t("Host_Details.Starts_At")}</p>
          <p className="ml-auto font-16-bold color-dark h-26">
            {userHostList.location}
          </p>
        </div>
        <div className="d-flex mt-18">
          <p className="font-16-normal color-darkgray h-26">{t("Host_Details.Transportation")}</p>
          <p className="ml-auto font-16-bold color-dark h-26">
            {AuthStorage.getLang() === "ko" ? transporTation(userHostList.transportation) : userHostList.transportation}
          </p>
        </div>
      </div>
      <div className="info-joinhost  mt-30">
        <p className="font-18-normal color-black mt-30 ">
          {userHostList.host_information}
        </p>
      </div>
    </>
  );

  const applicationClosed = () => (
    <div className="single-host-appstatus mt-40">
      <label className=" p-0">{t("Host_Details.Closed")}</label>
    </div>
  );

  const applicationDeclined = () => (
    <>
      <div className="single-host-appstatus mt-40">
        <label className=" p-0">{t("Host_Details.Rejected_By_Host")}</label>
      </div>

      <div className="single-host-appstatus mb-40 mt-16">
        <label className=" p-0">{t("Host_Details.Cancle_Request")}</label>
      </div>
    </>
  );

  //Review Popup
  const reviewButton = () => (
    <>
      {(!standBy)
        ?
        <>
          <div className="single-host-appstatus mt-40">
            <label className=" p-0" >{t("Host_Details.Hosting_Completed")}</label>
          </div>

          <div className="">
            {isReviewSubmited
              ?
              <div className="single-host-appstatus mt-15">
                <label className=" p-0">{t("Host_Details.Review_Submitted")}</label>
              </div>
              :
              <Button
                className="hosts-btn mt-15 p-0"
                onClick={() => {
                  // applicationAccepted ?
                  is_loggedin && setReviewPopup(true);
                }}
              >
                {t("Host_Details.Write_Review")}
              </Button>}
          </div>
        </>
        :
        <div className="single-host-appstatus mt-40 mb-29">
          <label className=" p-0">{t("Host_Details.Closed")}</label>
        </div>
      }
    </>
  )



  const handleButtons = () => {
    if (checkDeclined) {
      return applicationDeclined();
    }
    if (checkCancleBox) {
      return cancleApplicationButton();
    }
    if (checkHostingCancle) {
      return cancleHostingButton();
    }
    if (userHostList?.participate_count === userHostList?.pax) {
      return applicationClosed();
    }
    if (checkJoinButton) {
      if ((userHostList && userHostList.participate_count === userHostList.pax) || checkIsComplete(userHostList?.date, userHostList?.end_time)) {
        return applicationClosed()
      }
      return joinButton();
    }
    if (checkReviewButton) {
      return reviewButton()
    }
  };

  return (
    <>
      <div className="host-list-card">
        {userHostList && (
          <div className="">
            <div className="host-listuser">
              <div className="p-0 ">
                {hostDetails()}
                {handleButtons()}
              </div>
              {showHostingData()}
              {userHostList.participate_count
                ? showParticipants()
                : emptyParticipant()}
            </div>
          </div>
        )}
      </div>


      {/* Join Hosting Popup */}
      <Modal
        show={joinHost}
        onHide={() => {
          setjoinHost(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Join_Popup.Join")}</h3>
          </div>

          <div className="mt-50 welcome-content welcome-body">
            <p className="">
              {t("Join_Popup.Text1")}
              <br />
              {t("Join_Popup.Text2")}
            </p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-60">
          <div className="">
            <Buttons
              ButtonStyle="join-cancle-btn"
              onClick={() => {
                setjoinHost(false);
              }}
            >{t("Join_Popup.Cancel")}
            </Buttons>
          </div>

          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => {
                handleJoinHosting();
              }}
            >
              {t("Join_Popup.Apply")}
            </Buttons>
          </div>
        </div>
      </Modal>


      {/* Application Sent Popup */}
      <Modal
        show={appApply}
        onHide={() => {
          setappApply(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Application_Sent.Application_Sent")}</h3>
          </div>
          <div className="mt-60 app-body">
            <p>
              {t("Application_Sent.Text1")}<br />
              {t("Application_Sent.Text2")} <br />
              {t("Application_Sent.Text3")}
            </p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                setappApply(false);
              }}
            >
              {t("Application_Sent.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>


      {/* Cancel Application Popup */}
      <Modal
        show={cancleApp}
        onHide={() => {
          setcancleApp(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Application.Cancel_Application")}</h3>
          </div>
          <div className="welcome-content cancle-body-app mt-60">
            <p className="h-60">
              {t("Cancel_Application.Question")}
            </p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-50">
          <div className="">
            <Buttons
              ButtonStyle="join-cancle-btn"
              onClick={() => {
                setcancleApp(false);
              }}
            >
              {t("Cancel_Application.Cancel")}
            </Buttons>
          </div>

          <div className="">
            <Buttons
              ButtonStyle="join-apply-btn"
              onClick={() => {
                cancleConfirmBtn();
              }}
            >
              {t("Cancel_Application.Confirm")}
            </Buttons>
          </div>
        </div>
      </Modal>

      {/* Cancel Application Notice Popup */}
      <Modal
        show={cancleConfirm}
        onHide={() => {
          setcancleConfirm(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Application.Cancel_Application")}</h3>
          </div>
          <div className="welcome-content cancle-body-app mt-60 text-center">
            <p className="h-60 font-20-normal">{t("Cancel_Application.Confirm_Statement")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons
              ButtonStyle="app-sent-ok"
              onClick={() => {
                setcancleConfirm(false);
              }}
            >
              {t("Cancel_Application.OK")}
            </Buttons>
          </div>
        </div>
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
            <h3 className="font-20-normal color-black">{t("Cancel_Hosting_Popup.Question")}</h3>
            <p className="font-18-normal color-darkgray mt-34">{t("Cancel_Hosting_Popup.Text")}</p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-40">
          <div className="">
            <Buttons ButtonStyle="join-cancle-btn" onClick={() => { setCancleHosting(false) }}>
              {t("Cancel_Hosting_Popup.Cancel")}
            </Buttons>
          </div>
          <div className="">
            <Buttons ButtonStyle="join-apply-btn" onClick={() => cancleHostingFunction()}>
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
        <Modal.Header className="p-0">

        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Hosting_Popup.Notice.Title")}</h3>
          </div>
          <div className="welcome-content welcome-body">

            <p className="h-60">{t("Cancel_Hosting_Popup.Notice.Body")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="">
            <Buttons ButtonStyle="app-sent-ok w-100" onClick={() => { sethostNotice(false); history.push('/'); }}>
              {t("Cancel_Hosting_Popup.Notice.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>


      {/* Cancel Accepted Application Popup  */}

      <Modal
        show={reqCancle}
        onHide={() => {
          setreqCancle(false);
        }}
        dialogClassName="welcome-modal del-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-36">{t("Cancel_Accepted.Title")}</h3>
          </div>
          <div className="">
            <p className="font-24-normal h-36 color-black mt-36 text-center">{t("Cancel_Accepted.Body")}</p>

          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-40">
          <div className="">

            <Buttons ButtonStyle="join-cancle-btn" onClick={() => { setreqCancle(false) }}>
              {t("Cancel_Accepted.Cancel")}
            </Buttons>


          </div>

          <div className="">

            <Buttons ButtonStyle="join-apply-btn" onClick={() => { reqdelBtn() }}>
              {t("Cancel_Accepted.Continue")}
            </Buttons>

          </div>

        </div>
      </Modal>

      {/* Cancel Accepted Application Notice Popup */}

      <Modal
        show={conDelete}
        onHide={() => {
          setconDelete(false);
        }}
        dialogClassName="welcome-modal del-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-36">{t("Cancel_Accepted_Success.Title")}</h3>
          </div>
          <div className="">
            <p className="font-24-normal h-36 color-black mt-36 text-center">{t("Cancel_Accepted_Success.Body")}</p>

          </div>
        </Modal.Body>
        <div className="w-100 mt-40">
          <div className="j-content-center d-flex">
            <Buttons ButtonStyle="app-sent-ok w-240" onClick={() => { setconDelete(false); }}>
              {t("Cancel_Accepted_Success.Continue")}
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
            <p className="text-center font-18-normal color-darkgray h-27">{t("Hosting_Complete.Text")}</p>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-50">
          <div className="">
            <Buttons ButtonStyle="join-cancle-btn" onClick={() => SethostingCom(false)}>
              {t("Hosting_Complete.Cancel")}
            </Buttons>
          </div>
          <div className="">
            <Buttons ButtonStyle="join-apply-btn" onClick={() => completeHosting()}>
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
        <Modal.Header className="p-0">

        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title h-34">
            <h3>{t("Hosting_Complete.Notice.Title")}</h3>
          </div>
          <div className="yes-notice mt-60">

            <p className="font-17-normal">{t("Hosting_Complete.Notice.Body")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons ButtonStyle="app-sent-ok" onClick={() => { SetcomHostNotice(false); }}>
              {t("Hosting_Complete.Notice.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>


      {/* Review Popup */}
      <Modal
        show={reviewPopup}
        onHide={() => {
          setReviewPopup(false);
        }}
        dialogClassName="welcome-modal reviewstar-popup"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0" closeButton></Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-34">{t("Review_Popup.Title")}</h3>
          </div>
          <div className="review-body mt-43">
            <p className="font-20-normal color-darkgray">{t("Review_Popup.Body")}</p>
          </div>
          <div className="text-center mt-37">
            <Rating
              emptySymbol={
                <img src="./img/blankstar.svg" className="start-rat" alt=""/>
              }
              fullSymbol={<img src="./img/star.svg" className="start-rat" alt=""/>}
              initialRating={stars}
              onChange={(e: any) => {
                setStars(e);
              }}
              stop={5}
            />

            <InputField
              label=""
              fromrowStyleclass=""
              name="introduction"
              value={feedback}
              maxLength={2000}
              placeholder={t("Review_Popup.Write_Review")}
              type="textarea"
              InputstyleClass="mt-37 write-review-area"
              lablestyleClass="font-30-bold h-40 color-dark mt-80"
              onChange={(e: any) => { setFeedback(e.target.value) }}
            />
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-35">
          <div className="">

            <Buttons ButtonStyle="join-cancle-btn" onClick={() => { setReviewPopup(false) }}>
              {t("Review_Popup.Cancel")}
            </Buttons>

          </div>

          <div className="">

            <Buttons ButtonStyle="join-apply-btn" onClick={() => { sendReviews(); }}>
              {t("Review_Popup.Submit")}
            </Buttons>

          </div>

        </div>
      </Modal>


      {/* Review Notice Popup */}
      <Modal
        show={reviewNot}
        onHide={() => {
          setreviewNot(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="p-0">

        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Review_Notice.Title")}</h3>
          </div>
          <div className="accept-notice-review mt-60">
            <p className="font-24-normal color-darkgray h-60">{t("Review_Notice.Body")}</p>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="d-flex j-content-center">
            <Buttons ButtonStyle="app-sent-ok" onClick={() => { setreviewNot(false); }}>
              {t("Review_Notice.OK")}
            </Buttons>
          </div>
        </div>
      </Modal>

    </>
  );
}

export default UserHostList;
