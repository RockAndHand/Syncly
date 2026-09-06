import "../pages/Chat.css";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
function RequestPanel({ friendRequests, acceptRequest, rejectRequest }) {
  return (
    <div className="request-panel">
      <h3>Requests</h3>

      {friendRequests.map((request) => (
        <div key={request.id} className="request-item">
          <span>{request.sender.username}</span>

          <button onClick={() => acceptRequest(request.id)}>
            <FaCheck />
          </button>

          <button onClick={() => rejectRequest(request.id)}><FaTimes/></button>
        </div>
      ))}
    </div>
  );
}

export default RequestPanel;
