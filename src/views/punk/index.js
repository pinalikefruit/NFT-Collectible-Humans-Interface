import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast,
  } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import PunkCard from "../../components/punk-card";
  import { useHumanData } from "../../hooks/useHumansData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
  import { useState } from "react";
  import useHumans from "../../hooks/useHumans";
  
  const Punk = () => {
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { loading, punk ,update } = useHumanData(tokenId);
    const humans = useHumans();
    const toast = useToast();
    const [transfering, setTransfering] = useState(false);

    const transfer = () => {
        setTransfering(true);

        const address = prompt("Ingresa la dirección: ");

        const isAddress = library.utils.isAddress(address);

        if (!isAddress) {
          toast({
            title: "Invalid address",
            description: "The address is not an Ethereum address",
            status: "error",
          });
          setTransfering(false);
        } else {
          humans.methods
            .safeTransferFrom(punk.owner, address, punk.tokenId)
            .send({
              from: account,
            })
            .on("error", () => {
              setTransfering(false);
            })
            .on("transactionHash", (txHash) => {
              toast({
                title: "Transaction sent",
                description: txHash,
                status: "info",
              });
            })
            .on("receipt", () => {
              setTransfering(false);
              toast({
                title: "Transaction confirmed",
                description: `The Hummans now belongs to ${address}`,
                status: "success",
              });
              update();
            });
        }
  };
  
    if (!active) return <RequestAccess />;
  
    if (loading) return <Loading />;
  
    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <PunkCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={punk.name}
            image={punk.image}
          />
          <Button
          onClick={transfer}
          disabled={account !== punk.owner}
          colorScheme="gray"
          isLoading={transfering}
        >
          {account !== punk.owner ? "You are not the owner" : "to transfer"}
        </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{punk.name}</Heading>
          <Text fontSize="xl">{punk.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme="gray">
              {punk.dna}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="gray">
              {punk.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(punk.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Tag>{value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
  export default Punk;