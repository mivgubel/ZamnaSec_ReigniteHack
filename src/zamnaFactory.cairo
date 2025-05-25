/// Interface representing `HelloContract`.
/// This interface allows modification and retrieval of the contract balance.
use starknet::{ClassHash, ContractAddress};

#[starknet::interface]
pub trait IZamnaFactory<T> {
    fn deploy_invariants_contract(
        ref self: T, configurer: ContractAddress, asker: ContractAddress,
    ) -> ContractAddress;
    fn Change_Configurer_Role(
        ref self: T, _newConfigurer: ContractAddress, _invariantContract: ContractAddress,
    );
    fn Change_Asker_Role(
        ref self: T, _newAsker: ContractAddress, _invariantContract: ContractAddress,
    );
    fn allowInvariantsDeployer(ref self: T, _deployer: ContractAddress, _isAllowed: bool);
    fn allowAdminConfigurer(
        ref self: T,
        _invariantContract: ContractAddress,
        _configurer: ContractAddress,
        _isAllowed: bool,
    );
    /// Update the class hash of the Counter contract to deploy when creating a new counter
    fn update_zamnaEnforcer_class_hash(ref self: T, zEnforcer_class_hash: ClassHash);
    // fn setFeeToken(ref self: T, _newFeeToken: ContractAddress, _invariantContract:
// ContractAddress);
// fn setFeeAmount(ref self: T, _newAmount: u256, _invariantContract: ContractAddress);
}

//@note queda pendiente agregar todo lo referente al cobro de fees.
// Y  tambien los eventos necesarios.

/// Simple contract for managing balance.
#[starknet::contract]
pub mod zamnaFactory {
    //use openzeppelin_token::erc20::interface::IERC20;
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::syscalls::deploy_syscall;
    use starknet::{ClassHash, ContractAddress, get_caller_address};
    use zamnasec::ZamnaInvariantsEnforcer::{
        IZamnaInvariantsEnforcerDispatcher, IZamnaInvariantsEnforcerDispatcherTrait,
    };

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    //@note necesito registrar las address de los invariants contract que ha deployado cada usuario
    //para poder usarlos en la UI.
    // Leer los ID's de cada invariant que creo un usuario.

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[storage]
    struct Storage {
        //feeToken: IERC20,
        //feeAmount: u256,
        /// Store the class hash of the contract to deploy
        isInvariantContractActive: Map<ContractAddress, bool>,
        isAllowedDeployer: Map<ContractAddress, bool>,
        isAllowedAdminConfigurer: Map<(ContractAddress, ContractAddress), bool>,
        zEnforcer_class_hash: ClassHash,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    // constructor:
    #[constructor]
    fn constructor(ref self: ContractState, class_hash: ClassHash, owner: ContractAddress) {
        // Set the initial owner of the contract
        self.ownable.initializer(owner);
        self.zEnforcer_class_hash.write(class_hash);
        //self.feeAmount.write(_feeAmount);
    //self.feeToken.write(_feeToken);
    }

    #[abi(embed_v0)]
    impl ZamnaFactoryImpl of super::IZamnaFactory<ContractState> {
        // Deploy invariants Contract
        fn deploy_invariants_contract(
            ref self: ContractState, configurer: ContractAddress, asker: ContractAddress,
        ) -> ContractAddress {
            // Only Allowed deployer can deploy an invariant contract
            assert(self.isAllowedDeployer.read(get_caller_address()), 'Not Allowed Deployer');
            //let configurer: ContractAddress = 'configurer'.try_into().unwrap();
            // let asker: ContractAddress = 'asker'.try_into().unwrap();
            //let admin: ContractAddress = 'admin'.try_into().unwrap();
            let constructor_calldata = array![configurer.into(), asker.into()];

            // Contract deployment
            let (deployed_address, _) = deploy_syscall(
                self.zEnforcer_class_hash.read(), 0, constructor_calldata.span(), false,
            )
                .unwrap();
            // Register the contract deployed
            self.isInvariantContractActive.write(deployed_address, true);
            // allow deployer to change the configurer and asker addresses.
            self.isAllowedAdminConfigurer.write((deployed_address, get_caller_address()), true);
            // Address of the invariant deployer.
            deployed_address
        }

        fn Change_Configurer_Role(
            ref self: ContractState,
            _newConfigurer: ContractAddress,
            _invariantContract: ContractAddress,
        ) {
            // Validate only an allowed Admin Configurer can call this function.
            assert!(
                self.isAllowedAdminConfigurer.read((_invariantContract, get_caller_address())),
                "Not Allowed Admin configurer",
            );
            // validate invariant contract is active.
            assert(
                self.isInvariantContractActive.read(_invariantContract),
                'Invalid Invariant Contract',
            );
            // Create a dispacher
            let zenforcer = IZamnaInvariantsEnforcerDispatcher {
                contract_address: _invariantContract,
            };
            // Set the new configurer in ZamnaEnforcer contract.
            zenforcer.setConfigurer(_newConfigurer);
        }

        fn Change_Asker_Role(
            ref self: ContractState,
            _newAsker: ContractAddress,
            _invariantContract: ContractAddress,
        ) {
            // Validate only an allowed Admin Configurer can call this function.
            assert(
                self.isAllowedAdminConfigurer.read((_invariantContract, get_caller_address())),
                'Not Allowed Admin configurer',
            );
            // validate invariant contract is active.
            assert(
                self.isInvariantContractActive.read(_invariantContract),
                'Invalid Invariant Contract',
            );
            // Create a dispacher
            let zenforcer = IZamnaInvariantsEnforcerDispatcher {
                contract_address: _invariantContract,
            };
            // Set the new Asker in ZamnaEnforcer contract.
            zenforcer.setAsker(_newAsker);
        }

        fn allowInvariantsDeployer(
            ref self: ContractState, _deployer: ContractAddress, _isAllowed: bool,
        ) {
            // Only the Owner can call this function.
            self.ownable.assert_only_owner();
            self.isAllowedDeployer.write(_deployer, _isAllowed);
        }

        fn allowAdminConfigurer(
            ref self: ContractState,
            _invariantContract: ContractAddress,
            _configurer: ContractAddress,
            _isAllowed: bool,
        ) {
            // Only the Owner can call this function.
            self.ownable.assert_only_owner();
            self.isAllowedAdminConfigurer.write((_invariantContract, _configurer), _isAllowed);
        }
        /// Update the class hash of the Counter contract to deploy when creating a new counter
        fn update_zamnaEnforcer_class_hash(
            ref self: ContractState, zEnforcer_class_hash: ClassHash,
        ) {
            // This function can only be called by the owner
            self.ownable.assert_only_owner();
            self.zEnforcer_class_hash.write(zEnforcer_class_hash);
        }
    }
}
