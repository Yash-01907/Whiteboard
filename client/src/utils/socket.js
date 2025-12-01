import io from "socket.io-client";

// Ensure this matches your backend URL
const socket = io("http://localhost:8000", {
  withCredentials: true, // Passes cookies so backend knows who we are
  autoConnect: false,    // We connect manually only when entering a board
});

export default socket;