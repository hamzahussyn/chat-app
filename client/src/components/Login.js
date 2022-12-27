import React from "react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  const handleSubmit = () => {
    fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(!data?.message){
          setFeedback(data.errors[0].title);
          return;
        };

        localStorage.setItem('token', data.data.token);
        localStorage.setItem('id', data.data.user._id);
        localStorage.setItem('email', data.data.user.email);
        localStorage.setItem('firstName', data.data.user.firstName);
        localStorage.setItem('lastName', data.data.user.lastName);

        window.location.reload();
      });
  };

  return (
    <div d-flex justify-content-center style={{ marginTop: "20vh" }}>
      <Row>
        <Col span={2}></Col>
        <Col span={8}>
          <Card>
            <Card.Header>Chat App</Card.Header>
            <Card.Body>
              <Card.Title>Login</Card.Title>
              <Card.Text>Login to chat with people.</Card.Text>

              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <p style={{ color: "red" }}>{feedback}</p>

                <Button
                  className="mb-3"
                  variant="primary"
                  type="submit"
                  style={{ marginLeft: "30%", width: "40%" }}
                  onClick={handleSubmit}
                >
                  login
                </Button>
                <p>
                  dont have an account?
                  <Link to="/register"> Register</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col span={2}></Col>
      </Row>
    </div>
  );
}

export default Login;
