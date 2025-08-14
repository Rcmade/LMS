import { Children } from "@//types";

const AuthLayout = ({ children }: Children) => {
  return (
    <div className="flex h-full items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
