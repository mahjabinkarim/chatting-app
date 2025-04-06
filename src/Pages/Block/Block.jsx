import React, { useState, useEffect } from "react";
import app from "../../Firebase.config";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import CommonUser from "../../components/commonuser/Commonuser";
import { useSelector } from "react-redux";
import Commonbtn from "../../components/buttons/Commonbtn";

const Block = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const currentuser = useSelector((state) => state.userData.value);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const db = getDatabase(app);
        const blockRef = ref(db, "blockList");
        const snapshot = await get(blockRef);

        if (snapshot.exists()) {
          const allBlockedUsers = snapshot.val();
          const filteredBlockedUsers = [];

          // Loop through all blocked users
          for (let key in allBlockedUsers) {
            const blockedUser = allBlockedUsers[key];

            // Condition: Show only users blocked by current user
            if (blockedUser.blockedById === currentuser.uid) {
              filteredBlockedUsers.push({
                id: key,
                uid: blockedUser.blockedId,
                name: blockedUser.blockedName,
                photo: blockedUser.blockedPhoto,
              });
            }
          }

          setBlockedUsers(filteredBlockedUsers);
        }
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    fetchBlockedUsers();
  }, [currentuser]);

  // ✅ Unblock User Function
  const handleUnblockUser = async (blockedUser) => {
    const db = getDatabase(app);

    try {
      // Add to "friends" collection
      const friendsRef = ref(db, `friends/${currentuser.uid}_${blockedUser.uid}`);
      await set(friendsRef, {
        friendId: blockedUser.uid,
        friendName: blockedUser.name,
        friendPhoto: blockedUser.photo,
        acceptorId: currentuser.uid,
        acceptorName: currentuser.displayName,
        acceptorPhoto: currentuser.photoURL,
      });

      // Remove from "blockList" collection
      const blockRef = ref(db, `blockList/${blockedUser.id}`);
      await remove(blockRef);

      // Update UI
      setBlockedUsers((prevBlockedUsers) =>
        prevBlockedUsers.filter((user) => user.uid !== blockedUser.uid)
      );
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div className="blocked-users mt-[50px] ms-[100px]">
      <h2 className="text-2xl text-[#1d7ca1] font-bold">Blocked Users</h2>
      <div className="block-list">
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <div key={user.id} className="flex justify-between items-center p-3">
              <CommonUser userPhoto={user.photo} userName={user.name} />

              <Commonbtn buttonLabel="Unblock" onButtonClick={() => handleUnblockUser(user)} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No blocked users</p>
        )}
      </div>
    </div>
  );
};

export default Block;
