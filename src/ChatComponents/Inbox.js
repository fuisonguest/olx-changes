import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../resources/Loading";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

export default function Inbox() {
  const [newChats, setNewChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const authToken = localStorage.getItem("authToken");
  const authemail = localStorage.getItem("authemail");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/newchats", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data;
        setNewChats(data);
        
        // Calculate total unread messages
        const totalUnread = data.reduce((total, chat) => 
          total + (chat.unreadCount || 0), 0);
        setUnreadCount(totalUnread);
        
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch new messages every second
    const intervalId = setInterval(fetchNewChats, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [authToken]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (newChats.length === 0) {
    return (
      <Box className="inbox-empty">
        <ChatIcon boxSize={12} />
        <Text className="inbox-empty-text">No conversations yet</Text>
        <Text className="inbox-empty-subtext">
          When you start chatting with sellers or buyers, you'll see your conversations here
        </Text>
      </Box>
    );
  }

  return (
    <Box className="inbox-container">
      <Flex className="inbox-header">
        <Heading className="inbox-title" size="md">
          <ChatIcon mr={2} /> My Conversations
        </Heading>
      </Flex>

      {newChats.map((chat, index) => {
        const isUserSender = chat.from === authemail;
        const otherUser = isUserSender ? chat.to : chat.from;
        const chatLink = `/chat/${chat.product_id}/${otherUser}`;
        
        // Fix the profile picture issue by ensuring we have a valid URL
        const profilePicture = chat.user?.picture && chat.user.picture !== "undefined" 
          ? chat.user.picture 
          : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
        
        return (
          <Box key={index} className="inbox-card">
            <a href={chatLink}>
              <Flex className="inbox-card-content">
                <img
                  src={profilePicture}
                  alt={chat.user?.name || "User"}
                  className="inbox-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
                  }}
                />
                <Box className="inbox-message-info">
                  <Text className="inbox-user-name">
                    {chat.user?.name || "User"}
                  </Text>
                  <Text className="inbox-message-preview">
                    {isUserSender ? "You: " : ""}{chat.message}
                  </Text>
                  <Text className="inbox-message-time">
                    {formatTime(chat.createdAt)}
                  </Text>
                </Box>
                {!isUserSender && !chat.isRead && (
                  <Box className="inbox-unread-badge">1</Box>
                )}
              </Flex>
            </a>
          </Box>
        );
      })}
    </Box>
  );
}
