import React, { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [feedLink, setFeedLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function extractFeedLink(url: string) {
    try {
      setLoading(true);
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/" + url
      );
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Look for <link> tags with rel="alternate" and type="application/rss+xml" or "application/atom+xml"
      const feedLink = doc.querySelector<HTMLLinkElement>(
        'link[rel="alternate"][type="application/rss+xml"], link[rel="alternate"][type="application/atom+xml"]'
      );

      setLoading(false);

      if (feedLink && feedLink.href) {
        return feedLink.href;
      } else {
        return "Feed link not found";
      }
    } catch (error) {
      console.error("Error fetching or parsing HTML:", error);
      return null;
    }
  }

  const handleExtract = async () => {
    try {
      const extractedFeedLink = await extractFeedLink(username);
      setFeedLink(extractedFeedLink || "Feed link not found");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div className="w-full text-center flex flex-col gap-4 mt-10">
      <h1 className="text-4xl text-gray-600">Extract an rss/atom link</h1>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        className="px-3 h-12 w-1/3 mx-auto border border-gray-300 rounded-lg"
      />
      <button onClick={handleExtract}>
        {loading ? "Processing..." : "Extract"}
      </button>
      {feedLink && (
        <p className="mt-4">
          RSS/Atom feed link:{" "}
          <a href={feedLink} target="_blank" rel="noopener noreferrer">
            {feedLink}
          </a>
        </p>
      )}
    </div>
  );
}
