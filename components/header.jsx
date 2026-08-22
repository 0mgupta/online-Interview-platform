import { checkUser } from "@/lib/checkUser";
import RoleRedirect from "./RoleRedirect";
import AnimatedHeader from "./AnimatedHeader";
import { Suspense } from "react";

/**
 * Header — server component that fetches user data and delegates
 * rendering to AnimatedHeader (client component with motion animations).
 */
const Header = async () => {
  const user = await checkUser();

  return (
    <Suspense fallback={null}>
      <AnimatedHeader
        user={user}
        roleRedirect={user ? <RoleRedirect role={user.role} /> : null}
      />
    </Suspense>
  );
};

export default Header;
