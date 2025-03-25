import React from "react";

const Message = ({ text, isUser }) => {
    if (isUser) {
        return <div className="message user"><p>{text}</p></div>;
    }

    const formatResponse = () => {
        // Handle specific bot responses with custom styling
        if (text.startsWith("Predicted condition:")) {
            return <p className="condition"><strong>🩺Predicted condition: {text.replace("Predicted condition:", "").trim()}</strong></p>;
        }
        if (text.startsWith("Recommended specialist(s):")) {
            return <p className="specialists"><strong>👨‍⚕️Specialist: {text.replace("Recommended specialist(s):", "").trim()}</strong></p>;
        }
        if (text.startsWith("Searching")) {
            return <p className="searching"><strong>🔎 {text.trim()}</strong></p>;
        }
        if (text.startsWith("Here are some nearby doctors:")) {
            return <p className="doctors-title"><strong>{text}</strong></p>;
        }

        const lines = text.split("\n\n").flatMap(section => section.split("\n"));
        let phoneNumberFound = false;
        let websiteFound = false;
        let isDoctorResponse = text.startsWith("Here are some nearby doctors:");

        const elements = lines.map((line, index) => {
            if (line.match(/^\d+\./)) {
                return <p key={index} className="doctor-card"><strong>{line}</strong></p>;
            }
            else if (line.includes("📍")) {
                return <p key={index} className="doctor-info">{line}</p>;
            }
            else if (line.includes("📞 Phone:")) {
                phoneNumberFound = true;
                let phoneNumber = line.replace("📞 Phone:", "").trim();

                if (!phoneNumber) {
                    phoneNumber = "Not available";
                }

                return (
                    <p key={index} className="doctor-info">
                        📞 <a href={phoneNumber !== "Not available" ? `tel:${phoneNumber}` : "#"} className="phone-link">
                            {phoneNumber}
                        </a>
                    </p>
                );
            }
            else if (line.includes("🌐 Website:")) {
                websiteFound = true;
                let website = line.replace("🌐 Website:", "").trim();

                if (!website || website === "-") {
                    website = "Not available";
                } else if (!website.startsWith("http")) {
                    website = `https://${website}`;
                }

                return (
                    <p key={index} className="doctor-info">
                        🌐 <a href={website !== "Not available" ? website : "#"} target="_blank" rel="noopener noreferrer" className="website-link">
                            {website}
                        </a>
                    </p>
                );
            }
            return <p key={index}>{line}</p>;
        });

        // Ensure "Not available" is only added for doctor-related responses
        if (isDoctorResponse) {
            if (!phoneNumberFound) {
                elements.push(
                    <p key="no-phone" className="doctor-info">
                        📞 <a href="#" className="phone-link">Not available</a>
                    </p>
                );
            }
            if (!websiteFound) {
                elements.push(
                    <p key="no-website" className="doctor-info">
                        🌐 <a href="#" className="website-link">Not available</a>
                    </p>
                );
            }
        }

        return elements;
    };

    return (
        <div className="message bot">
            {formatResponse()}
        </div>
    );
};

export default Message;
