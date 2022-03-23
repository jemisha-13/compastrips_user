import React, { useEffect, useState } from "react";
import { Badge, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Buttons from "../../components/Buttons";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Chat from "../../components/Chat";
import { getChatData, setChatState } from "../../redux/actions/chatDataAction";
import PrivacyPolicy from "../../pages/Terms&Conditions/PrivacyPolicy";
import Terms from "../../pages/Terms&Conditions/Terms&Condition";
import Message from "../../components/Message";

const Footer: React.FC<any> = () => {
  const [TermsUse, setTermsUse] = useState(false);
  const [Privacypolicy, setPrivacypolicy] = useState(false);

  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
  const { chatData, count, chat_open, message_open, id, otherUser } =
    useSelector((state: RootStateOrAny) => state.chatData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData && userData.hasOwnProperty("id")) {
      dispatch(getChatData(userData?.id));
    }
  }, [userData]);

  const { t } = useTranslation();

  return (
    <>
      <Container fluid className="footer-bg">
        <div className="d-flex">
          <div>
            <img src="./img/Frame.png" alt="" />
          </div>
          <div>
            <div className="footer-link">
              <span
                onClick={() => {
                  setTermsUse(true);
                }}
              >
                {t("Footer.Terms_of_Use")}
              </span>
              <span
                onClick={() => {
                  setPrivacypolicy(true);
                }}
              >
                {t("Footer.Privacy_Policy")}
              </span>
              <Link to="/inquirtPage">{t("Footer.Inquiries")}</Link>
              <Link to="/customerService">{t("Footer.Customer_Service")}</Link>
            </div>
            <p className="footer-copyright">
              Copyright © Compas Interactive Inc. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </Container>
      <div className="Footer modal-footer p-0">
        {is_loggedin ? (
          <Buttons
            ButtonStyle="bg-transparent chat-widget"
            onClick={() => dispatch(setChatState(!chat_open))}
          >
            <img src="./img/chaticon.svg" alt="" />
            {count !== 0 && userData.notification ? (
              <Badge className="msg-badge" pill variant="danger">
                {count}
              </Badge>
            ) : null}
          </Buttons>
        ) : null}
      </div>
      {chat_open && (
        <div>
          <Modal show={chat_open} dialogClassName="allchatmodal">
            <Modal.Title className="modal-chat-title">
              <h4 className="font-25-bold h-34 color-dark">Chat</h4>
              <img
                src="./img/close-icon.svg"
                alt=""
                onClick={() => dispatch(setChatState(false))}
              />
            </Modal.Title>
            <Modal.Body className="p-0 mt-40">
              <div className="chat-scroll">
                {chatData.map((x: any) => {
                  if (x.data.lastMessage)
                    return <Chat data={x.data} id={x.id} />;
                })}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {message_open && <Message id={id} data={otherUser} />}
      <Terms set={setTermsUse} value={TermsUse} />
      <PrivacyPolicy set={setPrivacypolicy} value={Privacypolicy} />
    </>
  );
};

export default Footer;
