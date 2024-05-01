import { AppShell, Burger, Button, Image } from "@mantine/core";
import logo from "./logo.webp";

const Header = (props: { opened: boolean; toggle: () => void }) => {
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
        <Button className="mr-4">Sign In</Button>
      </div>
    </AppShell.Header>
  );
};

export default Header;
