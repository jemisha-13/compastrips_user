import React from "react";
import { Button } from "react-bootstrap";


interface Props {
  ButtonStyle: string;
  children?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const Buttons: React.FC<Props> = ({
  children,
  onClick,
  ButtonStyle,
  disabled
}) => {
  return (
    <Button
      disabled={disabled || false}
      onClick={onClick}
      className={ButtonStyle}
    >
      {children}
    </Button>
  );
}

export default Buttons;