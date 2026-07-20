import React from "react";
import iconosContraer from "@/assets/img/icons/iconos-contraer.svg";

interface ContractButtonProps {
  onClick?: () => void;
}

const ContractButtonComponent = ({ onClick }: ContractButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: 'var(--clr-icon)',
        cursor: "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
      }}
      title="Contraer"
    >
      <img src={iconosContraer} alt="Contraer" width={22} height={22} />
    </button>
  );
};

export const ContractButton = React.memo(ContractButtonComponent);
