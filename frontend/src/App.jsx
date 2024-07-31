import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "Urdu", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [correctedText, setCorrectedText] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  let apiUrl = import.meta.env.VITE_API_URL;
  const translate = async (text) => {
    try {
      const response = await axios.post(apiUrl, {
        message: text,
        language: formData.language,
        model: "gpt-3.5-turbo-instruct",
      });

      const { correctedText, translatedText } = response.data;
      setCorrectedText(correctedText);
      setTranslation(translatedText);
    } catch (error) {
      console.error("Error translating text:", error);
      setError("Failed to translate text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    translate(formData.message);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Translation App</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          {["Spanish", "French", "German", "Hindi", "Urdu"].map((language) => (
            <label
              key={language}
              className={`choice ${
                formData.language === language ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="language"
                value={language}
                checked={formData.language === language}
                onChange={handleInputChange}
              />
              {language}
            </label>
          ))}
        </div>

        <textarea
          name="message"
          placeholder="Type your message here..."
          value={formData.message}
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isLoading}>
          Translate
        </button>
      </form>

      <div className="translation">
        <div className="copy-btn" onClick={handleCopy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
        </div>
        {isLoading ? <BeatLoader size={12} color={"#10b981"} /> : translation}
      </div>

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
};

export default App;
