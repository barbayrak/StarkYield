
import type { NextPage } from "next";
import { DappView } from "~/components/DappView";
import { Header } from "~/components/Header";
import { TokenView } from "~/components/TokenView";

import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    VStack,
    HStack,
    Image,
    Button, ButtonGroup, Link
  } from '@chakra-ui/react';

import {
    useStarknet,
    useStarknetCall,
    useStarknetInvoke,
  } from "@starknet-react/core";
import { XbankPools } from "~/components/PoolCard";

const Xbank: NextPage = () => {

    const { account } = useStarknet();

    return (
        <Box borderWidth={0} p={10} borderRadius={10} w="100%">
            <Box>
                <Header />
                <Center>
                    <XbankPools/>
                </Center>
            </Box>
        </Box>
      );
};

export default Xbank;
