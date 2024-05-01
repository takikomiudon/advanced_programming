import { AppShell, Button, Divider } from "@mantine/core";

const Navbar = (props: {
  documentId: number;
  setDocumentId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <AppShell.Navbar p="md">
      <Button
        onClick={() => props.setDocumentId(0)}
        className="my-2"
        variant={props.documentId === 0 ? "filled" : "light"}
      >
        シラバス
      </Button>
      <Divider />
      <Button
        onClick={() => props.setDocumentId(1)}
        className="my-2"
        variant={props.documentId === 1 ? "filled" : "light"}
      >
        履修の手引き
      </Button>
    </AppShell.Navbar>
  );
};

export default Navbar;
