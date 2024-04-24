import { AppShell, Burger, Image } from "@mantine/core";
import React from "react";
import logo from "./logo.webp";

const Header = (props: { opened: boolean; toggle: () => void }) => {
  return (
    <AppShell.Header>
      <Burger
        opened={props.opened}
        onClick={props.toggle}
        hiddenFrom="sm"
        size="sm"
      />
      <div className="flex flex-row items-center gap-4">
        <Image src={logo} alt="logo" h={56} w={56} />
        <h1 className="text-3xl font-bold">Chat Syllabus</h1>
      </div>
    </AppShell.Header>
  );
};

export default Header;
