import {
  Box,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark
} from "@chakra-ui/react";
import {
  UseContractArgs,
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import React, { useCallback, useMemo, useState } from "react";
import { toBN } from "starknet/dist/utils/number";
import { bnToUint256, uint256ToBN } from "starknet/dist/utils/uint256";
import { useDaiTokenContract,useXbankDaiStrategyContract } from "~/hooks/token";
import Web3 from "web3";
import BN from 'bn.js';

function UserTokenBalance({ account }: { account?: string }) {
  const { contract } = useDaiTokenContract();
  const { data, loading, error } = useStarknetCall({
    contract,
    method: "balanceOf",
    args: account ? [account] : undefined,
  });

  const balance = useMemo(() => {
    if (data && data.length > 0) {
      let bnVersion = uint256ToBN(data[0])
      let res = Web3.utils.fromWei(bnVersion,'ether')
      return res;
    }
  }, [data]);

  if (balance !== undefined) {
    return <Text>Wallet DAI balance: {balance} DAI</Text>;
  }

  if (loading) {
    return <Text>Loading balance...</Text>;
  }

  if (error) {
    return <Text>Could not load balance: {error}</Text>;
  }

  return <Text></Text>;
}




function UserDepositToken({ account , balanceBn }: { account?: string , balanceBn? : BN }) {

  const [amount, setAmount] = useState("0");
  const [amountError, setAmountError] = useState<string | undefined>();

  const { contract } = useXbankDaiStrategyContract();
  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: "deposit",
  });

  const [sliderValue, setSliderValue] = useState(50)

  const updateAmount = useCallback(
    (newAmount: string) => {
      setAmount(newAmount);
      try {
        toBN(newAmount);
      } catch (err) {
        setAmountError("Please input a valid number");
      }
    },
    [setAmount]
  );

  const onDeposit = useCallback(() => {
    reset();
    if (account && !amountError && contract) {
      let bnAmount = toBN(amount)
      const amountBn = bnToUint256(bnAmount);
      invoke({ args: [amountBn] });
    }
  }, [account, amount, amountError, invoke, reset]);


  const onSliderChanged = useCallback((val) => {
      setSliderValue(val)
      let wAmount = balanceBn?.mul(toBN(val)).div(toBN(100))
      if(wAmount != null){
          updateAmount(wAmount.toString())
      }
  }, [account, amount, amountError, invoke, reset]);

 

  return (
    <Box>
      <Box my={4}>
          <Slider aria-label='slider-ex-6' onChange={(val) => {
              onSliderChanged(val)
          }}>
          <SliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>
              0%
          </SliderMark>
          <SliderMark value={25} mt='1' ml='-2.5' fontSize='sm'>
              25%
          </SliderMark>
          <SliderMark value={50} mt='1' ml='-2.5' fontSize='sm'>
              50%
          </SliderMark>
          <SliderMark value={75} mt='1' ml='-2.5' fontSize='sm'>
              75%
          </SliderMark>
          <SliderMark value={100} mt='1' ml='-2.5' fontSize='sm'>
              100%
          </SliderMark>
          <SliderTrack>
              <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
          </Slider>
      </Box>

      <Box my={4}>
        <Text>Amount</Text>
        <NumberInput defaultValue={0} value={amount} >
          <NumberInputField onChange={(evt) => updateAmount(evt.target.value)} />
        </NumberInput>
        {amountError && <Text color="red">{amountError}</Text>}
      </Box>


      <Button colorScheme='blue' my={4} marginRight={4} onClick={onDeposit} disabled={loading}>
        Deposit
      </Button>
      
      {error && <Text color="red">{error}</Text>}
    </Box>
  );
}



export function PoolDepositUserView(): JSX.Element {
  const { account } = useStarknet();

  const { contract } = useDaiTokenContract();
  const { data } = useStarknetCall({
      contract,
      method: "balanceOf",
      args: account ? [account] : undefined,
  });

  const balanceBn = useMemo(() => {
      if (data && data.length > 0) {
        let bnVersion = uint256ToBN(data[0])
        return bnVersion;
      }
  }, [data]);

  return (
    <Box borderWidth={1} p={10} borderRadius={10} w="400px">
      {account ? (
        <Box>
          <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            Deposit
          </Box>
          <Box>
            <UserTokenBalance account={account} />
          </Box>
          <Box>
            <UserDepositToken account={account} balanceBn={balanceBn} />
          </Box>
        </Box>
      ) : (
        <Text>Connect wallet to begin</Text>
      )}
    </Box>
  );
}
