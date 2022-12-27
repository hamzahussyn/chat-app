import React, { useRef } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

function RenderMessage({ message }) {
  return (
    <Row className="p-1">
      <Col lg="1" className="pt-1">
        <p style={{ fontSize: "14px" }}>{message.sender}</p>
      </Col>
      <Col lg="11">
        <div>
          <p
            style={{
              borderRadius: "10px",
              border: "1px solid #bbb",
              padding: "5px",
              backgroundColor: "#bbb",
              display: "inline-block",
            }}
          >
            {message.message}
          </p>
        </div>
      </Col>
    </Row>
  );
}

function Chat({ socket }) {
  const [listing, setListing] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);
  const [transitionMessage, setTransitionMessage] = React.useState([]);
  const [updatedStream, setUpdatedStream] = React.useState(false);

  console.log("listing from above -> ", listing);

  const fetchSearch = () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/user/search?q=${search}&id=${userId}`, {
      headers: { "x-access-token": token },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setListing(data.data.users));
  };

  React.useEffect(() => {
    const userId = localStorage.getItem("id");
    socket.emit("joined_chat", userId);
    fetchSearch();
  }, []);

  const selectOnIncommingMessage = (id) => {
    console.log(id);
    console.log("listing from func", listing);
    console.log(
      "searched this",
      listing.find((_) => _._id === id)
    );
    setSelectedChat(listing.find((_) => _._id === id));
  };

  React.useEffect(() => {
    setChatHistory([]);
  }, [updatedStream]);

  React.useEffect(() => {
    socket.on("recieve_message", (message) => {
      console.log(message);
      // selectOnIncommingMessage(message.sender);
      const sender = listing.find((_) => _._id === message.sender);
      if (sender && selectedChat) {
        console.log("selected chat -> ", selectedChat);
        const newStream = sender._id !== selectedChat._id;
        if (newStream) {
          setUpdatedStream((prev) => !prev);
        }
      }
      console.log(sender);
      console.log(message);
      // console.log(sender._id === message.sender);
      setSelectedChat(sender);
      setChatHistory((prev) => {
        let doesExist = prev.find((_) => _.message === message.message);
        if (doesExist) {
          return prev;
        } else {
          return [...prev, { sender: "Them", message: message.message }];
        }
      });
    });
  }, [socket, setSelectedChat, listing]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.length) {
      return;
    }
    setChatHistory((prev) => [...prev, { sender: "You", message: message }]);
    const msgObject = {
      sender: localStorage.getItem("id"),
      reciever: selectedChat._id,
      message: message,
    };
    socket.emit("send_message", msgObject);
    setMessage("");
  };

  return (
    <Row>
      <div style={{ width: "30%" }}>
        <Card style={{ height: "100vh" }}>
          <Card.Header>People</Card.Header>
          <Row>
            <Form style={{ width: "77%" }}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Type to search people"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </Form.Group>
            </Form>
            <Button
              variant="primary"
              style={{ width: "20%" }}
              onClick={(e) => fetchSearch()}
            >
              Search
            </Button>

            <ListGroup>
              {listing.map((el) => (
                <ListGroup.Item
                  action
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdatedStream((prev) => !prev);
                    setSelectedChat(el);
                    socket.emit("create_room_request", {
                      sender: localStorage.getItem("id"),
                      reciever: el._id,
                    });
                  }}
                >
                  {`${el.firstName} ${el.lastName}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Row>
        </Card>
      </div>

      <div style={{ width: "70%" }}>
        <Card style={{ height: "80vh" }}>
          <Card.Header>
            {selectedChat
              ? `${selectedChat.firstName} ${selectedChat.lastName}`
              : "Chat"}
          </Card.Header>

          {chatHistory.map((c) => (
            <RenderMessage message={c} />
          ))}
        </Card>
        <Card className="mt-2 p-2" style={{ height: "16vh" }}>
          <Card.Title>Message</Card.Title>
          <Row>
            <Form style={{ width: "80%" }}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Type Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Group>
            </Form>
            <Button
              style={{ width: "20%", heigth: "50%" }}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Row>
        </Card>
      </div>
    </Row>
  );
}

export default Chat;
