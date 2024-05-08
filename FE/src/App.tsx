import "./App.css";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Header";
import Navbar from "./Navbar";
import Main from "./Main";
import { createClient, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [opened, { toggle }] = useDisclosure();
  const [document, setDocument] = useState("syllabus");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header
        opened={opened}
        toggle={toggle}
        supabase={supabase}
        session={session}
      />
      <Navbar document={document} setDocument={setDocument} />
      <Main document={document} supabase={supabase} session={session} />
    </AppShell>
  );
}

export default App;
