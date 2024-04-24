import { AppShell, Burger } from "@mantine/core";
import React from "react";

const Header = (props: { opened: boolean; toggle: () => void }) => {
  return (
    <AppShell.Header>
      <Burger
        opened={props.opened}
        onClick={props.toggle}
        hiddenFrom="sm"
        size="sm"
      />
      <div>Logo</div>
    </AppShell.Header>
  );
};

export default Header;
