%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.bool import TRUE

from starkware.starknet.common.syscalls import (
    get_caller_address,
    get_contract_address
)

from starkware.cairo.common.uint256 import (
    Uint256, uint256_add, uint256_sub, uint256_le, uint256_lt, uint256_check , uint256_unsigned_div_rem , uint256_not , uint256_mul
)

from starkware.cairo.common.alloc import (
    alloc
)

from lib.openzeppelin.security.safemath import (
    uint256_checked_mul,
    uint256_checked_add,
    uint256_checked_div_rem,
    uint256_checked_sub_le,
    uint256_checked_sub_lt
)

from starkware.cairo.common.math import (
    assert_not_zero,
    assert_lt
 )

from lib.openzeppelin.token.erc20.interfaces.IERC20 import (
    IERC20
)

from lib.openzeppelin.access.ownable import (
    Ownable_initializer,
    Ownable_only_owner,
    Ownable_transfer_ownership
)

from lib.openzeppelin.security.pausable import (
    Pausable_paused,
    Pausable_pause,
    Pausable_unpause,
    Pausable_when_not_paused
)

from lib.openzeppelin.upgrades.library import (
    Proxy_initializer,
    Proxy_only_admin,
    Proxy_set_implementation,
)

from interfaces.IXTokenContract import IXTokenContract
from interfaces.IXControllerContract import IXControllerContract

#------------Constants--------------------

# USDC
const USDC = 0x000cf1f2891ce07dfff3fa1828b5c4cc01ccc603876b913d9e6fc89bad276ba7

#Contract addresses
const XTokenContractAddress = 0x04ffdb1f2f51afa786bb30d547e5584ffba69e89f204973c03a98c58b9cf961f
const XControllerContractAddress = 0x047cd213102d3c063b936c033a6ab2ece8e2973c41f0d87313b80be0e0b22aaf

const COLLETRAL_FACTOR = 800
const COLLETRAL_FACTOR_MAX = 1000

#1 USDC
const LEVERAGE_MIN_BALANCE = 1000000000000000000 

#-----------------------------------------------




#-------------Storage Variables-------------

@storage_var
func user_share_balance(user: felt, token: felt) -> (amount: Uint256):
end

@storage_var
func total_shares(token: felt) -> (amount: Uint256):
end

#-----------------------------------------------

@constructor
func constructor{
        syscall_ptr: felt*, 
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(
        owner: felt
    ):
    Ownable_initializer(owner)
    approve_protocol_tokens()
    return ()
end


#
# Getters
#

@view
func balance_of{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(
        user_address: felt
    ) -> (res: Uint256):
    alloc_locals

    assert_not_zero(user_address)

    let (share_of_user) = user_share_balance.read(user_address, USDC)
    let (total_asset_amount) = get_total_asset_amount()
    let (total_shares_amount) = total_shares.read(USDC)

    # Calculate balance = total amount * ( user share / total shares )
    let (user_calculated_amount,_) = uint256_mul(total_asset_amount,share_of_user)
    let (balance_of_user,_) = uint256_unsigned_div_rem(user_calculated_amount,total_shares_amount)

    return (balance_of_user)
end


@view
func get_redeemable_amount{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    alloc_locals

    let (local supplied) = get_supplied_balance()
    let (borrowed) = get_borrowed_balance()

    # redeemable amount = supplied - ( (borrow * COL_MAX) / COL )
    let (borrowed_mul,_) = uint256_mul(borrowed,Uint256(COLLETRAL_FACTOR_MAX,0))
    let (borrow_rate_colletral_factored,_) = uint256_unsigned_div_rem(borrowed_mul,Uint256(COLLETRAL_FACTOR,0))
    let (redeemable) = uint256_sub(supplied,borrow_rate_colletral_factored)

    # safe redeemable amount = amount * 0.99 (%99)
    let (nine_nine,_) = uint256_mul(redeemable,Uint256(99,0))
    let (safeRedeemable,_) = uint256_unsigned_div_rem(nine_nine,Uint256(100,0))

    return (safeRedeemable)
end

@view
func get_unlevereged_supply_balance{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    alloc_locals
    let (supplied) = get_supplied_balance()
    let (borrowed) = get_borrowed_balance()
    let (unlevereged_supply) = uint256_sub(supplied,borrowed)
    return (unlevereged_supply)
end


@view 
func get_borrowed_balance{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    let (this_contract_address) = get_contract_address()
    let (balance) = IXTokenContract.get_borrow_balance_stored(contract_address=XTokenContractAddress, _account=this_contract_address)
    return (balance)
end

@view 
func get_supplied_balance{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    alloc_locals
    let (this_contract_address) = get_contract_address()
    let (balance) = IERC20.balanceOf(contract_address=XTokenContractAddress, account=this_contract_address)
    let (balance_divided,balance_reminder) = uint256_unsigned_div_rem(balance,Uint256(50, 0)) 
    return (balance_divided)
end

@view 
func get_asset_balance{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    let (this_contract_address) = get_contract_address()
    let (balance : Uint256) = IERC20.balanceOf(contract_address=USDC, account=this_contract_address)
    return (balance)
end

@view 
func get_total_asset_amount{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    alloc_locals
    let (supplied) = get_supplied_balance()
    let (borrowed) = get_borrowed_balance()
    let (asset_amount_in_wallet) = get_asset_balance()

    # Total asset = (Supplied - Borrowed) + Wallet Scrubs
    let (net_amount_inside_protocol) = uint256_sub(supplied,borrowed)
    let (total_amount,_) = uint256_add(net_amount_inside_protocol,asset_amount_in_wallet)
    
    return (total_amount)
end

@view 
func get_tvl{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (res: Uint256) :
    alloc_locals
    let (supplied) = get_supplied_balance()
    let (borrowed) = get_borrowed_balance()
    let (asset_amount_in_wallet) = get_asset_balance()

    # Total asset = (Supplied - Borrowed) + Wallet Scrubs
    let (total_locked,_) = uint256_add(supplied,borrowed)
    let (total_locked_plus_asset,_) = uint256_add(total_locked,asset_amount_in_wallet)
    
    return (total_locked_plus_asset)
end

#-------------------



#
# Externals
#


func approve_protocol_tokens{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }():
    let (infinite:Uint256) = uint256_not(Uint256(0, 0))
    IERC20.approve(contract_address=USDC,spender=XTokenContractAddress,amount=infinite)
    IERC20.approve(contract_address=XTokenContractAddress,spender=XTokenContractAddress,amount=infinite)
    let (tokenPtr) = alloc()
    assert [tokenPtr] = XTokenContractAddress
    IXControllerContract.enter_markets(contract_address=XControllerContractAddress,_index=0,_xtokens_len=1,_xtokens=tokenPtr)
    return ()
end

@external
func deposit{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(amount: Uint256) -> (success: felt):
    alloc_locals
    Pausable_when_not_paused()

    assert_not_zero(USDC)
    uint256_check(amount)

    let (caller_address) = get_caller_address()
    let (this_contract_address) = get_contract_address()
    IERC20.transferFrom(contract_address = USDC, sender = caller_address, recipient = this_contract_address, amount = amount)
    
    # Increase User Shares
    let (share_of_deposit_user) = user_share_balance.read(caller_address, USDC)
    let (new_depositor_shares,_) = uint256_add(share_of_deposit_user, amount)
    user_share_balance.write(caller_address, USDC, new_depositor_shares)
    
    #Increase Total Shares
    let (local_total_shares) = total_shares.read(USDC)
    let (new_total_shares,_) = uint256_add(local_total_shares,amount)
    total_shares.write(USDC,new_total_shares)

    leverage_to_max()
    
    return (TRUE)
end


func withdraw_all{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (success: felt) :
    alloc_locals
    Pausable_when_not_paused()

    let (caller_address) = get_caller_address()
    let (balance_of_user) = balance_of(user_address = caller_address)
    let (is_balance_not_zero) = uint256_lt( Uint256(0,0) , balance_of_user )
    assert_not_zero(is_balance_not_zero)
    withdraw_amount(amount=balance_of_user)
    return (TRUE)
end

@external
func withdraw_amount{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }( amount : Uint256 ) -> (success: felt) :
    alloc_locals
    Pausable_when_not_paused()

    uint256_check(amount)

    let (caller_address) = get_caller_address()
    let (total_shares_amount) = total_shares.read(USDC)
    let (total_asset_amount) = get_total_asset_amount()
    let (user_share) = user_share_balance.read(caller_address,USDC)
    let (balance_of_user) = balance_of(user_address = caller_address)

    # Check if amount is not zero   
    let (is_amount_not_zero) = uint256_lt( Uint256(0,0) , amount )
    with_attr error_message("amount is zero"):
        assert_not_zero(is_amount_not_zero)
    end
    

    # Check if the amount is less than user's actual balance
    let (is_amount_less_or_equal_to_balance) = uint256_le(amount,balance_of_user)
    with_attr error_message("amount is bigger then user balance"):
        assert_not_zero(is_amount_less_or_equal_to_balance)
    end
    

    # Check if we have the amount already in the wallet
    let (asset_balance) = get_asset_balance()
    let (enough_cash_to_send) = uint256_le(amount,asset_balance)
    if enough_cash_to_send != 0 :
        # We already have the amount on wallet so send the amount to user
        
        # Share of the amount is equal to this formula
        # amount / assetBalanceOfUser = X / user shares
        # Cross product to find the X
        let (cross_multiply,_) = uint256_mul(amount,user_share)
        let (result_share,_) = uint256_unsigned_div_rem(cross_multiply,balance_of_user)
        
        let (is_calculated_share_correct) = uint256_le(result_share,user_share)
        with_attr error_message("calculated shares are not correct"):
            assert_not_zero(is_calculated_share_correct)
        end

        let (new_user_share) = uint256_sub(user_share, result_share)
        user_share_balance.write(caller_address, USDC, new_user_share)

        IERC20.transfer(contract_address=USDC, recipient=caller_address, amount=amount)

        #Todo:// double check Security

        return (TRUE)
        
    else :
        #Calculate the amount to deleverage
        let (amount_left) = uint256_sub(amount,asset_balance)
        let (supplied) = get_supplied_balance()
        let (amount_to_release) = uint256_sub(supplied,amount_left)
        
        # Deleverage to amount & redeem the amount left
        deleverage_to_amount(amount=amount_to_release)
        redeem_underlying(amount=amount_left)
        
        # Check if deleverage and redeem is actually worked
        let (asset_balance_after_redeem) = get_asset_balance()
        let (enough_cash_to_send_after_redeem) = uint256_le(amount,asset_balance_after_redeem)
        with_attr error_message("after redeem still not enough cash"):
            assert_not_zero(enough_cash_to_send_after_redeem)
        end
        

        # Share of the amount is equal to this formula
        # amount / assetBalanceOfUser = X / user shares
        # Cross product to find the X
        let (cross_multiply,_) = uint256_mul(amount,user_share)
        let (result_share,_) = uint256_unsigned_div_rem(cross_multiply,balance_of_user)
        
        let (is_calculated_share_correct) = uint256_le(result_share,user_share)
        with_attr error_message("calculated shares are not correct"):
            assert_not_zero(is_calculated_share_correct)
        end

        let (new_user_share) = uint256_sub(user_share, result_share)
        user_share_balance.write(caller_address, USDC, new_user_share)

        IERC20.transfer(contract_address=USDC, recipient=caller_address, amount=amount)

        return (TRUE)
    end
end


func leverage_to_max{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }() -> (success: felt) :
    alloc_locals
    Pausable_when_not_paused()
    
    let (local base_curr_balance) = get_asset_balance()  
    let (local is_leverage_amount_not_min) = uint256_lt(Uint256(LEVERAGE_MIN_BALANCE,0),base_curr_balance)

    #If it hasn't reach to min amount yet then roll debt again
    if is_leverage_amount_not_min != 0 :
        #Lend
        deposit_to_protocol(amount=base_curr_balance)

        # (Amount * Col)
        let (local amount_and_col,_) = uint256_mul(base_curr_balance, Uint256(COLLETRAL_FACTOR,0))
        # ( (Amount * Col) / Col Max ) -> Which is Amount * 0.8
        let (local borrow_amount,_) = uint256_unsigned_div_rem( amount_and_col , Uint256(COLLETRAL_FACTOR_MAX,0) )

        # Safe Amount for preventing fail (%99)
        let (nine_nine,_) = uint256_mul(borrow_amount,Uint256(99,0))
        let (safe_borrow_amount,_) = uint256_unsigned_div_rem(nine_nine,Uint256(100,0))

        #Borrow
        borrow_from_protocol(amount=safe_borrow_amount)

        #Do it until
        leverage_to_max()

        return (TRUE)

    else :

        return (TRUE)

    end

end


func deleverage_to_amount{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }( amount : Uint256 ) -> (success: felt) :
    alloc_locals
    Pausable_when_not_paused()

    let (local supplied) = get_supplied_balance()
    let (local unlevereged_supply) = get_unlevereged_supply_balance()

    # If we have the amount then no need to unroll it, we already have it
    let (is_unlevereged_supply_le_amount) = uint256_le(unlevereged_supply,amount)

    if is_unlevereged_supply_le_amount != 0 :
        let (redeemable_amount) = get_redeemable_amount()
        # Start deleveraging
        redeem_and_repay(supplied,amount,redeemable_amount)
        return (TRUE)
    end

    return (TRUE)
    
end



func redeem_and_repay{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }( 
        supplied : Uint256,
        _supplyAmount : Uint256,
        _redeemAndRepay : Uint256
     ) -> (success: felt) :
    alloc_locals
    Pausable_when_not_paused()

    # Check if supply > supplyAmount  and redeemand repay until we reach the target
    let (is_amount_le_supplied) = uint256_lt(_supplyAmount,supplied)

    if is_amount_le_supplied != 0 :

        let (supplied_redeemable_amount) = uint256_sub(supplied , _redeemAndRepay)
        let (is_exceeding_supply_amount) = uint256_lt(supplied_redeemable_amount , _supplyAmount)
        
        if is_exceeding_supply_amount != 0:
            # If redeem amount is exceeding target supply then redeem the rest
            let (redeemable_amount) = uint256_sub(supplied,_supplyAmount)

            # Redeem target amount and repay debt
            redeem_underlying(redeemable_amount)
            repay_debt(redeemable_amount)

            # Calculate new amount and recursive call itself (like a while loop)
            let (local new_supplied) = uint256_sub(supplied,redeemable_amount)
            let (multiplied_redeemable_amount,_) = uint256_mul(redeemable_amount,Uint256(COLLETRAL_FACTOR_MAX,0))
            let (calculated_new_redeemable_amount,_) = uint256_unsigned_div_rem(multiplied_redeemable_amount,Uint256(COLLETRAL_FACTOR,0))
            redeem_and_repay(new_supplied,_supplyAmount,calculated_new_redeemable_amount)

            return (TRUE)
        end 

        # Redeem target amount and repay debt
        redeem_underlying(_redeemAndRepay)
        repay_debt(_redeemAndRepay)

        # Calculate new amount and recursive call itself (like a while loop)
        let (local new_supplied) = uint256_sub(supplied,_redeemAndRepay)
        let (multiplied_redeemable_amount,_) = uint256_mul(_redeemAndRepay,Uint256(COLLETRAL_FACTOR_MAX,0))
        let (calculated_new_redeemable_amount,_) = uint256_unsigned_div_rem(multiplied_redeemable_amount,Uint256(COLLETRAL_FACTOR,0))
        redeem_and_repay(new_supplied,_supplyAmount,calculated_new_redeemable_amount)

        return (TRUE)

    end

    return (TRUE)
    
end


@external
func pause{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }():
    Ownable_only_owner()
    Pausable_pause()
    return ()
end

@external
func unpause{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }():
    Ownable_only_owner()
    Pausable_unpause()
    return ()
end

#
# External Protocol functions
#


func deposit_to_protocol{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(amount: Uint256) -> (success: felt):
    Pausable_when_not_paused()
    uint256_check(amount)
    IXTokenContract.mint(contract_address=XTokenContractAddress,_mint_amount=amount)
    return (TRUE)
end


func borrow_from_protocol{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(amount: Uint256) -> (success: felt) :
    Pausable_when_not_paused()
    uint256_check(amount)
    IXTokenContract.borrow(contract_address=XTokenContractAddress,_borrow_amount=amount)
    return (TRUE)
end


func repay_debt{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(amount: Uint256) -> (success: felt):
    Pausable_when_not_paused()
    uint256_check(amount)
    IXTokenContract.repay(contract_address=XTokenContractAddress,_repay_amount=amount)
    return (TRUE)
end


func redeem_underlying{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(
        amount: Uint256
    ):
    Pausable_when_not_paused()
    uint256_check(amount)
    IXTokenContract.redeem_underlying(contract_address=XTokenContractAddress,_underlying_token_amount=amount)
    return ()
end

@external
func transfer_ownership{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(
        new_owner: felt
    ):
    Ownable_only_owner()
    Ownable_transfer_ownership(new_owner=new_owner)
    return ()
end



