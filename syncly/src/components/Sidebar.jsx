import RequestPanel from "./RequestPanel";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiSearch, FiLogOut } from "react-icons/fi"; // Added FiLogOut
import { IoPersonAddOutline } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";

function Sidebar({
  currentUserId,
  search,
  setSearch,
  searchUsers,
  searchResults,
  sendFriendRequest,
  friendRequests,
  acceptRequest,
  rejectRequest,
  conversations,
  selectedConversation,
  fetchMessages,
  setSelectedUsername,
  onlineUsers,
  logout, 
}) {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1 className="logo-title">
          <BsLightningChargeFill />
          Syncly
        </h1>
        <p>Chat differently.</p>
      </div>

      <div className="search-box">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchUsers}>
            <FiSearch size={18} />
          </button>
        </div>
      </div>

      {searchResults.map((user) => (
        <div key={user.id} className="search-result">
          <span>{user.username}</span>
          <button onClick={() => sendFriendRequest(user.id)}>
            <IoPersonAddOutline />
          </button>
        </div>
      ))}

      <ThemeSwitcher />
      
      <RequestPanel
        friendRequests={friendRequests}
        acceptRequest={acceptRequest}
        rejectRequest={rejectRequest}
      />

      <div className="conversation-list">
        {conversations.map((conversation) => {
          const otherUser = conversation.participants.find(
            (participant) => participant.user.id !== currentUserId,
          );

          return (
            <div
              key={conversation.id}
              className={`conversation ${
                selectedConversation === conversation.id
                  ? "active-conversation"
                  : ""
              }`}
              onClick={() => {
                fetchMessages(conversation.id);
                setSelectedUsername(otherUser?.user?.username || "");
              }}
            >
              <div className="avatar">
                {otherUser?.user?.username?.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="username">{otherUser?.user?.username}</div>
                <div className="status">
                  {onlineUsers.includes(String(otherUser?.user?.id))
                    ? "🟢 Online"
                    : "⚫ Offline"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="avatar-mini">M</div>
          <span className="footer-username">Me</span>
        </div>
        <button className="logout-btn" onClick={logout} title="Log Out">
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;