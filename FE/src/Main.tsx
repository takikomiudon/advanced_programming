import { ActionIcon, AppShell, Textarea } from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";

const Main = () => {
  return (
    <AppShell.Main className="flex flex-col justify-content-between h-full">
      <h1 className="text-3xl font-bold grow">Chat</h1>
      <div className="flex flex-row">
        <Textarea className="grow"/>
        <ActionIcon>
          <IconSend2 />
        </ActionIcon>
      </div>
    </AppShell.Main>
  );
};

export default Main;
