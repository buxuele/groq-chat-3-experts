import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Sparkles, Copy, Check, History, Rocket, Heart } from 'lucide-react'
import { useState } from 'react'

const expertIcons = {
  'zhuge_liang': History,
  'silicon_valley_mentor': Rocket,
  'psychologist': Heart
}

const expertColors = {
  'zhuge_liang': 'from-amber-500/40 to-orange-500/30',
  'silicon_valley_mentor': 'from-blue-500/40 to-cyan-500/30',
  'psychologist': 'from-purple-500/40 to-pink-500/30'
}

const expertNames = {
  'zhuge_liang': '历史专家',
  'silicon_valley_mentor': '创业导师',
  'psychologist': '心理专家'
}

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-xl overflow-hidden bg-gray-900/90 border border-gray-700 shadow-inner">
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
          {language || 'code'}
        </span>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          title={copied ? "已复制" : "复制代码"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-[13px] font-mono text-gray-200 whitespace-pre-wrap break-all">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  )
}

function ExpertResponse({ response, expertKey }) {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = expertIcons[expertKey] || Sparkles

  const markdownComponents = {
    p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-900 font-medium">{children}</p>,
    ul: ({children}) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 text-gray-900">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 text-gray-900">{children}</ol>,
    li: ({children}) => <li className="pl-1 leading-relaxed font-medium">{children}</li>,
    h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-3 text-gray-950">{children}</h1>,
    h2: ({children}) => <h2 className="text-lg font-bold mt-4 mb-2 text-gray-950">{children}</h2>,
    h3: ({children}) => <h3 className="text-base font-bold mt-3 mb-2 text-gray-950">{children}</h3>,
    strong: ({children}) => <strong className="font-bold text-gray-950">{children}</strong>,
    em: ({children}) => <em className="italic text-gray-800">{children}</em>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-gray-600 pl-4 py-2 my-3 bg-white/20 rounded-r-lg text-gray-800 italic">
        {children}
      </blockquote>
    ),
    code: ({inline, className, children, ...props}) => {
      const match = /language-(\w+)/.exec(className || '')
      if (inline) {
        return (
          <code className="bg-gray-800/80 text-gray-100 rounded px-1.5 py-0.5 text-[13px] font-mono border border-gray-600" {...props}>
            {children}
          </code>
        )
      }
      return <CodeBlock language={match?.[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
    },
    a: ({href, children}) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-700 underline underline-offset-2 hover:text-blue-900 transition-colors font-semibold"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-4 border-gray-500/30" />,
    table: ({children}) => (
      <div className="overflow-x-auto my-3">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({children}) => <thead className="bg-white/30">{children}</thead>,
    th: ({children}) => <th className="border border-gray-400/50 px-3 py-2 text-left text-gray-950 font-bold">{children}</th>,
    td: ({children}) => <td className="border border-gray-400/50 px-3 py-2 text-gray-900 font-medium">{children}</td>,
  }

  return (
    <div 
      className="flex w-full justify-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        max-w-[95%] md:max-w-[90%] w-full 
        relative overflow-hidden rounded-2xl 
        bg-white/25 backdrop-blur-2xl backdrop-saturate-150
        border border-white/40 shadow-xl
        transition-all duration-300
        ${isHovered ? 'shadow-2xl border-white/60 bg-white/35' : ''}
      `}>
        <div className="p-4 md:p-5">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-xl border border-white/50 flex items-center justify-center shadow-lg
                bg-gradient-to-br ${expertColors[expertKey] || 'from-indigo-500/40 to-purple-500/30'}
              `}>
                <IconComponent className="w-5 h-5 text-gray-900" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-950 font-bold text-[15px]">
                  {expertNames[expertKey] || response.name}
                </span>
              </div>
              
              <div className="text-[15px] leading-relaxed">
                <ReactMarkdown 
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {response.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpertResponse
