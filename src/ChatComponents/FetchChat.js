import { Box } from "@chakra-ui/react";
import axios from "axios";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdb-react-ui-kit";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../resources/Loading";
import { CheckIcon } from "@chakra-ui/icons";

export default function FetchChat({ id, toData, to }) {
  const authPicture = localStorage.getItem("authpicture");
  const authName = localStorage.getItem("authname");
  const authemail = localStorage.getItem("authemail");
  const authToken = localStorage.getItem("authToken");
  const [newMessages, setNewMessages] = useState([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (id) {
      const fetchNewMessages = async () => {
        const currentMessageLength = newMessages.length;
        try {
          const response = await axios.get("http://localhost:5000/api/new-messages", {
            params: { id, to }, // Pass data as query parameters
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = response.data; // Use response.data, no need for await
          setNewMessages(data);
          setIsLoading(false);

          // Mark messages as read if they're sent to the current user
          if (data.length > 0) {
            const unreadMessages = data.filter(
              msg => msg.to === authemail && !msg.isRead
            );
            
            if (unreadMessages.length > 0) {
              await axios.post("http://localhost:5000/mark-messages-read", 
                { messageIds: unreadMessages.map(msg => msg._id) },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
            }
          }

          if (currentMessageLength !== data.length) {
            setHasNewMessages(true);
          } else {
            setHasNewMessages(false);
          }
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      };

      // Fetch new messages every second
      const intervalId = setInterval(fetchNewMessages, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [id, authToken, to, authemail]);

  useEffect(() => {
    if (hasNewMessages) {
      scrollToBottom();
      setHasNewMessages(false);
    }
  }, [hasNewMessages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      className="message-container"
      maxH="400px"
      overflowY="auto"
      ref={messageContainerRef}
    >
      {newMessages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        newMessages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.from === authemail ? 'sent' : 'received'}`}>
            {message.from === authemail ? (
              <li className="d-flex justify-content-end mb-4">
                <div className="message-bubble-sent">
                  <p className="mb-0">{message.message}</p>
                  <div className="message-timestamp">
                    {formatTime(message.createdAt)}
                    <span className="message-status ml-1">
                      {message.isRead ? (
                        <span className="blue-tick">
                          <CheckIcon color="blue.500" boxSize={3} mr={1} />
                          <CheckIcon color="blue.500" boxSize={3} />
                        </span>
                      ) : (
                        <span className="gray-tick">
                          <CheckIcon color="gray.500" boxSize={3} mr={1} />
                          <CheckIcon color="gray.500" boxSize={3} />
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </li>
            ) : (
              <li className="d-flex mb-4">
                <img
                  src={toData.picture}
                  alt="avatar"
                  className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                  width="40"
                />
                <div className="message-bubble-received">
                  <p className="mb-0">{message.message}</p>
                  <div className="message-timestamp">
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </li>
            )}
          </div>
        ))
      )}
    </Box>
  );
}
