import React from "react";

export const AlertVariants = {
  error: "red",
  success: "green",
  default: "gray",
};

interface IAlert extends React.ComponentPropsWithoutRef<"div"> {
  type?: "error" | "success" | "default";
}

function Alert({ children, type = "default" }: IAlert) {
  return (
    <div
      className={`text-center text-${AlertVariants[type]}-500 bg-${AlertVariants[type]}-50 p-2 mb-2`}
    >
      {children}
    </div>
  );
}

export default Alert;
