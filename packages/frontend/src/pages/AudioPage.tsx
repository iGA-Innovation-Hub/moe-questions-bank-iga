import React, { useState } from "react";
import invokeApig from "../lib/callAPI.ts";

const AudioScriptForm: React.FC = () => {
  // Storing the inputs
  const [audioName, setAudioName] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh

    setLoading(true); // Start loading animation
    setAudioData(null); // Reset the audio Data for new submissions

    // Payload to be sent to the backend
    const payload = {
      audioName: audioName,
      script: script,
    };

    try {
      // Send the form data to the API
      //@ts-ignore
      const response = await invokeApig({
        path: "/convertToAudio",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (response && response.audioData) {
        setAudioData(response.audioData);
        alert("Audio generated successfully!");
      } else {
        throw new Error("Failed to retrieve audio data.");
      }      
    } catch (error) {
      console.error("Error", error);
      alert("Failed to generate the audio.");
    } finally {
      setLoading(false);
    }
  };
  const downloadAudio = () => {
    if (!audioData) return;

    const blob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${audioName || "audio"}.mp3`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          color: "#333",
          marginBottom: "2rem",
          fontSize: "28px",
        }}
      >
        Submit Audio and Script
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Input for Audio Name */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#4b4b4b",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Audio Name:
          </label>
          <input
            type="text"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
            placeholder="Enter the audio file name"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Input for Script */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#4b4b4b",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Script:
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter the script content"
            style={{
              width: "100%",
              height: "120px",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
              resize: "none",
            }}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            display: "block",
            width: "100%",
            backgroundColor: loading ? "#ccc" : "#4b4b4b",
            padding: "1rem",
            marginTop: "2rem",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: "1rem",
                  height: "1rem",
                  border: "2px solid #fff",
                  borderRadius: "50%",
                  borderTop: "2px solid transparent",
                  animation: "spin 1s linear infinite",
                }}
              />
              Loading...
            </span>
          ) : (
            "Submit Audio and Script"
          )}
        </button>
        </form>

        {audioData && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p>Audio generated successfully! You can download it below:</p>
          <button
            onClick={downloadAudio}
            style={{
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              padding: "0.75rem 1.5rem",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Download {audioName}.mp3
          </button>
          <p style={{ marginTop: "1rem" }}>Or play it directly:</p>
          <audio
            controls
            src={`data:audio/mpeg;base64,${audioData}`}
            style={{ width: "100%", maxWidth: "600px" }}
          />
        </div>
      )}
    </div>
);
};

export default AudioScriptForm;
