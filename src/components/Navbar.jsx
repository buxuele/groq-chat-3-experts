import './Navbar.css'

function Navbar({ onToggleSidebar, sidebarOpen }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">AI 智囊团</h1>
      </div>
      <div className="navbar-right">
        <button className="nav-item active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>聊天</span>
        </button>
        <button className="nav-item" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>图片处理</span>
        </button>
        <button className="nav-item" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>项目管理</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
