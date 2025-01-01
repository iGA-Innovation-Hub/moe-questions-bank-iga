import React, { useState } from "react";
import invokeApig from "../lib/callAPI.ts";
import { useAlert } from "../components/AlertComponent.tsx";
import { LuAudioLines } from "react-icons/lu";
import AudioLoader from "../components/AudioLoader.tsx";
import { FiDownloadCloud } from "react-icons/fi";

const AudioScriptForm: React.FC = () => {
  // Storing the inputs
  const [audioName, setAudioName] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const { showAlert } = useAlert();

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

        showAlert({
          type: "success",
          message: "Audio generated successfully",
        });

        setAudioName("")
        setScript("")
      } else {
        
        throw new Error("Failed to retrieve audio data.");
      }
    } catch (error) {
      console.error("Error", error);
      showAlert({
        type: "failure",
        message: "Error generating audio",
      });
    } finally {
      setLoading(false);
    }
  };
  const downloadAudio = () => {
    if (!audioData) return;

    const blob = new Blob(
      [Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0))],
      { type: "audio/mpeg" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${audioName || "audio"}.mp3`;
    link.click();
    URL.revokeObjectURL(url);

  };
  return (
    <div
      className="container"
      style={{
        flex: 1,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2
          className="title"
          style={{
            fontFamily: "Arial, sans-serif",
            marginBottom: "0",
            marginTop: "0",
            fontSize: "24px",
            textAlign: "center",
            color: "rgb(12, 84, 125)",
          }}
        >
          Generate Audio
        </h2>
        {/* Input for Audio Name */}
        <div className="form-group" style={{ marginBottom: "0.5rem" }}>
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "rgb(12, 84, 125)",
              marginBottom: "0.5rem",
              display: "block",
              paddingLeft: "5px",
            }}
          >
            Audio name
          </label>
          <input
            type="text"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
            placeholder="Enter the audio file name"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "14px",
              color: "#000",
              height: "35px",
            }}
          />
        </div>

        {/* Input for Script */}
        <div style={{ marginBottom: "1.5rem" }} className="form-group">
          <label
            style={{
              paddingLeft: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "rgb(12, 84, 125)",
              marginBottom: "0.5rem",
              display: "block",
              
            }}
          >
            Audio script
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter the script content"
            style={{
              width: "100%",
              height: "100px",
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "14px",
              resize: "none",
            }}
          ></textarea>
        </div>

        {/* Submit Button */}

        {!loading && (
          <button
            type="submit"
            disabled={!audioName || !script || loading}
            style={{
              background: "rgb(12, 84, 125)",
              color: "white",
              cursor:
                !audioName || !script || loading ? "not-allowed" : "pointer",
              display: "block",
              backgroundColor:
                !audioName || !script || loading
                  ? "#bdbdbd"
                  : "rgb(12, 84, 125)",
              padding: "5px 35px",
              marginTop: "2rem",
              border: "none",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background 0.3s ease",
              margin: "0 auto",
            }}
          >
            Generate
            <LuAudioLines
              style={{
                fontSize: "1rem",
                marginLeft: "0.5rem",
                marginBottom: "-0.15rem",
              }}
            />
          </button>
        )}
        {loading && <AudioLoader />}
        {audioData && (
          <div
            className="audio-player"
            style={{
              marginTop: "2rem",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              height: "35px",
            }}
          >
            <button
              type="button"
              onClick={downloadAudio}
              style={{
                display: "block",
                background: "rgb(12, 84, 125)",
                color: "white",
                cursor: "pointer",
                padding: "5px 35px",
                marginTop: "2rem",
                border: "none",
                borderRadius: "20px",
                fontSize: "16px",
                fontWeight: "600",
                transition: "background 0.3s ease",
                height: "35",
              }}
            >
              Download
              <FiDownloadCloud
                style={{
                  fontSize: "1rem",
                  marginLeft: "0.5rem",
                  marginBottom: "-0.15rem",
                }}
              />
            </button>
            <audio
              controls
              src={`data:audio/mpeg;base64,${audioData}`}
              style={{ width: "450px", height: "35px" }}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AudioScriptForm;
