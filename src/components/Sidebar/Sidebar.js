import React, { useState } from 'react';
import SidebarItem from './Sidebaritem';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faPenToSquare, faBrain } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ chats, activeChatId, onNewChat, onSelectChat }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <FontAwesomeIcon className='sidebar-logo' icon={faBrain} alt="Logo" />}
                <div className='sidebar-controls'>
                    <div className="collapseIconWrapper">
                        <FontAwesomeIcon
                            icon={collapsed ? faAngleRight : faAngleLeft}
                            className="collapseIcon"
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <span className={`customTooltip ${collapsed ? 'tooltip-right' : 'tooltip-left'}`}>
              {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            </span>
                    </div>
                </div>
            </div>

            {!collapsed && (
                <div className="newChatRow">
                    <button className="newChatBtn" onClick={onNewChat}><FontAwesomeIcon className='me-2' icon={faPenToSquare} /> New Chat</button>
                </div>
            )}

            {!collapsed && (
                <div className="sidebar-section">
                    <h3 className='chatsLabel'>Chats</h3>
                    {chats.map((chat) => (
                        <SidebarItem
                            key={chat.id}
                            title={chat.title}
                            isActive={chat.id === activeChatId}
                            onClick={() => onSelectChat(chat.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
