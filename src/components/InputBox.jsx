import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'

function InputBox({ onSend, disabled }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
      // 重置高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:pb-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10">
      <div className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="relative flex items-stretch gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              disabled={disabled}
              rows={1}
              className="w-full bg-white/25 backdrop-blur-2xl border border-white/40 rounded-2xl pl-5 pr-4 py-4 text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white/35 focus:border-white/60 transition-all shadow-2xl text-[16px] resize-none overflow-hidden min-h-[56px] max-h-[200px] font-medium"
              style={{ lineHeight: '1.5' }}
            />
          </div>
          <button 
            type="submit"
            disabled={disabled || !input.trim()}
            className="h-[56px] px-5 rounded-2xl bg-white/30 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/40 active:scale-95 transition-all backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/40 font-semibold shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[11px] text-gray-300 font-medium">AI 可能产生不准确的信息，请验证重要信息。</span>
        </div>
      </div>
    </div>
  )
}

export default InputBox
