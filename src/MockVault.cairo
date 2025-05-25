use starknet::ContractAddress;

#[starknet::interface]
pub trait IMockVault<T> {
    fn deposit(ref self: T, amount: u256);
    fn withdraw(ref self: T, shares: u256);
}

#[starknet::contract]
pub mod MockVault {
    //use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address};
    use zamnasec::ZamnaInvariantsEnforcer::{
        IZamnaInvariantsEnforcerDispatcher, IZamnaInvariantsEnforcerDispatcherTrait,
    };

    #[storage]
    struct Storage {
        balanceOf: Map<ContractAddress, u256>,
        totalSupply: u256,
        zEnforcer: ContractAddress,
        mockTokenBalance: u256,
    }

    // constructor:
    #[constructor]
    fn constructor(ref self: ContractState, _zEnforcer: ContractAddress) {
        self.zEnforcer.write(_zEnforcer);
        self.mockTokenBalance.write(1000000);
    }

    #[abi(embed_v0)]
    impl MockVaultyImpl of super::IMockVault<ContractState> {
        // allow user to deposit tokens and get shares.
        // implement the Zamna Invariant Enforcer call.
        fn deposit(ref self: ContractState, amount: u256) {
            let invariantID: u32 = 1;
            let mut shares: u256 = 0;
            let total_supply = self.totalSupply.read();
            let caller: ContractAddress = get_caller_address();

            if total_supply == 0 {
                shares = amount;
            } else {
                shares = (amount * total_supply) / self.mockTokenBalance.read();
            }
            // se mintean las shares al caller.
            self._mint(caller, shares);

            let zEnforcer = IZamnaInvariantsEnforcerDispatcher {
                contract_address: self.zEnforcer.read(),
            };
            zEnforcer.Enforce_Invariant_Address(invariantID, caller);
        }
        // Simulate Allow user to withdraw tokens for shares
        fn withdraw(ref self: ContractState, shares: u256) {
            let mut amount: u256 = 0;
            let caller = get_caller_address();
            // calculate amount of token  the user will get
            amount = (shares * self.mockTokenBalance.read()) / self.totalSupply.read();
            // burn the user's shares
            self._burn(caller, shares);
            // transfer tokens simulate...
        }
    }

    #[generate_trait]
    pub impl Internal of InternalTrait {
        // mint shares to user "to"
        fn _mint(ref self: ContractState, to: ContractAddress, shares: u256) {
            let previous_supply: u256 = self.totalSupply.read();
            let new_supply = previous_supply + shares;
            self.totalSupply.write(new_supply);
            let previous_userBalance = self.balanceOf.read(to);
            self.balanceOf.write(to, previous_userBalance + shares);
        }
        // Burn user shares from "to"
        fn _burn(ref self: ContractState, to: ContractAddress, shares: u256) {
            let new_supply = self.totalSupply.read() - shares;
            self.totalSupply.write(new_supply);
            let new_userBalanceShares = self.balanceOf.read(to) - shares;
            self.balanceOf.write(to, new_userBalanceShares);
        }
    }
}
