import React, { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [feedLink, setFeedLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function extractLink(url: string) {
    try {
      setLoading(true);
      const response = await fetch(
        `https://extract-rss-api.onrender.com/api/rss?url=${encodeURIComponent(
          url
        )}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Feed link: ${response.statusText}`);
      }
      const data = await response.json();

      setLoading(false);

      return { link: data.feedLink };
    } catch (error) {
      console.error("Error fetching Feed link:", error);
      setLoading(false);
      return null;
    }
  }

  const handleExtract = async () => {
    try {
      const extractedLink = await extractLink(username);
      setFeedLink(extractedLink?.link || "Feed link not found");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div className="w-full text-center flex flex-col gap-4 mt-10">
      <h1 className="text-4xl text-gray-600">Extract a rss/atom link</h1>
      <input
        placeholder="Enter your blog link"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        className="px-3 h-12 w-1/3 mx-auto border border-gray-300 rounded-lg"
      />
      <button
        className="bg-gray-800 text-white px-4 py-4 w-1/3 mx-auto rounded-lg"
        onClick={handleExtract}
      >
        {loading ? "Processing..." : "Extract"}
      </button>

      {feedLink && (
        <p className="mt-4">
          Feed link:{" "}
          <a href={feedLink} target="_blank" rel="noopener noreferrer">
            {feedLink}
          </a>
        </p>
      )}
    </div>
  );
}
