import React from 'react'
import { Modal } from "react-bootstrap";
import ReadMore from "../components/ReadMore";
import { useTranslation } from "react-i18next";
import { checkImageURL } from "../helper/utils";
import firebase from "firebase";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setChatId, setMessageState, setOtherUserData, } from "../redux/actions/chatDataAction";
import { ApiGet, ApiPost } from '../helper/API/ApiData';
import { hostingList } from '../pages/viewhost/ViewHostList';


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

interface props {
    hostingId?: string;
    show?: boolean;
    setShow?: any;
}

const HostPro: React.FC<props> = ({ hostingId, show, setShow }) => {
    const dispatch = useDispatch();
    const [hosting, setHosting] = useState<hostingList>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [delayLike, setDelayLike] = useState(false);

    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const { chatData, message_open } = useSelector(
        (state: RootStateOrAny) => state.chatData
    );

    useEffect(() => {
        if (hostingId)
            getHosting(hostingId);
    }, [hostingId])

    const Like = (id: string) => {
        setIsLiked(!isLiked);
        setDelayLike(true);
        ApiPost(`user/wishlist/${id}`, {})
            .then((res: any) => {
                setDelayLike(false);
                // console.log("Liked", res);
            })
            .catch((err: any) => {
                // console.log("Fail", err);
            });
    };

    const getHosting = (id: string) => {
        ApiGet(`hosting/hostByHostingId/${id}`).then((res: any) => {
            setHosting(res.data);
            setIsLiked(res.data.user.like);
            console.log("api Like", res.data.user.like);
        });
    };


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

    //for translation
    const { t } = useTranslation();

    const onmsgClick = () => {
        setShow(false);
        createChat(
            {
                id: userData.id,
                name: userData.user_name,
                profile_url: userData.avatar,
            },
            {
                id: hosting?.user.id ?? "",
                name: hosting?.user.user_name ?? "",
                profile_url: hosting?.user.avatar ?? "",
            },

        )
    }

    return (
        <div>
            <Modal
                show={show}
                onHide={() => {
                    setShow(false);
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

                    {hosting && (
                        <>
                            <div className="w-100 mt-33">
                                <div className="host d-flex">
                                    <div>
                                        <img src={hosting.user?.avatar || "./img/Avatar.png"} alt="" />
                                    </div>
                                    <div className="ml-20 w-100">
                                        <div className="d-flex">
                                            <div className="d-flex img-join-host h-36 ">
                                                <h5 className="font-20-bold color-dark mr-18">
                                                    {hosting.user?.user_name.length >= 36
                                                        ? hosting.user?.user_name.slice(0, 36) + ".."
                                                        : hosting.user?.user_name}
                                                </h5>
                                                <img src={checkImageURL(hosting.user?.flag)} alt="flag" />
                                            </div>

                                            <div className="d-flex join-pro ml-auto">
                                                {hosting?.user.id !== userData.id && <div className="join-msg " >
                                                    <img
                                                        src="./img/msg.svg" alt=""
                                                        onClick={() =>
                                                            onmsgClick()
                                                           
                                                        }
                                                    />
                                                </div>}
                                                <div className="tout-created ml-auto">
                                                    <div className="download-heart-icon button">
                                                        <div className="heart-div">
                                                            <input
                                                                type="checkbox"
                                                                id="id2"
                                                                checked={isLiked}
                                                                disabled={delayLike}
                                                                onClick={() => Like(hosting?.user.id)}
                                                                className="instruments"
                                                            />
                                                            <label
                                                                htmlFor="id2"
                                                                className="text-white check mb-0"
                                                            >
                                                                {!isLiked && <img src="./img/Favourite.png" alt="" />}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="host-info mt-14">
                                            <div
                                                className={
                                                    hosting.hosting.type === "Local"
                                                        ? "local-host-bg hots-tags"
                                                        : "travel-host-bg hots-tags"
                                                }
                                            >
                                                <p className="info">{hosting.hosting.type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
                                            </div>
                                            <div className="hots-tags">
                                                <p className="info">{hosting.user?.gender === "MALE" ? t("Male") : t("Female")}</p>
                                            </div>
                                            <div className="hots-tags">
                                                <p className="info">{hosting.user?.age}{t("Age_Groups")}</p>
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
                                        <img src={hosting.course.image} alt="" />
                                    </div>
                                    <div>
                                        <p className="font-20-bold color-black h-24">
                                            {" "}
                                            {hosting.itinerary.title}
                                        </p>
                                        <p className="font-16-normal color-darkgray h-22 mt-6">
                                            {" "}
                                            @ {hosting.itinerary.region} , {hosting.itinerary.country}
                                        </p>
                                        <p className="font-16-normal color-darkgray h-24 mt-10">
                                            ★ {hosting.review.star}｜{" "}
                                            {t("Host_Profile_Popup.Reviews1")}
                                            {hosting.review.review}
                                            {t("Host_Profile_Popup.Reviews2")}｜
                                            <span>
                                                <img src="./img/onlyheart.svg" alt="" />
                                            </span>{" "}
                                            {hosting.review.like}{" "}
                                        </p>
                                        <div className="mt-18">
                                            <h6 className="font-18-normal color-black ls-one">
                                                <ReadMore>
                                                    {hosting.course.courses.map((x: any, i: number) => {
                                                        return `${i + 1}. ${x} `;
                                                    })}
                                                </ReadMore>
                                            </h6>
                                            <p className="font-16-normal color-darkgray mt-10">
                                                {hosting.hosting.date.replaceAll("-", ".")}{" "}
                                                {hosting.hosting.start.slice(0, 5)}
                                                {" - "}
                                                {hosting.hosting.end.slice(0, 5)}
                                            </p>
                                            <h1 className="font-16-bold h-20 mt-20">
                                                {t("Host_Own.pax1")}
                                                <span className="blue-font">
                                                    {hosting.hosting.participate_count}
                                                    {t("Host_Own.pax3")}
                                                </span>
                                                /{hosting.hosting.pax}
                                                {t("Host_Own.pax3")} {t("Host_Own.pax2")}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default HostPro


