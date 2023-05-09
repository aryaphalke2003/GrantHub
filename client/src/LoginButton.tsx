import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick}>{label}</button>
  );
};

const LoginButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/sign-in');
  };

  return (
    <Button label="Login" onClick={handleButtonClick} />
  );
};

export default LoginButton;