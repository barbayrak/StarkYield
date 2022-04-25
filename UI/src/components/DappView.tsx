import * as React from 'react';
import NextLink from "next/link";

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

export function ProductCard({id,name,image,type,isLive,link}: { id?: string ,name?: string,image?: string,type?: string,isLive?: boolean,link?:string }) {
    const { account } = useStarknet();

  return (
    <Box w={'25%'} py={12}>
        <Box
          role={'group'}
          p={6}
          maxW={'330px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}>
          <Box
            rounded={'lg'}
            mt={-12}
            pos={'relative'}
            height={'230px'}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 5,
              left: 0,
              backgroundImage: `url(${image})`,
              filter: 'blur(15px)',
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: 'blur(20px)',
              },
            }}>
            <Image
              rounded={'lg'}
              height={230}
              width={282}
              objectFit={'cover'}
              src={image}
            />
          </Box>
          <Stack pt={10} align={'center'}>
            <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                {type}
            </Text>
            <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                {name}
            </Heading>
            <Stack direction={'row'} align={'center'}>
                {isLive ? (
                  <NextLink href="/xbank">
                    <Button colorScheme='blue'> Check Pools</Button>
                  </NextLink>
                ) : (
                    <Text>Coming Soon</Text>
                )}
            </Stack>
          </Stack>
        </Box>
      </Box>
  );
}

export function DappView() {
    const { account } = useStarknet();

  return (
    <Box borderWidth={0} p={10} borderRadius={10} w="100%">
    {account ? (
        <Box>
            <VStack>
                <HStack direction={'row'} align={'center'} w="100%" >
                    <ProductCard id="1" name="XBank" image="https://i.postimg.cc/W1LYB2h6/xbank.png" type="Lending" isLive={true} link="Xbank"/>
                    <ProductCard id="4" name="AAVE" image="https://pbs.twimg.com/profile_images/1504129428204441601/B0G5SKbc_400x400.jpg" type="Lending" isLive={false} />
                    <ProductCard id="2" name="ZKLend" image="https://i.postimg.cc/WbcHwvqx/zklend.png" type="Lending" isLive={false} />
                    <ProductCard id="3" name="JediSwap" image="https://i.postimg.cc/wMXFG1RZ/jediswap.jpg" type="AMM" isLive={false}  />
                </HStack>
                <HStack direction={'row'} align={'center'} w="100%" >
                    <ProductCard id="5" name="AlphaRoad Finance" image="https://i.postimg.cc/76sqTLLv/alpharoad.jpg" type="AMM" isLive={false} /> 
                    <ProductCard id="6" name="ZKX" image="https://i.postimg.cc/43wgr3VK/zkx.jpg" type="Perpetual Swaps" isLive={false} />
                    <ProductCard id="7" name="MySwap" image="https://i.postimg.cc/4dmxPcq4/myswap.png" type="AMM" isLive={false} />
                </HStack>
            </VStack>
        </Box>
    ) : (
        <Text>Connect wallet to begin</Text>
    )}
    </Box>
  );
}

