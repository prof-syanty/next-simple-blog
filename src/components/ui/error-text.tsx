import { ReactNode } from "react";

function ErrorText({ children }: { children: ReactNode }) {
  return <span className="text-red-500">{children}</span>;
}

export default ErrorText;
