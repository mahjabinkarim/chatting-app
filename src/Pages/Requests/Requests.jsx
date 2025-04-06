import React, { useState, useEffect } from "react";
import app from "../../Firebase.config";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import CommonUser from "../../components/commonuser/Commonuser";
import { useSelector } from "react-redux";
import Commonbtn from "../../components/buttons/Commonbtn";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const currentuser = useSelector((state) => state.userData.value);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const db = getDatabase(app);
        const requestsRef = ref(db, "friendRequests");
        const snapshot = await get(requestsRef);

        if (snapshot.exists()) {
          const allRequests = snapshot.val();
          const filteredRequests = [];

          // Loop through all requests
          for (let senderId in allRequests) {
            for (let receiverId in allRequests[senderId]) {
              const request = allRequests[senderId][receiverId];

              // Condition: Show only requests where receiver = current user
              if (request.receiverId === currentuser.uid && request.senderId !== currentuser.uid) {
                filteredRequests.push(request);
              }
            }
          }

          setRequests(filteredRequests);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchRequests();
  }, [currentuser]);

  // ✅ Confirm Friend Request
  const handleConfirmRequest = async (request) => {
    const db = getDatabase(app);

    try {
      // Store in "friends" collection
      const friendsRef = ref(db, `friends/${request.senderId}_${request.receiverId}`);
      await set(friendsRef, {
        friendId: request.senderId,
        friendName: request.senderName,
        friendPhoto: request.senderPhoto,
        acceptorId: currentuser.uid,
        acceptorName: currentuser.displayName,
        acceptorPhoto: currentuser.photoURL,
      });

      // Remove from "friendRequests"
      const requestRef = ref(db, `friendRequests/${request.senderId}/${request.receiverId}`);
      await remove(requestRef);

      // Update UI
      setRequests((prevRequests) => prevRequests.filter((r) => r.senderId !== request.senderId));
    } catch (error) {
      console.error("Error confirming friend request:", error);
    }
  };

  // ✅ Remove Friend Request
  const handleRemoveRequest = async (request) => {
    const db = getDatabase(app);

    try {
      // Remove from "friendRequests"
      const requestRef = ref(db, `friendRequests/${request.senderId}/${request.receiverId}`);
      await remove(requestRef);

      // Update UI
      setRequests((prevRequests) => prevRequests.filter((r) => r.senderId !== request.senderId));
    } catch (error) {
      console.error("Error removing friend request:", error);
    }
  };

  return (
    <div className="all-requests mt-[50px] ms-[100px]">
      <h2 className="text-2xl text-[#1d7ca1] font-bold">Friend Requests</h2>
      <div className="request-list">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.senderId} className="flex justify-between items-center p-3">
              <CommonUser userPhoto={request.senderPhoto} userName={request.senderName} />

              <div className="flex justify-between gap-3">
                <Commonbtn
                  buttonLabel="Confirm"
                  onButtonClick={() => handleConfirmRequest(request)}
                />
                <Commonbtn
                  buttonLabel="Remove"
                  onButtonClick={() => handleRemoveRequest(request)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No friend requests</p>
        )}
      </div>
    </div>
  );
};

export default Requests;
