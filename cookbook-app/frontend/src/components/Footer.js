import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 fixed-bottom w-100">
      <small>© {new Date().getFullYear()} Cookbook App · Built with love for food lovers 🍰</small>
    </footer>
  );
}
