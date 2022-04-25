import {
  Box,
  Button,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Center,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import React, { useCallback, useMemo, useState } from "react";
import { toBN } from "starknet/dist/utils/number";
import { bnToUint256, uint256ToBN } from "starknet/dist/utils/uint256";
import { useDaiTokenContract,useXbankDaiStrategyContract } from "~/hooks/token";
import Web3 from "web3";
import { PoolWithdrawUserView } from "./PoolWithdrawUserView";
import { PoolDepositUserView } from "./PoolDepositUserView";


export function PoolUserView(): JSX.Element {
  const { account } = useStarknet();

  const { contract } = useDaiTokenContract();
  const { data } = useStarknetCall({
      contract,
      method: "allowence",
      args: [account,contract?.address],
  });

  const allowanceBn = useMemo(() => {
    if (data && data.length > 0) {
      let bnVersion = uint256ToBN(data[0])
      return bnVersion;
    }
}, [data]);

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: "approve",
  });

  const onApprove = useCallback(() => {
    reset();
    if (contract) {
      let bnAmount = toBN("100000000000000000000000000000")
      const amountBn = bnToUint256(bnAmount);
      invoke({ args: ["0x02f4d29b173e7edda25bce02f71686f6a753b3cd16c6f7473a446ccab51d8e87",amountBn] });
    }
  }, [account, invoke, reset]);



  return (
    <Box w="100%">
      {account ? (
          
        <HStack borderWidth={0} p={10} borderRadius={10} w="100%" alignContent={"center"}>
        <Button colorScheme='blue' my={4} marginRight={4} onClick={onApprove} alignContent={"center"} alignItems={"center"}>
          Approve DAI
        </Button>
        <Center w="50%">
          <PoolWithdrawUserView/>
        </Center>
        <Center w="50%">
          <PoolDepositUserView/>
        </Center>
        </HStack>
      ) : (
        <Text>Connect wallet to begin</Text>
      )}
    </Box>
  );
}
