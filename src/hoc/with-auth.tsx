import { useSession } from "next-auth/react";
import Error from "next/error";

const withAuth = <T extends object>(
  Component: React.ComponentType<T>
): React.FC<T> => {
  const authComponent = ({ ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session } = useSession();

    return !!session?.user ? (
      <Component {...(props as T)} />
    ) : (
      <Error statusCode={404} title="Page Not Found" />
    );
  };

  return authComponent;
};

export default withAuth;
