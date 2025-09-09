import './ChatInterface.css';
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "../Sidebar/Sidebar";
import ChatInput from "../ChatInput/ChatInput";
import DOMPurify from "dompurify";
import {Toast, ToastContainer} from "react-bootstrap";
import { ChatInteractions, ChatLoading } from '../ChatInteractions/ChatInteractions';

const ChatInterface = () => {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'danger' });
    const chatHistory = useRef(null);
    const serverConnection = 'http://localhost:3001';
    const userRole = 'general'

    const showErrorToast = (message) => {
        setToast({ show: true, message, variant: 'danger' });
        setTimeout(() => setToast({ show: false, message: '', variant: 'danger' }), 8000);
    };

    const createNewChat = () => {
        const newChat = {
            id: chats.length + 1,
            title: chats.length === 0 ? 'Welcome Chat' : `New Chat ${chats.length + 1}`,
            qaHistory: [],
        };

        setChats(prevChats => [newChat, ...prevChats]);
        setActiveChatId(newChat.id);
    };

    const queryChatbot = async (question) => {
        if (!activeChatId) return;

        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === activeChatId
                    ? { ...chat, qaHistory: [...chat.qaHistory, { type: 'question', text: question }] }
                    : chat
            )
        );

        setLoading(true);

        try {
            const response = await fetch(`${serverConnection}/query`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: question, role: userRole }),
            });

            const result = await response.json();

            if (!result || !result.answer) {
                showErrorToast(result?.error || 'Unexpected error from server.');
                setLoading(false);
                return;
            }

            const safeAnswer = DOMPurify.sanitize(
                result.answer.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>")
            );

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === activeChatId
                        ? { ...chat, qaHistory: [...chat.qaHistory, { type: 'answer', text: safeAnswer }] }
                        : chat
                )
            );
        } catch (e) {
            showErrorToast(`Failed to fetch response from server: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const question = e.target.query.value.trim();
        if (question) {
            queryChatbot(question).then(() => {
                const controller = new AbortController();
                controller.abort();
            });
            e.target.query.value = '';
        }
    };

    const scrollToBottom = () => {
        if (chatHistory.current) {
            chatHistory.current.scrollTo({ top: chatHistory.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    // On initial load, create a welcome chat
    useEffect(() => {
        if (chats.length === 0) {
            createNewChat();
        }
        // eslint-disable-next-line
    }, []);

    const activeChat = chats.find(chat => chat.id === activeChatId);

    return (
        <div className="chat-app">
            <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onNewChat={createNewChat}
                onSelectChat={setActiveChatId}
            />
            <div className="chat-section">
                {activeChat ? (
                    <>
                        <div className="chat-history" ref={chatHistory}>
                            {activeChat.qaHistory.map((item, index) => (
                                <ChatInteractions index={index} item={item} />
                            ))}
                            {loading && (
                                <ChatLoading />
                            )}

                        </div>
                        <ChatInput handlesubmit={handleSubmit} loading={loading} />
                    </>
                ) : (
                    <div className="chat-placeholder">No chat selected. Create a new one!</div>
                )}
            </div>

            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    bg={toast.variant}
                    onClose={() => setToast({ ...toast, show: false })}
                    show={toast.show}
                    delay={8000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">ERROR</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default ChatInterface;

