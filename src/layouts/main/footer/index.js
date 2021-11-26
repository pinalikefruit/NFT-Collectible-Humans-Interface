import {
    Box,
    Container,
    Stack,
    Text,
    Link,
    useColorModeValue,
  } from "@chakra-ui/react";
  
  const Footer = () => {
    return (
      <Box
        bg={useColorModeValue("#C2C2C2", "gray.800")}
        color={useColorModeValue("gray.700", "gray.200")}
      >
        <Box
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ base: "center", md: "space-between" }}
            align={{ base: "center", md: "center" }}
          >
            <Text>
              <Text fontSize="md"> © {new Date().getFullYear()} Design made with passion by <Link ml={1} href="https://www.linkedin.com/in/sarahrappeneau/">
                Sarah Rappeneau  </Link> </Text>
            </Text>
          </Container>
        </Box>
      </Box>
    );
  };  
  
  export default Footer;