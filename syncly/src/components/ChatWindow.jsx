import { useRef, useEffect, useMemo } from "react";
import { IoSend } from "react-icons/io5";
import "../pages/Chat.css";
import "../pages/themes.css";

function ChatWindow({
  selectedUsername,
  messages,
  currentUserId,
  newMessage,
  setNewMessage,
  sendMessage,
  typingUser,
  handleTyping,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive or user is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  // SOLID LOGIC: Efficiently find the last sent message ID without copying/reversing the array
  const lastSentMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const senderId = msg.sender?.id || msg.sender?._id || msg.sender;
      if (senderId === currentUserId) {
        return msg.id || msg._id;
      }
    }
    return null;
  }, [messages, currentUserId]);

  const onInputChange = (e) => {
    const val = e.target.value;
    setNewMessage(val);
    handleTyping(val);
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        {selectedUsername || "Select a conversation"}
      </div>

      <div className="messages">
        {messages.map((message, index) => {
          const msgId = message.id || message._id;
          const senderId = message.sender?.id || message.sender?._id || message.sender;
          const isSentByMe = senderId === currentUserId;
          const isLastSent = msgId === lastSentMessageId;

          return (
            <div
              key={`${msgId}-${index}`}
              className={isSentByMe ? "message sent" : "message received"}
            >
              <div className="message-bubble">
                <span className="message-text">{message.content}</span>
                
                {/* FIXED: Status indicator is now housed safely inside the bubble */}
                {isLastSent && (
                  <div className="message-status">
                    {message.seen ? "Seen ✓✓" : "Sent ✓"}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="message received typing-row">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={onInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;