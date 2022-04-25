
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

const XbankUSDC: NextPage = () => {

    const { account } = useStarknet();

    return (
        <Box borderWidth={0} p={10} borderRadius={10} w="100%">
            <Box>
                <Header />
                <Center>
                    UI is not available yet.XBank USDC Strategy is only available as a contracted deployed to Testnet : 0x057fac9dee4a9a92c5537a60dd4ed6accf3ab75a74872177b771384b9d992642
                </Center>
            </Box>
        </Box>
      );
};

export default XbankUSDC;
