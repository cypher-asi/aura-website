import './TerminalPreview.css';

function IconHome(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function IconChat(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconMemory(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
      <path d="M6 2v4M10 2v4M14 2v4M18 2v4M6 18v4M10 18v4M14 18v4M18 18v4" />
    </svg>
  );
}

function IconTools(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconSettings(): React.ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconSearch(): React.ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function IconAgent(): React.ReactNode {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="12" y="8" width="24" height="20" rx="4" fill="none" />
      <rect x="18" y="15" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="27" y="15" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      <path d="M12 28v4a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-4" />
      <path d="M20 36v4M28 36v4" />
      <path d="M16 40h16" />
      <circle cx="24" cy="5" r="2" fill="none" />
      <path d="M24 7v1" />
    </svg>
  );
}

function IconChatBubble(): React.ReactNode {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 30a3 3 0 0 1-3 3H14l-6 6V11a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3z" />
    </svg>
  );
}

function IconMachine(): React.ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function IconCalendar(): React.ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconSend(): React.ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  );
}

export function TerminalPreview(): React.ReactNode {
  return (
    <div className="terminalWrapper">
      <div className="terminal">
        {/* Title bar */}
        <div className="terminalChrome">
          <div className="terminalDots">
            <span className="terminalDot" />
            <span className="terminalDot" />
            <span className="terminalDot" />
          </div>
          <span className="terminalTitle">AURA</span>
        </div>

        {/* Main app layout */}
        <div className="appLayout">
          {/* Icon sidebar */}
          <div className="iconSidebar">
            <div className="iconSidebarTop">
              <button className="iconBtn iconBtnActive" type="button"><IconHome /></button>
              <button className="iconBtn" type="button"><IconChat /></button>
              <button className="iconBtn" type="button"><IconMemory /></button>
              <button className="iconBtn" type="button"><IconTools /></button>
            </div>
            <div className="iconSidebarBottom">
              <button className="iconBtn" type="button"><IconSettings /></button>
            </div>
          </div>

          {/* Conversation list */}
          <div className="convPanel">
            <div className="convHeader">
              <div className="convSearch">
                <IconSearch />
              </div>
              <button className="convAddBtn" type="button">+</button>
            </div>
            <div className="convList">
              <div className="convItem">
                <div className="convAvatar">
                  <span className="convAvatarIcon">⬡</span>
                </div>
                <div className="convInfo">
                  <span className="convName">agent</span>
                  <span className="convPreview">Hey! What would you like to do...</span>
                </div>
                <span className="convDate">Wed</span>
              </div>
              <div className="convItem convItemActive">
                <div className="convAvatar">
                  <span className="convAvatarIcon">⬡</span>
                </div>
                <div className="convInfo">
                  <span className="convName">n4o</span>
                  <span className="convPreview">Senior Dev</span>
                </div>
                <span className="convDate">Sat</span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="chatArea">
            <div className="chatEmpty">
              <div className="chatEmptyIcon"><IconChatBubble /></div>
              <span className="chatEmptyText">Send a message</span>
            </div>
            <div className="chatInput">
              <div className="chatInputRow">
                <span className="chatInputPlaceholder">+ Add a follow-up</span>
                <button className="chatSendBtn" type="button"><IconSend /></button>
              </div>
              <div className="chatInputMeta">
                <span className="chatModel">Opus 4.6</span>
                <span className="chatModelSep">·</span>
                <span className="chatModelCmd">/ for commands</span>
              </div>
            </div>
          </div>

          {/* Agent detail panel */}
          <div className="agentPanel">
            <div className="agentPanelHeader">
              <span className="agentLabel">AGENT</span>
              <span className="agentBadge">ACTIVE</span>
            </div>
            <div className="agentAvatarSection">
              <div className="agentAvatarLarge"><IconAgent /></div>
            </div>
            <div className="agentIdentity">
              <div className="agentNameRow">
                <div>
                  <div className="agentName">n4o</div>
                  <div className="agentRole">Senior Dev</div>
                </div>
                <button className="agentEditBtn" type="button">✎ Edit</button>
              </div>
            </div>
            <div className="agentMeta">
              <div className="agentMetaLabel">Personality</div>
              <div className="agentMetaValue">Direct and to the point</div>
            </div>
            <div className="agentDetails">
              <div className="agentDetailRow">
                <IconMachine />
                <span>Local Machine</span>
              </div>
              <div className="agentDetailRow">
                <IconCalendar />
                <span>Birthed March 2026</span>
              </div>
            </div>
            <div className="agentMeta">
              <div className="agentMetaLabel">System Prompt</div>
              <div className="agentMetaValue">You give clear, concise answers but are to the point.</div>
            </div>
            <div className="agentFooter">
              <span className="agentFooterText">CYPHER-ASI // AURA</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="statusBar">
          <div className="statusLeft">
            <span className="statusOrg">Neation</span>
            <span className="statusChevron">⌄</span>
            <span className="statusCredits">7,247 Z</span>
          </div>
          <div className="statusRight">
            <span className="statusOnline" />
          </div>
        </div>
      </div>
    </div>
  );
}
