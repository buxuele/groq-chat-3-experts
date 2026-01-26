import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import './ExpertResponse.css'

function ExpertResponse({ response }) {
  return (
    <div className="expert-response">
      <div className="expert-header">
        <span className="expert-icon">{response.icon}</span>
        <span className="expert-name">{response.name}</span>
      </div>
      <div className="expert-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {response.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ExpertResponse
