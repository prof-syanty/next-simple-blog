import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Error from "next/error";

const withAdmin = <T extends object>(
  Component: React.ComponentType<T>
): React.FC<T> => {
  const authComponent = ({ ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session } = useSession();

    return session?.user?.role === Role.ADMIN ? (
      <Component {...(props as T)} />
    ) : (
      <Error statusCode={403} title="Forbidden" />
    );
  };

  return authComponent;
};

export default withAdmin;
