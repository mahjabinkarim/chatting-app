import React, { useState } from "react";
import Chatlist from "../../components/chatlist/Chatlist";
import Chatbox from "../../components/chatbox/Chatbox";



const Chat = () => {
  const [showChatList, setShowChatList] = useState(true);

  return (
    <div className="flex h-screen">
      {showChatList && <Chatlist toggleChatList={() => setShowChatList(false)} />}
      <Chatbox />
    </div>
  );
};

export default Chat;
