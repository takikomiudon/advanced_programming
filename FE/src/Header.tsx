import { AppShell, Burger, Button, Image, Menu } from "@mantine/core";
import logo from "./logo.webp";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Header = (props: {
  opened: boolean;
  toggle: () => void;
  supabase: SupabaseClient;
  session: Session | null;
}) => {
  const handleLogout = () => {
    props.supabase.auth.signOut();
  };
  return (
    <AppShell.Header>
      <div className="flex flex-row items-center gap-4">
        <Burger
          opened={props.opened}
          onClick={props.toggle}
          hiddenFrom="sm"
          size="sm"
          className="ml-4"
        />
        <Image src={logo} alt="logo" h={56} w={56} />
        <h1 className="text-3xl font-bold grow">Chat Syllabus</h1>
        {props.session ? (
          <Button className="mr-4" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Menu>
            <Menu.Target>
              <Button className="mr-4">Login</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Auth
                supabaseClient={props.supabase}
                appearance={{ theme: ThemeSupa }}
                providers={["google", "github"]}
              />
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </AppShell.Header>
  );
};

export default Header;
