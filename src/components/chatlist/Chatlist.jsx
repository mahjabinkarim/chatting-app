import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { setChatUser } from "../../slice/chatslice";

const Chatlist = () => {
  const [friends, setFriends] = useState([]);
  const currentUser = useSelector((state) => state.userData.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser?.uid) return; // Ensure user is loaded

      try {
        const db = getDatabase();
        const friendsRef = ref(db, "friends");
        const snapshot = await get(friendsRef);

        if (snapshot.exists()) {
          const friendsData = snapshot.val();
          const friendsList = [];

          for (let id in friendsData) {
            let friend = friendsData[id];

            // Identify friends where the current user is involved
            if (friend.friendId === currentUser.uid) {
              friendsList.push({
                id,
                userId: friend.acceptorId,
                userName: friend.acceptorName,
                userPhoto: friend.acceptorPhoto,
              });
            } else if (friend.acceptorId === currentUser.uid) {
              friendsList.push({
                id,
                userId: friend.friendId,
                userName: friend.friendName,
                userPhoto: friend.friendPhoto,
              });
            }
          }

          setFriends(friendsList);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [currentUser]);

  // Handle friend selection
  const handleSelectFriend = (friend) => {
    dispatch(setChatUser(friend)); // Store in Redux
    localStorage.setItem("selectedChatUser", JSON.stringify(friend)); // Store in localStorage
  };

  return (
    <div className="chat-list">
      <h2 className="text-xl font-bold p-3">Friends</h2>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div
            key={friend.id}
            className="friend flex items-center p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleSelectFriend(friend)}
          >
            <img
              src={friend.userPhoto}
              alt={friend.userName}
              className="w-10 h-10 rounded-full mr-2"
            />
            <p>{friend.userName}</p>
          </div>
        ))
      ) : (
        <p className="p-3 text-gray-500">No friends found</p>
      )}
    </div>
  );
};

export default Chatlist;

