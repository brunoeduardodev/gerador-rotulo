import { Box, Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import Maker from "./components/Maker";

function App() {
  return (
    <Flex direction="column">
      <Header />
      <Maker />
    </Flex>
  );
}

export default App;
