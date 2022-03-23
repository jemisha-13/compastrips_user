import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import firebase from "firebase";
import { db } from "../firebaseConfig";
import moment from "moment";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { setChatState, setMessageState } from "../redux/actions/chatDataAction";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";
import { dateFunction } from "../helper/utils";

const Message: React.FC<any> = ({ id, data }) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const { message_open } = useSelector(
    (state: RootStateOrAny) => state.chatData
  );

  const inputFocus = useRef<any>();
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);

  const dispatch = useDispatch();

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (text.trimStart().length) {
      try {
        let messageData = await db
          .collection("users")
          .doc(id)
          .collection("messages")
          .add({
            sendBy: userData.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            content: text,
          });

        if (messageData) {
          await db
            .collection("users")
            .doc(id)
            .update({
              [`${userData.id}_count`]:
                firebase.firestore.FieldValue.increment(1),
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              lastMessage: text,
            });
          setText("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getMessages = () => {
    const unsubscribe = db
      .collection("users")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(
        async (snapshot: { docChanges: () => any; docs: any[] }) => {
          let change = snapshot.docChanges();
          if (change && message_open) {
            try {
              await db
                .collection("users")
                .doc(id)
                .update({
                  [`${data.id}_count`]: 0,
                });
            } catch (error) { }
          }
          return setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        },
        (err: any) => {
          console.log("Error in getMessages: ", err);
        }
      );
    return unsubscribe;
  };

  const setCount = async () => {
    try {
      await db
        .collection("users")
        .doc(id)
        .update({
          [`${data.id}_count`]: 0,
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = getMessages();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setCount();
  }, [message_open]);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.scrollIntoView();
    }
  }, [messages]);

  const msgOnkeyUp = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      sendMessage(event)
    }
  }

  return (
    <div>
      <Modal show={message_open} dialogClassName="allchatmodal">
        <Modal.Title className="modal-chat-title">
          <div className="d-flex">
            {" "}
            <span
              onClick={() => {
                dispatch(setChatState(true));
                dispatch(setMessageState(false));
              }}
            >
              <img src="./img/backaroow-chat.svg" className="chatbackarrow" alt="back" />
            </span>{" "}
            <h4 className="font-25-bold color-dark h-34 ml-30">{data?.name}</h4>{" "}
          </div>
          <img
            src="./img/close-icon.svg"
            alt=""
            onClick={() => {
              dispatch(setMessageState(false));
            }}
          />
        </Modal.Title>
        <Modal.Body className="mt-40 p-0 chat-scroll-two">
          <div className="line"></div>
          {/* <div className="d-none">{id}</div> */}
          <div className="contentof-chat">
            {messages.map((x, i) => (
              <>
                {moment(
                  new Date(messages[i - 1]?.data?.timestamp?.toDate())
                ).format("YYYY.MM.DD") !==
                  moment(new Date(messages[i]?.data?.timestamp?.toDate())).format(
                    "YYYY.MM.DD"
                  ) ? (
                  <div className="text-center font-16-normal color-darkgray chat-date">
                    {dateFunction(
                      moment(
                        new Date(messages[i]?.data?.timestamp?.toDate())
                      ).format("YYYY.MM.DD")
                    )}
                  </div>
                ) : null}
                <div ref={messages.length - 1 === i ? inputFocus : null}>
                  {x.data.sendBy === data.id ? (
                    <div className="d-flex position-relative mt-20">
                      {messages[i - 1]?.data.sendBy !==
                        messages[i]?.data.sendBy && (
                          <div className="user-imgchat">
                            <img src={data?.avatar || "./img/Avatar.png"} alt="" />
                          </div>
                        )}
                      <div className="single-chat ml-82 w-100">
                        {messages[i - 1]?.data.sendBy !==
                          messages[i]?.data.sendBy && (
                            <h3 className="font-20-bold h-24 blue-font">
                              {data?.name}
                            </h3>
                          )}
                        <div className="d-flex a-flex-end">
                          <p className="mb-0 mt-21 content-of-msg-two">
                            {x.data.content}
                          </p>
                          <p className="font-12-normal white-space color-darkgray ml-30 custom-date-chat-two">
                            {moment(
                              new Date(x.data?.timestamp?.toDate())
                            ).format("YYYY.MM.DD HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex mt-20 position-relative">
                      <div className="single-chat  w-100">
                        <div className="d-flex a-flex-end j-flex-end">
                          <p className="font-12-normal color-darkgray white-space mr-30 custom-date-chat">
                            {moment(
                              new Date(x.data?.timestamp?.toDate())
                            ).format("YYYY.MM.DD HH:mm")}
                          </p>
                          <p className="mb-0 mt-21 content-of-msg ">
                            {x?.data.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="p-0 submit-complet">
          <div className="w-100  m-0">
            <div className="line"></div>
            <form
              className="submit-chat bg-white d-flex"
              onSubmit={sendMessage}
            >
              <div className="w-100">
                <TextareaAutosize
                  onKeyUp={msgOnkeyUp}
                  id="textArea"
                  rows={4}
                  maxRows={5}
                  placeholder={t("Chat.Enter_Message")}
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                />
              </div>
              <div className="ml-auto">
                <input type="submit" value="" />
              </div>
            </form>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Message;
