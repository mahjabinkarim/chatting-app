import React, { useState, useEffect } from "react";
import app from "../../Firebase.config";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import CommonUser from "../../components/commonuser/Commonuser";
import { useSelector } from "react-redux";
import Commonbtn from "../../components/buttons/Commonbtn";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const currentuser = useSelector((state) => state.userData.value);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = getDatabase(app);
        const friendsRef = ref(db, "friends");
        const snapshot = await get(friendsRef);

        if (snapshot.exists()) {
          const allFriends = snapshot.val();
          const filteredFriends = [];

          // Loop through all friends
          for (let key in allFriends) {
            const friend = allFriends[key];

            // Condition: Show only friends where current user is involved
            if (friend.friendId === currentuser.uid) {
              filteredFriends.push({
                id: key,
                uid: friend.acceptorId,
                name: friend.acceptorName,
                photo: friend.acceptorPhoto,
              });
            } else if (friend.acceptorId === currentuser.uid) {
              filteredFriends.push({
                id: key,
                uid: friend.friendId,
                name: friend.friendName,
                photo: friend.friendPhoto,
              });
            }
          }

          setFriends(filteredFriends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [currentuser]);

  // ✅ Block Friend Function
  const handleBlockFriend = async (friend) => {
    const db = getDatabase(app);

    try {
      // Store in "blockList" collection
      const blockRef = ref(db, `blockList/${currentuser.uid}_${friend.uid}`);
      await set(blockRef, {
        blockedId: friend.uid,
        blockedName: friend.name,
        blockedPhoto: friend.photo,
        blockedById: currentuser.uid,
        blockedByName: currentuser.displayName,
        blockedByPhoto: currentuser.photoURL,
      });

      // Remove from "friends" collection
      const friendRef = ref(db, `friends/${friend.id}`);
      await remove(friendRef);

      // Update UI
      setFriends((prevFriends) => prevFriends.filter((f) => f.uid !== friend.uid));
    } catch (error) {
      console.error("Error blocking friend:", error);
    }
  };

  // ✅ Unfriend Function
  const handleUnfriend = async (friendId) => {
    const db = getDatabase(app);

    try {
      // Remove from "friends" collection
      const friendRef = ref(db, `friends/${friendId}`);
      await remove(friendRef);

      // Update UI
      setFriends((prevFriends) => prevFriends.filter((f) => f.id !== friendId));
    } catch (error) {
      console.error("Error unfriending:", error);
    }
  };

  return (
    <div className="friends-list mt-[50px] ms-[100px]">
      <h2 className="text-2xl text-[#1d7ca1] font-bold">Your Friends</h2>
      <div className="friend-list">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className="flex justify-between items-center p-3">
              <CommonUser userPhoto={friend.photo} userName={friend.name} />

              <div className="flex justify-between gap-3">
                <Commonbtn
                  buttonLabel="Block"
                  onButtonClick={() => handleBlockFriend(friend)}
                />
                <Commonbtn
                  buttonLabel="Unfriend"
                  onButtonClick={() => handleUnfriend(friend.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No friends found</p>
        )}
      </div>
    </div>
  );
};

export default Friends;

