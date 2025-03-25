import { useState } from "react";

const ChatInput = ({ onSend, placeholder }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage("");  // Clear input after sending
        }
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder || "Type a message..."}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default ChatInput;
