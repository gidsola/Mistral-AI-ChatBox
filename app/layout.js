"use client";
import './ui/styles/style.css';
import ChatBox from './page';

export default function RootLayout(/*{ children }*/) {
  return (
    <html lang="en">
      <body><ChatBox /></body>
    </html>
  );
};
