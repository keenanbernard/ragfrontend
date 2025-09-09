import React from "react";
import './ChatInteractions.css'
import {faBrain} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ChatInteractions = (props) => {
    return (
        <div
            key={props.index}
            className={`chat-bubble ${props.item.type === 'question' ? 'chat-question' : 'chat-answer'}`}
        >
            {props.item.type === 'answer' && (
                <div className="avatar-bot">
                    <FontAwesomeIcon icon={faBrain} alt="Logo" />
                </div>
            )}
            <div
                className="chat-content"
                dangerouslySetInnerHTML={{ __html: props.item.text }}
            />
        </div>
    )
}

export const ChatLoading = () => {
    return (
        <div className="chat-bubble chat-answer loading-bubble">
            <div className="avatar-bot loading">
                <FontAwesomeIcon icon={faBrain} alt="Logo" />
            </div>
            <div className="chat-content typing">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    )
}
