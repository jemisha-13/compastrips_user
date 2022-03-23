import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Buttons from '../../components/Buttons';
import { ApiGet, ApiPut } from '../../helper/API/ApiData';
import { checkImageURL } from '../../helper/utils';
import firebase from "firebase";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setChatId, setMessageState, setOtherUserData } from '../../redux/actions/chatDataAction';
import { db } from '../../firebaseConfig';

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
interface user {
    age_group: string;
    avatar: string;
    dob: string;
    first_name: string;
    flag: string;
    gender: string;
    id: string;
    last_name: string;
    nationality: string;
    user_name: string;
}

interface hosting {
    participate_count: number;
    pax: number;
}

interface participanData {
    id: string;
    req_status: string;
    requested_at: string;
    hosting: hosting;
    user: user;
}

interface apiRes {
    participants: participanData[];
    participate_count: number;
    pax: number;
}

const ApplicationPax = (props: any) => {

    const { t } = useTranslation();

    const [acceptApp, SetAcceptApp] = useState(false);
    const [acceptAppNotice, SetAcceptAppNotice] = useState(false);
    const [declineApp, SetDeclinetApp] = useState(false);
    const [declineAppNotice, SetDeclineAppNotice] = useState(false);
    const [activeTab, setActiveTab] = useState("STAND_BY");
    const [participantData, setParticipantData] = useState<apiRes>({
        participants: [],
        participate_count: 0,
        pax: 0
    });
    const [id, setId] = useState("");
    const [participantID, setParticipantID] = useState<user>({
        age_group: "",
        avatar: "",
        dob: "",
        first_name: "",
        flag: "",
        gender: "",
        id: "",
        last_name: "",
        nationality: "",
        user_name: ""
    });
    const [refresh, setRefresh] = useState(false)

    const searchTab = (tab: string) => {
        setActiveTab(tab);
    }

    const getParticipants = () => {
        if (props.hostingID) {
            ApiGet(`hosting/participants/${props?.hostingID}`)
                .then((res: any) => {
                    setParticipantData(res.data);
                }
                )
        }
    }

    useEffect(() => {
        getParticipants();
    }, [activeTab, refresh, props])


    const acceptReq = (id: string) => {
        ApiPut(`hosting/acceptParticipant/${id}`, {})
            .then((res: any) => {
                SetAcceptAppBtn();
                setRefresh(!refresh);

            })

    }

    const declineReq = (id: string) => {
        ApiPut(`hosting/declineParticipant/${id}`, {})
            .then((res: any) => {
                SetDeclineAppNoticeBtn();
                setRefresh(!refresh);
                props.setRefresh(Math.random());
            })
    }

    const SetAcceptAppBtn = () => {
        SetAcceptApp(false);
        SetAcceptAppNotice(true);
    }

    const SetDeclineAppNoticeBtn = () => {
        SetDeclinetApp(false);
        SetDeclineAppNotice(true);
    }


    // Create a chat
    const dispatch = useDispatch();
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
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


    const reqParticipants = () => {
        const filteredParticipants = participantData.participants.filter((x) => x.req_status === activeTab)

        return filteredParticipants.length ?

            (filteredParticipants.map((data, i) =>
                <div className="d-flex chat-accept-decline-sec">
                    <div className="host d-flex  align-items-center">
                        <div>
                            <img src={data.user.avatar || "./img/Avatar.png"} alt=""/>
                        </div>
                        <div className="ml-20">
                            <div className="d-flex img-join-host h-36">
                                <h5 className="font-20-bold color-dark mr-18">{data.user.user_name}</h5>
                                <img src={checkImageURL(data.user.nationality)} alt="flag" />
                            </div>
                            <div className="host-info mt-14">
                                <div className="hots-tags">
                                    <p className="info">{data.user.gender === "MALE" ? t("Male") : t("Female")}</p>
                                </div>
                                <div className="hots-tags">
                                    <p className="info">{data.user.age_group}{t("Age_Groups")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center ml-auto">
                        <div className="mr-48">
                            <p className="font-18-normal color-dark">{t("Pax_Applications.Applied")} : {moment(data.requested_at).format("YYYY.MM.DD")}</p>
                        </div>
                        <div className="mr-70">
                            <p className="font-18-normal color-dark">{t("Pax_Applications.Status")} {data.req_status === "STAND_BY" ? `${t("Pax_Applications.Standing")}` : (data.req_status === "ACCEPTED" ? `${t("Pax_Applications.Accepted")}` : `${t("Pax_Applications.Declined")}`)}</p>
                        </div>
                        <div>
                            <Buttons
                                ButtonStyle="chat-btn mr-15"
                                onClick={() => {
                                    createChat(
                                        {
                                            id: userData.id,
                                            name: userData.user_name,
                                            profile_url: userData.avatar,
                                        },
                                        {
                                            id: data?.user.id,
                                            name: data?.user.user_name,
                                            profile_url: data?.user.avatar,
                                        }
                                    )
                                }}>
                                {t("Pax_Applications.Chat")}
                            </Buttons>

                            {(data.req_status === "STAND_BY") ? <Buttons
                                ButtonStyle="chat-btn-border mr-15"
                                onClick={() => {
                                    setId(data.id);
                                    setParticipantID(data.user);
                                    SetAcceptApp(true);
                                }}>
                                {t("Pax_Applications.Accept")}
                            </Buttons> : ""}

                            {(data.req_status === "STAND_BY") ? <Buttons
                                ButtonStyle="chat-btn-border-danger"
                                onClick={() => {
                                    setId(data.id);
                                    setParticipantID(data.user);
                                    SetDeclinetApp(true);
                                }}>
                                {t("Pax_Applications.Decline")}
                            </Buttons> : ""}
                        </div>
                    </div>
                </div>

            )
            ) :
            (<div className="h-423 ">
                <div className="font-22-normal text-center">
                    {t("Pax_Applications.No_Application")}
                </div>
            </div>)
    }

    return (
        <>
            <div className="main-container">
                <div className="main-app-box mt-80">
                    <div>
                        <h4 className="font-30-bold color-dark h-45">{t("Pax_Applications.Applications")}  ({t("Pax_Applications.Pax1")}{participantData.pax} {t("Pax_Applications.Pax2")} | {t("Pax_Applications.Vacancies1")}{participantData.pax - participantData.participate_count} {t("Pax_Applications.Vacancies2")})    </h4>
                    </div>
                    <div className="details-tabs mt-23 mb-40 h-36">

                        {
                            <>
                                <span className={activeTab === 'STAND_BY' ? "active font-24-bold cursor-p" : "font-24-bold cursor-p"} onClick={() => { searchTab('STAND_BY') }}>
                                    {t("Pax_Applications.Standing")} ({participantData?.participants?.filter((x) => x.req_status === "STAND_BY").length})
                                </span> <span className="font-26 color-gray"> | </span></>
                        }

                        {<>
                            <span className={activeTab === 'ACCEPTED' ? "active font-24-bold cursor-p" : "font-24-bold cursor-p"} onClick={() => { searchTab("ACCEPTED") }}>
                                {t("Pax_Applications.Accepted")} ({participantData?.participants?.filter((x) => x.req_status === "ACCEPTED").length})
                            </span>  <span className="font-26 color-gray"> | </span>
                        </>}


                        <span className={activeTab === 'DECLINED' ? "active font-24-bold cursor-p" : "font-24-bold cursor-p"} onClick={() => { searchTab("DECLINED") }}> {t("Pax_Applications.Declined")} ({participantData?.participants?.filter((x) => x.req_status === "DECLINED").length})</span>
                    </div>
                    <div className="line"></div>
                    <div className="mb-111">
                        {!participantData?.participants?.length
                            ?
                            <div className="h-423 ">
                                <div className="font-22-normal text-center">
                                    {t("Pax_Applications.No_Application")}
                                </div>
                            </div>
                            :
                            <>
                                {reqParticipants()}
                            </>
                        }
                    </div>
                </div>

            </div>


            <Modal
                show={acceptApp}
                onHide={() => {
                    SetAcceptApp(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3>{t("Application_pax.Accept_Popup.Title")}</h3>
                    </div>
                    <div className=" app-accept-body mt-60">
                        <p className="text-center">{t("Application_pax.Accept_Popup.Body1")} {participantID.user_name} {t("Application_pax.Accept_Popup.Body2")}</p>
                    </div>
                </Modal.Body>
                <div className="d-flex justify-content-between mt-40">
                    <div className="">
                        <Buttons ButtonStyle="join-cancle-btn" onClick={() => SetAcceptApp(false)}>
                            {t("Application_pax.Accept_Popup.Cancel")}
                        </Buttons>


                    </div>

                    <div className="">

                        <Buttons ButtonStyle="join-apply-btn" onClick={() => acceptReq(id)}>
                            {t("Application_pax.Accept_Popup.Accept")}
                        </Buttons>

                    </div>

                </div>
            </Modal>

            <Modal
                show={acceptAppNotice}
                onHide={() => {
                    SetAcceptAppNotice(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="p-0">

                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3>{t("Application_pax.Accept_Notice.Title")}</h3>
                    </div>
                    <div className="accept-notice mt-60">

                        <p className="">{t("Application_pax.Accept_Notice.Body1")}{participantID.user_name}{t("Application_pax.Accept_Notice.Body2")}</p>
                    </div>
                </Modal.Body>
                <div className="w-100 mt-50">
                    <div className="d-flex j-content-center">
                        <Buttons ButtonStyle="app-sent-ok" onClick={() => { props.setRefresh(Math.random()); SetAcceptAppNotice(false); }}>
                            {t("Application_pax.Accept_Notice.OK")}
                        </Buttons>
                    </div>
                </div>
            </Modal>


            <Modal
                show={declineApp}
                onHide={() => {
                    SetDeclinetApp(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3>{t("Application_pax.Decline_Popup.Title")}</h3>
                    </div>
                    <div className=" app-accept-body mt-60">
                        <p className="text-center">{t("Application_pax.Decline_Popup.Body1")} {participantID.user_name}{t("Application_pax.Decline_Popup.Body2")}</p>
                    </div>
                </Modal.Body>
                <div className="d-flex justify-content-between mt-40">
                    <div className="">
                        <Buttons ButtonStyle="join-cancle-btn" onClick={() => SetDeclinetApp(false)}>
                            {t("Application_pax.Decline_Popup.Cancel")}
                        </Buttons>


                    </div>

                    <div className="">

                        <Buttons ButtonStyle="join-apply-btn" onClick={() => declineReq(id)}>
                            {t("Application_pax.Decline_Popup.Decline")}
                        </Buttons>

                    </div>

                </div>
            </Modal>


            <Modal
                show={declineAppNotice}
                onHide={() => {
                    SetDeclineAppNotice(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="p-0">

                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3>{t("Application_pax.Decline_Notice.Title")}</h3>
                    </div>
                    <div className="accept-notice mt-60">

                        <p className="">{t("Application_pax.Decline_Notice.Body1")}{participantID.user_name}{t("Application_pax.Decline_Notice.Body2")}</p>
                    </div>
                </Modal.Body>
                <div className="w-100 mt-50">
                    <div className="d-flex j-content-center">
                        <Buttons ButtonStyle="app-sent-ok" onClick={() => { SetDeclineAppNotice(false); }}>
                            OK
                        </Buttons>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ApplicationPax
