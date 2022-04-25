import {
    Box,
    chakra,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Text
  } from "@chakra-ui/react";
  import {
    useStarknet,
    useStarknetCall,
    useStarknetInvoke,
  } from "@starknet-react/core";
  import React, { useCallback, useMemo, useState } from "react";
  import { toBN } from "starknet/dist/utils/number";
  import { bnToUint256, uint256ToBN } from "starknet/dist/utils/uint256";
  import Web3 from "web3";
  import BN from 'bn.js';
  import { useXbankDaiStrategyContract } from "~/hooks/token";
  
  function PoolBalanceOfUser({ account }: { account?: string }) {
    const { contract } = useXbankDaiStrategyContract();
    const { data, loading, error } = useStarknetCall({
      contract,
      method: "balance_of",
      args: account ? [account] : undefined,
    });
  
    const balanceBN = useMemo(() => {
        if (data && data.length > 0) {
          return uint256ToBN(data[0]);
        }
      }, [data]);

    const balance = useMemo(() => {
      if (data && data.length > 0) {
        let bnVersion = uint256ToBN(data[0])
        let res = Web3.utils.fromWei(bnVersion,'ether')
        return (res);
      }
    }, [data]);
  
    if (balance !== undefined) {
     return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {balance} DAI
        </StatNumber>
     </Stat>
    }
  
    if (loading) {
        return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            Loading...
        </StatNumber>
     </Stat>
    }
  
    if (error) {
        return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            ...
        </StatNumber>
     </Stat>
    }
  
    return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            Loading ...
        </StatNumber>
     </Stat>;
  }

  function PoolTVL({ account }: { account?: string }) {
    const { contract } = useXbankDaiStrategyContract();
    const { data, loading, error } = useStarknetCall({
      contract,
      method: "get_tvl",
      args: [],
    });
  
    const balance = useMemo(() => {
        if (data && data.length > 0) {
          let bnVersion = uint256ToBN(data[0])
          let res = Web3.utils.fromWei(bnVersion,'ether')
          return (res);
        }
    }, [data]);

    if (balance !== undefined) {
     return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {balance} DAI
        </StatNumber>
     </Stat>
    }
  
    if (loading) {
        return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            Loading...
        </StatNumber>
     </Stat>
    }
  
    if (error) {
        return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            Error getting TVL {error}
        </StatNumber>
     </Stat>
    }
  
    return  <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            TVL :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            Loading ...
        </StatNumber>
     </Stat>;
  }

  function PoolSuppliedBalance({ account }: { account?: string }) {
    const { contract } = useXbankDaiStrategyContract();
    const { data, loading, error } = useStarknetCall({
      contract,
      method: "get_supplied_balance",
      args: []
    });
    
    const balanceBN = useMemo(() => {
        if (data && data.length > 0) {
          return uint256ToBN(data[0]);
        }
      }, [data]);

    const balance = useMemo(() => {
      if (data && data.length > 0) {
        let bnVersion = uint256ToBN(data[0])
        let res = Web3.utils.fromWei(bnVersion,'ether')
        return (res);
      }
    }, [data]);
  
    if (balance !== undefined) {
     return  <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <StatLabel fontWeight={'medium'} isTruncated>
              Pool Supplied Balance :
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {balance} DAI
            </StatNumber>
        </Stat>
    }
  
    if (loading) {
        return  <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <StatLabel fontWeight={'medium'} isTruncated>
                Pool Supplied Balance :
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                Loading...
            </StatNumber>
        </Stat>
    }
  
    if (error) {
        return  <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <StatLabel fontWeight={'medium'} isTruncated>
                Pool Supplied Balance :
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                Unable to load...
            </StatNumber>
        </Stat>
    }
  
    return <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
            Pool Supplied Balance :
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            Loading...
        </StatNumber>
    </Stat>;
  }

  function PoolBorrowedBalance({ account }: { account?: string }) {
    const { contract } = useXbankDaiStrategyContract();
    const { data, loading, error } = useStarknetCall({
      contract,
      method: "get_borrowed_balance",
      args: []
    });
  
    const balanceBN = useMemo(() => {
        if (data && data.length > 0) {
          return uint256ToBN(data[0]);
        }
      }, [data]);

    const balance = useMemo(() => {
      if (data && data.length > 0) {
        let bnVersion = uint256ToBN(data[0])
        let res = Web3.utils.fromWei(bnVersion,'ether')
        return (res);
      }
    }, [data]);
  
    if (balance !== undefined) {
        return  <Stat
           px={{ base: 4, md: 8 }}
           py={'5'}
           shadow={'xl'}
           border={'1px solid'}
           borderColor={useColorModeValue('gray.800', 'gray.500')}
           rounded={'lg'}>
           <StatLabel fontWeight={'medium'} isTruncated>
                Pool Borrow Balance :
           </StatLabel>
           <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                {balance} DAI
           </StatNumber>
        </Stat>
       }
     
       if (loading) {
           return  <Stat
           px={{ base: 4, md: 8 }}
           py={'5'}
           shadow={'xl'}
           border={'1px solid'}
           borderColor={useColorModeValue('gray.800', 'gray.500')}
           rounded={'lg'}>
           <StatLabel fontWeight={'medium'} isTruncated>
               Pool Borrow Balance :
           </StatLabel>
           <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
               Loading...
           </StatNumber>
        </Stat>
       }
     
       if (error) {
           return  <Stat
           px={{ base: 4, md: 8 }}
           py={'5'}
           shadow={'xl'}
           border={'1px solid'}
           borderColor={useColorModeValue('gray.800', 'gray.500')}
           rounded={'lg'}>
           <StatLabel fontWeight={'medium'} isTruncated>
               Pool Borrow Balance :
           </StatLabel>
           <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
               Unable to load...
           </StatNumber>
        </Stat>
    }
  
    return  <Stat
       px={{ base: 4, md: 8 }}
       py={'5'}
       shadow={'xl'}
       border={'1px solid'}
       borderColor={useColorModeValue('gray.800', 'gray.500')}
       rounded={'lg'}>
       <StatLabel fontWeight={'medium'} isTruncated>
           Pool Borrow Balance :
       </StatLabel>
       <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
           Loading...
       </StatNumber>
    </Stat>


  }

  export function PoolCurrentView(): JSX.Element {
    const { account } = useStarknet();
  
    return (
      <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                <PoolTVL account={account} />
                <PoolSuppliedBalance account={account} />
                <PoolBorrowedBalance account={account} />
        </SimpleGrid>
      </Box>
    );
  }

  