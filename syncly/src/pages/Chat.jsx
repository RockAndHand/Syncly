import { useEffect, useState } from "react";
import api from "../services/api";
import "./Chat.css";
import socket from "../socket";
import RequestPanel from "../components/RequestPanel";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import "../pages/themes.css";

function Chat() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const currentUserId = currentUser?.id;
  console.log(currentUser);
  // =========================
  // INITIAL LOAD & SOCKET SETUP
  // =========================

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  // FIXED: Handles duplicates by checking message sender id
  // FIXED: Removing the stale closure by tracking currentUserId cleanly
  useEffect(() => {
    if (!currentUserId) return;

    socket.on("newMessage", (message) => {
      const senderId =
        message.sender?.id ||
        message.sender?._id ||
        (typeof message.sender === "string" ? message.sender : null);

      if (String(senderId) === String(currentUserId)) return;

      setSelectedConversation((currentSelected) => {
        if (message.conversationId === currentSelected) {
          setMessages((prev) => {
            // This one line kills the duplicate
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
        return currentSelected;
      });
    });

    return () => socket.off("newMessage"); // This removes ALL listeners, not just this one
  }, [currentUserId]); // Dynamic tracking handles profile loading delays seamlessly
  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      socket.emit("join", currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  // FIXED: Tracking typing context clean up accurately
  useEffect(() => {
    socket.on("userTyping", (data) => {
      // Only show typing if it belongs to this active conversation window and it's not you
      if (
        data.conversationId === selectedConversation &&
        data.username !== currentUser?.username
      ) {
        setTypingUser(data.username);
      }
    });

    socket.on("userStoppedTyping", (data) => {
      if (data.conversationId === selectedConversation) {
        setTypingUser("");
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [selectedConversation, currentUser]);
  useEffect(() => {
    if (!currentUserId) return;

    const handleNewMessage = (message) => {
      const senderId =
        message.sender?.id ||
        message.sender?._id ||
        (typeof message.sender === "string" ? message.sender : null);

      if (String(senderId) === String(currentUserId)) return;

      setSelectedConversation((currentSelected) => {
        if (message.conversationId === currentSelected) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
        return currentSelected;
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage); // surgical, only removes THIS handler
  }, [currentUserId]);

  useEffect(() => {
    socket.on("messagesSeen", (data) => {
      if (data.conversationId !== selectedConversation) return;

      setMessages((prev) =>
        prev.map((message) => {
          if (message.sender.id === currentUserId) {
            return {
              ...message,
              seen: true,
            };
          }

          return message;
        }),
      );
    });

    return () => {
      socket.off("messagesSeen");
    };
  }, [selectedConversation, currentUserId]);
  // =========================
  // API ACTIONS
  // =========================
  const searchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/users/search?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/friend-requests",
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Request Sent!");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/friend-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/friend-requests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchFriendRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedConversation(conversationId);
      setMessages(response.data);

      await api.post(
        `/messages/${conversationId}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const targetText = newMessage;
    setNewMessage("");
    socket.emit("stopTyping", { conversationId: selectedConversation });

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/messages",
        { conversationId: selectedConversation, content: targetText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Add the confirmed message from server response (has real ID)
      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/friend-requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchFriendRequests();
      fetchConversations();
    } catch (error) {
      console.error(error);
    }
  };

  // FIXED: Simplified input flow and attached necessary metadata tracking
  const handleTyping = (value) => {
    setNewMessage(value);

    if (!currentUser || !selectedConversation) return;

    console.log("Sending:", {
      conversationId: selectedConversation,
      username: currentUser?.username,
    });
    socket.emit("typing", {
      conversationId: selectedConversation,
      username: currentUser.username,
    });

    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        conversationId: selectedConversation,
      });
    }, 1200);
  };

  const logout = () => {
    localStorage.removeItem("token");

    socket.disconnect();

    window.location.href = "/";
  };
  return (
    <div className="chat-container">
      <Sidebar
        currentUserId={currentUserId}
        search={search}
        setSearch={setSearch}
        searchUsers={searchUsers}
        searchResults={searchResults}
        sendFriendRequest={sendFriendRequest}
        friendRequests={friendRequests}
        acceptRequest={acceptRequest}
        rejectRequest={rejectRequest}
        conversations={conversations}
        selectedConversation={selectedConversation}
        fetchMessages={fetchMessages}
        setSelectedUsername={setSelectedUsername}
        onlineUsers={onlineUsers}
        logout={logout}
      />

      <ChatWindow
        selectedUsername={selectedUsername}
        messages={messages}
        currentUserId={currentUserId}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        typingUser={typingUser}
        handleTyping={handleTyping}
      />
    </div>
  );
}

export default Chat;
