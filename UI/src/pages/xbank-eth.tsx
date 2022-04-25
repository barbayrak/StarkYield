
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

const XbankETH: NextPage = () => {

    const { account } = useStarknet();

    return (
        <Box borderWidth={0} p={10} borderRadius={10} w="100%">
            <Box>
                <Header />
                <Center>
                    UI is not available yet.XBank ETH Strategy is only available as a contracted deployed to Testnet : 0x027e8e3d393926f359d7a34ff56874040f04a04e848c72b6eb8b798950702be3
                </Center>
            </Box>
        </Box>
      );
};

export default XbankETH;
