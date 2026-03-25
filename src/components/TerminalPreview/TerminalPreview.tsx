import {
  Brain,
  FolderOpen,
  Download,
  Gem,
  Search,
  Bot,
  MessageSquare,
  Monitor,
  Calendar,
  Send,
} from 'lucide-react';
import './TerminalPreview.css';

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
              <button className="iconBtn iconBtnActive" type="button"><Brain size={18} strokeWidth={1.5} /></button>
              <button className="iconBtn" type="button"><FolderOpen size={18} strokeWidth={1.5} /></button>
              <button className="iconBtn" type="button"><Download size={18} strokeWidth={1.5} /></button>
              <button className="iconBtn" type="button"><Gem size={18} strokeWidth={1.5} /></button>
            </div>
          </div>

          {/* Conversation list */}
          <div className="convPanel">
            <div className="convHeader">
              <div className="convSearch">
                <Search size={14} strokeWidth={1.5} />
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
              <div className="chatEmptyIcon"><MessageSquare size={48} strokeWidth={1.2} /></div>
              <span className="chatEmptyText">Send a message</span>
            </div>
            <div className="chatInput">
              <div className="chatInputRow">
                <span className="chatInputPlaceholder">+ Add a follow-up</span>
                <button className="chatSendBtn" type="button"><Send size={16} strokeWidth={1.5} /></button>
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
              <div className="agentAvatarLarge"><Bot size={40} strokeWidth={1.2} /></div>
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
                <Monitor size={14} strokeWidth={1.5} />
                <span>Local Machine</span>
              </div>
              <div className="agentDetailRow">
                <Calendar size={14} strokeWidth={1.5} />
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
