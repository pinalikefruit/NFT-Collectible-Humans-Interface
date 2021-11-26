import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
  Box
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useHumans from "../../hooks/useHumans";
import useTruncatedAddress from "../../hooks/useTruncatedAddress";


const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const humans = useHumans();
  const [availablePunks, setAvailablePunks] = useState(""); 
  const [idNumber, setIdNumber] = useState("");
  const toast = useToast();

  const getHumansData = useCallback(async () => {
    if (humans) {
      const totalSupply = await humans.methods.totalSupply().call();
      const maxSupply = await humans.methods.maxSupply().call();
      const dnaPreview = await humans.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await humans.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
      setAvailablePunks(maxSupply - totalSupply); 
      setIdNumber(totalSupply);
    }
  }, [humans, account]);

  useEffect(() => {
    getHumansData();
  }, [getHumansData]);

  const mint = () => {
    setIsMinting(true);

    humans.methods
      .mint()
      .send({
        from:account,
      })
      .on("TransactionHash", (txHash) => {
        toast({
          title: "Transacction send",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", () => {
        setIsMinting(false);
        toast({
          title: "Transacction confirm",
          description: "Oh yeah ",
          status: "success",
        });
      })
      .on("error", (error) => {
        setIsMinting(false);
        toast({
          title: "Transaction failed",
          description: error.message,
          status: "error",
        });
      });
  }; 
  
  const truncatedAddress = useTruncatedAddress(account);
  return (
    
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Box
    backgroundImage="url('./images/BG-image-min.jpg')"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    />

      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading color={"#C2C2C2"}
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "#8042FE",
              zIndex: -1,
            }}
          >
            HUMMAN'S NFT Collectible
          </Text>
          <br />
          <Text as={"span"} color={"#C2C2C2"}>
            2048 travellers
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Hummas is a collection of randomized Avatars whose metadata
           it is stored on-chain. They have unique characteristics and there are only 2048
           in existence.
        </Text>
        <Text color={"gray.500"}>
        Each Humans is generated sequentially based on your address,
           use the previewer to find out what your Humans would be if
           you mine right now.
        </Text>
        <Text color={"gray.500"}>
        Available humans: {availablePunks}
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"#C2C2C2"}
            bg={"gray.400"}
            _hover={{ bg: "gray.500" }}
            disabled={!humans}
            onClick={mint}
            isLoading={isMinting}
          >
            Get Humans
          </Button>
          <Link to="/humans">
            <Button 
            rounded={"full"} 
            size={"lg"} 
            fontWeight={"normal"} 
            px={6}
            colorScheme={"#C2C2C2"}
            bg={"gray.400"}
            _hover={{ bg: "gray.500" }}>
            Gallery
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="gray.400">
                {idNumber}
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="gray.400">
                {truncatedAddress}
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getHumansData}
              mt={4}
              size="xs"
              colorScheme="purple"
            >
              Update
            </Button>
          </>
        ) : (
          <Badge mt={2}> Your Wallet is desconect</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;