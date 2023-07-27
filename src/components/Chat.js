import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showTyping,setShowTyping] = useState(Boolean);
  let typingTimeout;
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const sendStopTyping = ()=>{
    const messageData = {
      room: room,
      author: username,
    };
    socket.emit("stopTyping",messageData);
  }
  const typingText = ()=>{
    const messageData = {
      room: room,
      author: username,
    };
    socket.emit("typing",messageData);
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    socket.on("showType",(data)=>{
      setShowTyping(true);
    })
    socket.on("stopType",(data)=>{
      setShowTyping(false);
      // setWhoTyping(data.author);
    })
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
      <p>Live Chat</p>
       
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
           {
          showTyping ? 
          (
            <div class="chat-bubble">
              <div class="typing">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          ): (<p></p>)
        }
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
            typingText();
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(sendStopTyping, 5000);
          }}
        
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage() && sendStopTyping();
          }}
        />
        <button onClick={sendMessage}>&#9658;Send</button>
      </div>
    </div>
  );
}

export default Chat;