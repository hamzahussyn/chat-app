import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://localhost:3000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: fName, lastName: lName, email, password }),
    }).then((response) => response.json()).then(res => navigate('/'));
  };

  return (
    <div d-flex justify-content-center style={{ marginTop: "10vh" }}>
      <Row>
        <Col span={2}></Col>
        <Col span={8}>
          <Card>
            <Card.Header>Chat App</Card.Header>
            <Card.Body>
              <Card.Title>Register</Card.Title>
              <Card.Text>Register to chat with people.</Card.Text>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                  />
                </Form.Group>

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

                <Button
                  className="mb-3"
                  variant="primary"
                  type="submit"
                  style={{ marginLeft: "30%", width: "40%" }}
                  onClick={handleSubmit}
                >
                  Register
                </Button>

                <p>
                  Already have an account?
                  <Link to="/"> Login</Link>
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

export default Signup;
