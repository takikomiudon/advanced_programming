import { ActionIcon, AppShell, Textarea } from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";
import { useState } from "react";

const Main = () => {
  const [messages, setMessages] = useState("");

  const generateMessage = async (query: string) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.text();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppShell.Main className="flex flex-col justify-content-between h-full">
      <h1 className="text-3xl font-bold grow">{messages}</h1>
      <div className="flex flex-row">
        <Textarea className="grow" />
        <ActionIcon onClick={() => generateMessage("おすすめの授業を教えて")}>
          <IconSend2 />
        </ActionIcon>
      </div>
    </AppShell.Main>
  );
};

export default Main;
