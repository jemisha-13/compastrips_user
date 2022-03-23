import moment from "moment";
import React from "react";
import { Badge } from "react-bootstrap";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { dateFunction } from "../helper/utils";
import {
  setChatId,
  setChatState,
  setMessageState,
  setOtherUserData,
} from "../redux/actions/chatDataAction";

interface OtheUserData {
  name: string;
  avatar: string;
  id: string;
}

const Chat: React.FC<any> = ({ data, id }) => {
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);

  const user_id = data.ids.find((x: any) => x !== userData?.id);

  const d = dateFunction(
    moment(new Date(data?.timestamp?.toDate())).format("YYYY.MM.DD")
  );

  const otherUserData = {
    user_id,
    name: data[user_id]?.name,
    avatar: data[user_id]?.profile_url,
    time:
      d === "Today"
        ? moment(new Date(data?.timestamp?.toDate())).format("h:mm A")
        : d,
    lastMessage: data?.lastMessage,
    count: data[`${user_id}_count`],
  };

  const other_user_data: OtheUserData = {
    name: otherUserData.name,
    avatar: otherUserData.avatar,
    id: otherUserData.user_id,
  };

  const dispatch = useDispatch();

  return (
    <>
      <div
        className="modal-chat"
        onClick={() => {
          dispatch(setOtherUserData(other_user_data));
          dispatch(setChatId(id));
          dispatch(setMessageState(true));
          dispatch(setChatState(false));
        }}
      >
        <div className="modal-chat-left">
          <img src={otherUserData.avatar || "./img/Avatar.png"} alt="" />
        </div>
        <div className="modal-chat-center">
          <h3>{otherUserData.name}</h3>
          <p className="h-24 over-hide">{otherUserData.lastMessage.slice(0, 30)}{otherUserData.lastMessage.length > 30 ? '...' : ''}</p>
        </div>
        <div className="modal-chat-right">
          {otherUserData.count !== 0 && userData.notification ? (
            <Badge pill variant="danger">
              {otherUserData.count}
            </Badge>
          ) : null}
          <p>{otherUserData.time}</p>
        </div>
      </div>
    </>
  );
};

export default Chat;
