import { AppShell, Button, Divider } from "@mantine/core";

const Navbar = (props: {
  document: string;
  setDocument: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <AppShell.Navbar p="md">
      <Button
        onClick={() => props.setDocument("syllabus")}
        className="my-2"
        variant={props.document === "syllabus" ? "filled" : "light"}
      >
        シラバス
      </Button>
      <Divider />
      <Button
        onClick={() => props.setDocument("course_guide")}
        className="my-2"
        variant={props.document === "course_guide" ? "filled" : "light"}
      >
        履修の手引き
      </Button>
    </AppShell.Navbar>
  );
};

export default Navbar;
