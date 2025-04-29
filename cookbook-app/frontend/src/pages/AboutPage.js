import React from "react";

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <h4 className="mt-5 mb-3">About Cookbook App</h4>

      <p>
        Welcome to the Cookbook App — your personal recipe companion! Discover, create, save, and organize your favorite dishes, all in one easy-to-use platform.
      </p>

      <h5 className="mt-4">Key Features:</h5>
      <ul>
        <li><strong>Create Recipes:</strong> Add new dishes with photos, ingredients, instructions, category, and style.</li>
        <li><strong>Search Recipes:</strong> Find recipes by dish name, category, or cuisine style.</li>
        <li><strong>Save to Favorites:</strong> Quickly save your favorite recipes to access them easily anytime.</li>
        <li><strong>Manage Favorites:</strong> View, organize, and remove your favorite dishes whenever you like.</li>
        <li><strong>View Recipes from People You Follow:</strong> Discover new dishes posted by users you follow.</li> 
        <li><strong>Follow Users:</strong> Search for other users, follow them, and build your cooking community.</li>
        <li><strong>View Profiles:</strong> See details and statuses of users you follow.</li>
        <li><strong>Mobile-Friendly:</strong> Designed to work beautifully on phones, tablets, and computers.</li>
      </ul>

      <h5 className="mt-4">How to Use the App:</h5>
      <ol>
        <li>Use the <strong>Search</strong> page to find recipes you like.</li>
        <li>Save any delicious dishes you discover by clicking the ❤️ button.</li>
        <li>Visit the <strong>Favorites</strong> page to manage and revisit your saved recipes.</li>
        <li>Explore the <strong>Following Recipes</strong> page to see dishes shared by users you follow!</li> 
        <li>Connect with others through the <strong>Followers</strong> page and build your community.</li>
      </ol>

      <p className="mt-4">
        We hope you enjoy using the Cookbook App as much as we enjoyed creating it. Happy cooking! 🍳🥗🍰
      </p>
    </div>
  );
}
