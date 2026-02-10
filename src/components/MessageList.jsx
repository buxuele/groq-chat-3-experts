import { User } from 'lucide-react'
import ExpertResponse from './ExpertResponse'

function MessageList({ messages }) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg) => (
        <div key={msg.id || msg.timestamp} className="flex flex-col gap-4">
          {/* User Question */}
          <div className="flex w-full justify-end">
            <div className="max-w-[90%] md:max-w-[80%] relative overflow-hidden rounded-2xl bg-white/25 backdrop-blur-2xl border border-white/40 shadow-xl p-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl border border-white/50 flex items-center justify-center shadow-lg bg-gray-800">
                    <User className="text-white w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-gray-800 text-xs mb-1 font-bold">你</div>
                  <div className="text-gray-900 text-[15px] leading-relaxed font-medium">
                    {msg.question}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expert Responses */}
          <div className="flex flex-col gap-4">
            {Object.entries(msg.responses).map(([key, response]) => (
              <ExpertResponse key={`${msg.id}-${key}`} response={response} expertKey={key} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList
