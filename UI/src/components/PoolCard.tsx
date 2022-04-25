import * as React from 'react';
import NextLink from "next/link";

import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    Link,
    Badge,
    useColorModeValue,
    VStack,
    HStack
  } from '@chakra-ui/react';
import {
    useStarknet,
    useStarknetCall,
    useStarknetInvoke,
  } from "@starknet-react/core";

export function PoolCardView({id,name,parent,image,type,isLive,link}: { id?: string ,name?: string,parent? : string,image?: string,type?: string,isLive?: boolean,link:string }) {
    const { account } = useStarknet();

  return (
    <Center py={6}>
    <Box
      maxW={'320px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow={'2xl'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}>
      <Avatar
        size={'xl'}
        src={
          image
        }
        mb={4}
        pos={'relative'}
      />
      <Heading fontSize={'2xl'} fontFamily={'body'}>
        {name}
      </Heading>
      <Text fontWeight={600} color={'gray.500'} mb={4}>
        {parent}
      </Text>
      <Text
        textAlign={'center'}
        color={useColorModeValue('gray.700', 'gray.400')}
        px={3}>
        Looping and compounding strategy for XBank. Takes your deopsit tokens and loops it within the colletral factor reach.
      </Text>

      <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
        <Badge
          px={2}
          py={1}
          bg={useColorModeValue('gray.50', 'gray.800')}
          fontWeight={'400'}>
          {type}
        </Badge>
      </Stack>

      <Stack mt={8} direction={'row'} spacing={4}>
        <NextLink href={link}>
            <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            bg={'blue.400'}
            color={'white'}
            boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
            }
            _hover={{
                bg: 'blue.500',
            }}
            _focus={{
                bg: 'blue.500',
            }}>
            Select
            </Button>
        </NextLink>
      </Stack>
    </Box>
  </Center>
  );
}

export function XbankPools() {
    const { account } = useStarknet();

  return (
    <Box borderWidth={0} p={10} borderRadius={10} w="100%">
    {account ? (
        <Box>
            <VStack>
                <HStack direction={'row'} align={'center'} w="100%" >
                    <PoolCardView id="1" name="ETH" parent="XBank" image="https://testnet-app.xbank.finance/_next/static/images/eth-5d5bae4833b300c7ad35c16ef9c567a9.svg" type="One Sided Pool" isLive={true} link="xbank-eth"/>
                    <PoolCardView id="2" name="DAI" parent="XBank" image="https://testnet-app.xbank.finance/_next/static/images/dai-2be7ba26bb52ffd1364a1a1a703e3298.svg" type="One Sided Pool" isLive={true} link="xbank-dai"/>
                    <PoolCardView id="3" name="USDC" parent="XBank" image="https://testnet-app.xbank.finance/_next/static/images/usdc-a55335230b214305a11b04f588d80ce3.svg" type="One Sided Pool" isLive={true}  link="xbank-usdc"/>
                </HStack>
            </VStack>
        </Box>
    ) : (
        <Text>Connect wallet to begin</Text>
    )}
    </Box>
  );
}

