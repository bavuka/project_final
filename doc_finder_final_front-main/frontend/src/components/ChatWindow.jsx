
import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { sendMessageToBackend, sendLocationToRasa, sendManualLocationToRasa } from "../services/api";
import { IoChatbubbleEllipsesOutline, IoClose } from "react-icons/io5";

const ChatWindow = () => {
    const [messages, setMessages] = useState([]);
    const [awaitingLocation, setAwaitingLocation] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const locationRequested = useRef(false); 

    useEffect(() => {
        if (!isChatOpen) return;

        const getAccurateLocation = (retryCount = 0) => {
            if (!navigator.geolocation) {
                requestManualLocation();
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude, accuracy } = position.coords;

                    if (accuracy <= 20) {
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy}m`);
                        await sendLocationToRasa(latitude, longitude);
                        setMessages((prev) => [...prev, { text: "Location detected and set.", isUser: false }]);
                    } else if (retryCount < 3) {
                        console.warn(`GPS accuracy too low (${accuracy}m). Retrying in 3s...`);
                        setTimeout(() => getAccurateLocation(retryCount + 1), 500);
                    } else {
                        requestManualLocation();
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error.message);
                    requestManualLocation();
                },
                { enableHighAccuracy: true, timeout: 1500, maximumAge: 0 }
            );
        };

        const requestManualLocation = () => {
            if (!locationRequested.current) { 
                locationRequested.current = true; 
                alert("Could not access your location. Please enter it manually.");
                setMessages((prev) => [...prev, { text: "Please enter your location.", isUser: false }]);
                setAwaitingLocation(true);
            }
        };

        getAccurateLocation();
    }, [isChatOpen]);

    const handleSendMessage = async (message) => {
        if (awaitingLocation) {
            setAwaitingLocation(false);
            locationRequested.current = false; 
            await sendManualLocationToRasa(message);
            setMessages((prev) => [...prev, { text: `Location set: ${message}`, isUser: false }]);
            return;
        }

        setMessages((prev) => [...prev, { text: message, isUser: true }]);

        setIsTyping(true); 
        const response = await sendMessageToBackend(message);
        setIsTyping(false);

        response.forEach((msg) =>
            setMessages((prev) => [...prev, { text: msg.text, isUser: false }])
        );
    };

    return (
        <>
            {!isChatOpen && (
                <button 
                    className="chat-icon" 
                    onClick={() => setIsChatOpen(true)}
                >
                    <IoChatbubbleEllipsesOutline size={30} />
                </button>
            )}

            {isChatOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>Chatbot</span>
                        <button onClick={() => setIsChatOpen(false)} className="close-btn">
                            <IoClose size={20} />
                        </button>
                    </div>

                    <div className="messages">
                        {messages.map((msg, index) => (
                            <Message key={index} text={msg.text} isUser={msg.isUser} />
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                    </div>

                    <ChatInput 
                        onSend={handleSendMessage} 
                        placeholder={awaitingLocation ? "Enter your location..." : "Type a message..."} 
                    />
                </div>
            )}
        </>
    );
};

export default ChatWindow;
