import { useEffect, useState } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { useSelector } from "react-redux";
import { FaPaperPlane } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const currentUser = useSelector((state) => state.userData.value);
  const selectedChatUser = useSelector((state) => state.selectedChatUser.value) || 
                           JSON.parse(localStorage.getItem("selectedChatUser"));

  useEffect(() => {
    if (!currentUser || !selectedChatUser) return;

    const db = getDatabase();
    const chatId = currentUser.uid < selectedChatUser.userId 
                   ? `${currentUser.uid}_${selectedChatUser.id}`
                   : `${selectedChatUser.id}_${currentUser.uid}`;
     console.log()
    const messagesRef = ref(db, `messages/${chatId}`);

    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messageList = Object.values(data);
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });
  }, [currentUser, selectedChatUser]);

  const sendMessage = () => {
    if (!message.trim() || !currentUser || !selectedChatUser) return;

    const db = getDatabase();
    const chatId = currentUser.uid < selectedChatUser.id 
                   ? `${currentUser.uid}_${selectedChatUser.id}`
                   : `${selectedChatUser.id}_${currentUser.uid}`;

    push(ref(db, `messages/${chatId}`), {
      senderId: currentUser.uid,
      receiverId: selectedChatUser.id,
      text: message,
      timestamp: Date.now(),
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="bg-gray-300 p-3 flex items-center gap-3">
        {selectedChatUser ? (
          <>
            <img src={selectedChatUser.userphoto} alt={selectedChatUser.username} className="w-10 h-10 rounded-full" />
            <h2 className="text-lg font-bold">{selectedChatUser.username}</h2>
          </>
        ) : (
          <h2 className="text-lg font-bold">Select a friend to chat</h2>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-100">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`p-2 mb-2 max-w-[60%] rounded ${msg.senderId === currentUser.uid ? "sent" : "received"}`}>
              {msg.text}
            </div>
          ))
        ) : (
          <p>No messages yet...</p>
        )}
      </div>

      {/* Input */}
      {selectedChatUser && (
        <div className="flex items-center p-3 border-t bg-white">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
          {showEmojiPicker && (
            <EmojiPicker onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
          )}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbox;

