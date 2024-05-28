import { ActionIcon, AppShell, Loader, Textarea } from "@mantine/core";
import { IconBrandOpenai, IconSend2, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { History } from "./types/history";
import { Session, SupabaseClient } from "@supabase/supabase-js";

const Main = (props: {
  document: string;
  supabase: SupabaseClient;
  session: Session | null;
}) => {
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [histories, setHistories] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !composing) {
      event.preventDefault();
      setHistories([...histories, { query, response: "", page: 0, score: 0 }]);
      setIsLoading(true);
      generateMessage(query);
    }
  };

  const fetchHistories = async () => {
    if (props.session) {
      const { data, error } = await props.supabase
        .from("histories")
        .select("*")
        .eq("user_id", props.session.user.id);
      if (error) {
        throw error;
      }
      setHistories(data as History[]);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, [props.session?.user.id]);

  const generateMessage = async (query: string) => {
    setQuery("");
    const response = await fetch("http://127.0.0.1:8080/" + props.document, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: props.session ? props.session.user.id : null,
        query: query,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const data = await response.json();

    setHistories((histories) =>
      histories.map((history, index) =>
        index === histories.length - 1
          ? {
              query: history.query,
              response: data.response,
              page: Number(data.page),
              score: data.score,
            }
          : history
      )
    );
    fetchHistories();
    setIsLoading(false);
  };

  return (
    <AppShell.Main className="flex flex-col justify-content-between h-full">
      <div className="flex flex-col gap-2 grow">
        {histories.map((history, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex flex-row text-gray-500">
              <IconUser className="mr-4" />
              {history.query}
            </div>
            <div className="flex flex-row">
              <IconBrandOpenai stroke={1} className="shrink-0 mr-4" />
              {isLoading && index === histories.length - 1 ? (
                <Loader size={16} />
              ) : (
                <div className="flex flex-col">
                  {history.response}
                  <div>
                    {history.page > 0 && (
                      <div>参照したページ: {history.page}</div>
                    )}
                    類似度: {history.score.toFixed(3)}
                  </div>
                </div>
              )}
            </div>
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
