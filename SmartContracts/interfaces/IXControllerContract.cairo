# Declare this file as a StarkNet contract.
%lang starknet

from starkware.cairo.common.uint256 import Uint256

@contract_interface
namespace IXControllerContract:

    #Enable tokens as colletral
    func enter_markets(_index : felt,_xtokens_len : felt,_xtokens : felt*) -> (success_len : felt,success : felt*):
    end

    #Disable as colletral
    func exit_market(_xtoken : felt) -> (success : felt):
    end
    

end