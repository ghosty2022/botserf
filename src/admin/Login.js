import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { auth } from "../firebase";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

// Smooth fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoginSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  background: #f0f4f8;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: #fff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Input = styled.input`
  padding: 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #2c6e9c;
    box-shadow: 0 0 8px rgba(44, 110, 156, 0.3);
  }
`;

const Button = styled.button`
  background: #2c6e9c;
  color: #fff;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background: #1a4c75;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  font-size: 0.9rem;
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (error) {
      setError(t("loginFailed") + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginSection>
      <h1>{t("adminLogin")}</h1>
      <Form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label={t("email")}
        />
        <Input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label={t("password")}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? <FiLoader className="spinner" /> : <FaLock />}
          {t("login")}
        </Button>
      </Form>
    </LoginSection>
  );
};

export default Login;
