import "./App.css";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Header";
import Navbar from "./Navbar";
import Main from "./Main";

function App() {
  const [opened, { toggle }] = useDisclosure();

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
      <Header opened={opened} toggle={toggle} />
      <Navbar />
      <Main />
    </AppShell>
  );
}

export default App;
