import Button from "react-bootstrap/Button";
import "../App.css";
import { Form } from "react-bootstrap";

const LoginPage = () => {
  return (
    <>
      <Form className="login-form">
        <Form.Group className="mb-3 w-25 " controlId="formGroupEmail">
          <Form.Label column="sm">Addresse courriel</Form.Label>
          <Form.Control type="email" placeholder="Enter email" size="sm" />
        </Form.Group>
        <Form.Group className="mb-3 w-25" controlId="formGroupPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type="password" placeholder="Password" size="sm" />
        </Form.Group>
      </Form>
    </>
  );
};

export default LoginPage;
