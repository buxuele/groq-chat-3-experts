import ExpertResponse from './ExpertResponse'
import './MessageList.css'

function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <div key={idx} className="message-group">
          <div className="user-message">
            <div className="message-content">{msg.question}</div>
          </div>
          <div className="expert-responses">
            {Object.entries(msg.responses).map(([key, response]) => (
              <ExpertResponse key={key} response={response} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList
