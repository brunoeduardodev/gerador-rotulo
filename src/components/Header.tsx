import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const Header: React.FC = () => {
  return (
    <Flex direction="column" py={4} px={8} w="full" shadow="lg" bg="orange.500">
      <Text color="white" fontSize="2xl" fontWeight="bold">
        Gerador de Rótulo
      </Text>
    </Flex>
  );
};

export default Header;
