import React, { useState, useEffect } from 'react';
import app from "../../Firebase.config"; // Import the initialized Firebase app
import { getDatabase, ref, get, set, remove } from "firebase/database"; // Firebase Database functions
import CommonUser from "../../components/commonuser/Commonuser";
import { useSelector } from "react-redux";
import Commonbtn from "../../components/buttons/Commonbtn";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState({}); // Store sent requests
  const currentuser = useSelector((state) => state.userData.value);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getDatabase(app);
        const usersRef = ref(db, "allUsers");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersList = [];

          for (let id in usersData) {
            if (id !== currentuser?.uid) {
              usersList.push({
                id,
                ...usersData[id],
              });
            }
          }

          setUsers(usersList);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchSentRequests = async () => {
      try {
        const db = getDatabase(app);
        const requestsRef = ref(db, `friendRequests/${currentuser.uid}`);
        const snapshot = await get(requestsRef);

        if (snapshot.exists()) {
          setSentRequests(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchUsers();
    fetchSentRequests();
  }, [currentuser]);

  // ✅ Add Friend Function
  const handleAddFriend = async (receiver) => {
    const db = getDatabase(app);
    const requestRef = ref(db, `friendRequests/${currentuser.uid}/${receiver.id}`);

    try {
      await set(requestRef, {
        senderId: currentuser.uid,
        senderName: currentuser.displayName,
        senderPhoto: currentuser.photoURL,
        receiverId: receiver.id,
        receiverName: receiver.username,
        receiverPhoto: receiver.userphoto,
      });

      // Update state to show request sent
      setSentRequests((prev) => ({
        ...prev,
        [receiver.id]: true,
      }));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // ✅ Cancel Friend Request Function
  const handleCancelRequest = async (receiverId) => {
    const db = getDatabase(app);
    const requestRef = ref(db, `friendRequests/${currentuser.uid}/${receiverId}`);

    try {
      await remove(requestRef);

      // Update state to show request removed
      setSentRequests((prev) => {
        const updatedRequests = { ...prev };
        delete updatedRequests[receiverId];
        return updatedRequests;
      });
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  return (
    <div className="all-users mt-[50px] ms-[100px]">
      <h2 className="text-2xl text-[#1d7ca1] font-bold">All Users</h2>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-3">
            <CommonUser userPhoto={user.userphoto} userName={user.username} />

            <div className="flex justify-between gap-3">
              {sentRequests[user.id] ? (
                <Commonbtn
                  buttonLabel="Cancel Request"
                  onButtonClick={() => handleCancelRequest(user.id)}
                />
              ) : (
                <Commonbtn
                  buttonLabel="Add Friend"
                  onButtonClick={() => handleAddFriend(user)}
                />
              )}
              <Commonbtn buttonLabel="Message" onButtonClick={() => {}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
