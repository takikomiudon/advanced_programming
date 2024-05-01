import { ActionIcon, AppShell, Textarea } from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";
import { useState } from "react";
import { History } from "./types/history";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Main = (props: { supabase: SupabaseClient; session: Session | null }) => {
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [histories, setHistories] = useState<History[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !composing) {
      event.preventDefault();
      setHistories([...histories, { query, response: "" }]);
      generateMessage(query);
    }
  };

  const generateMessage = async (query: string) => {
    setQuery("");
    const response = await fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: props.session?.user.id,
        query: query,
        is_logged_in: props.session ? true : false,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const data = await response.text();
    setHistories((histories) =>
      histories.map((history, index) =>
        index === histories.length - 1
          ? { query: history.query, response: data }
          : history
      )
    );
  };

  return (
    <AppShell.Main className="flex flex-col justify-content-between h-full">
      <div className="flex flex-col gap-2 grow">
        {histories.map((history, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="text-gray-500">{history.query}</div>
            <div>{history.response}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <Textarea
          className="grow"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
        />
        <ActionIcon onClick={() => generateMessage(query)}>
          <IconSend2 />
        </ActionIcon>
      </div>
    </AppShell.Main>
  );
};

export default Main;
