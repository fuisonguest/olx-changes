import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { CheckIcon } from "@chakra-ui/icons";

export default function SendChat({ id, to }) {
  const [message, setMessage] = useState("");
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      const response = await axios.post(
        "http://localhost:5000/sendMessage",
        { message, id, to },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("");
      }
      if (response.status === 201) {
        setMessage("You cannot send Message");
        toast({
          title: "You cannot send Message",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Form onSubmit={sendMessage} className="chat-input-container">
      <input
        type="text"
        className="chat-input"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type a message..."
      />
      {message.length > 0 && (
        <button type="submit" className="send-btn">
          <i className="fas fa-paper-plane"></i>
        </button>
      )}
    </Form>
  );
}
