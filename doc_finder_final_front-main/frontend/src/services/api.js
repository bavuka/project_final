const RASA_URL = "http://localhost:5005/webhooks/rest/webhook";

export const sendMessageToBackend = async (message) => {
    try {
        const response = await fetch(RASA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: "user", message }),
        });

        return await response.json();
    } catch (error) {
        console.error("Error sending message:", error);
        return [];
    }
};

// Function to send user location to Rasa (via geolocation)
export const sendLocationToRasa = async (latitude, longitude) => {
    const locationMessage = `/provide_location{"latitude": ${latitude}, "longitude": ${longitude}}`;
    return await sendMessageToBackend(locationMessage);
};

// Function to send manually entered location to Rasa
export const sendManualLocationToRasa = async (location) => {
    const locationMessage = `/manual_loc{"manual_location": "${location}"}`;
    return await sendMessageToBackend(locationMessage);
};
