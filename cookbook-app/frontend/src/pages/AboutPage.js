import React, { useEffect, useState } from "react";

export default function AboutPage() {
  const [aboutMessage, setAboutMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/about")
      .then((res) => res.json())
      .then((data) => {
        setAboutMessage(data.message);
      })
      .catch((err) => {
        console.error("Error fetching /about:", err);
        setAboutMessage("Failed to load about message.");
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1>About Cookbook App</h1>
      <p>{aboutMessage}</p>
    </div>
  );
}
