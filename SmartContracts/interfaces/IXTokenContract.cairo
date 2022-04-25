# Declare this file as a StarkNet contract.
%lang starknet

from starkware.cairo.common.uint256 import Uint256

@contract_interface
namespace IXTokenContract:

    #Approve xBank-USDC
    func approve(spender: felt, amount: Uint256) -> (success: felt):
    end

    #Deposit xBank-USDC
    func mint(_mint_amount : Uint256) -> (actual_mint_amount : Uint256):
    end

    #Withdraw xBank-USDC
    func redeem_underlying(_underlying_token_amount : Uint256) -> ():
    end

    #Borrow USDC
    func borrow(_borrow_amount: Uint256) -> ():
    end

    #Repay USDC
    func repay(_repay_amount: Uint256) -> ():
    end

    #Borrow Balance xBank-USDC
    func get_borrow_balance_stored(_account: felt) -> (balance : Uint256):
    end

    #Get Supply Rate xBank-USDC
    func get_supply_rate() -> (supply_rate: Uint256):
    end

    #Get Borrow Rate xBank-USDC
    func get_borrow_rate() -> (borrow_rate : Uint256):
    end
    
end