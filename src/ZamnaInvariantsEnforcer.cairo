use starknet::ContractAddress;

#[starknet::interface]
pub trait IZamnaInvariantsEnforcer<T> {
    // Create Invariants
    fn Create_Invariant_Uint(
        ref self: T,
        _name: ByteArray,
        _contract: ContractAddress, // asker
        _type: u8, // invariant type
        _rule: u8, // invarian rule
        _invariantValue: u256,
    );
    fn Create_Invariant_Address(
        ref self: T,
        _name: ByteArray,
        _contract: ContractAddress, // asker
        _type: u8, // invariant type
        _rule: u8, // invarian rule
        _invariantValue: ContractAddress,
    );
    // update invariants
    fn Update_Invariant_Uint(
        ref self: T,
        _invariantID: u32,
        _name: ByteArray,
        _contract: ContractAddress,
        _rule: u8,
        _invariantValue: u256,
    );
    fn Update_Invariant_Address(
        ref self: T,
        _invariantID: u32,
        _name: ByteArray,
        _contract: ContractAddress,
        _rule: u8,
        _invariantValue: ContractAddress,
    );
    // Enforce Invariants
    fn Enforce_Invariant_Uint(ref self: T, _invariantID: u32, _contractValue: u256);
    fn Enforce_Invariant_Address(ref self: T, _invariantID: u32, _contractValue: ContractAddress);
    // disable invariants
    fn Disable_Invariant(ref self: T, _invariantID: u32, isEnable: bool);
    fn get_Invariant_Status(self: @T, _invariantID: u32) -> bool;
    // Get invariants Data
    fn getInvariant_Uint(self: @T, _invariantID: u32) -> (ByteArray, ContractAddress, u8, u8, u256);
    fn getInvariant_Address(
        self: @T, _invariantID: u32,
    ) -> (ByteArray, ContractAddress, u8, u8, ContractAddress);
    fn getInvariantCount(self: @T) -> u32;
    // Admin Functions
    // Function to Change Configurer Role
    fn setConfigurer(ref self: T, _newConfigurer: ContractAddress);
    // Function to Change Asker Role
    fn setAsker(ref self: T, _newAsker: ContractAddress);
    // fn setFeetoken(ref self: T, _newFeeToken: ContractAddress);
// fn setFeeAmount(ref self: T, _newFeeAmount: u256);
}

// Por ahora no agregaremos todas las invariants como int y bytes32
// Y no cobraremos un fee por el momento, para sacar un MVP gratuito que nos permita iterar y
// mejorar la idea.

///@note falta agregar emitir eventos

pub const INVARIANT_CONFIGURER: felt252 = selector!("INVARIANT_CONFIGURER");
pub const INVARIANT_ASKER: felt252 = selector!("INVARIANT_ASKER");


#[starknet::contract]
pub mod ZamnaInvariantsEnforcer {
    use openzeppelin_access::accesscontrol::{AccessControlComponent, DEFAULT_ADMIN_ROLE};
    //use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePathEntry,
        StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address};
    use super::{INVARIANT_ASKER, INVARIANT_CONFIGURER};

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // SRC5
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct InvariantUint {
        name: ByteArray,
        asker: ContractAddress,
        invariantType: u8,
        rule: u8,
        uintValue: u256,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct InvariantAddress {
        name: ByteArray,
        asker: ContractAddress,
        invariantType: u8,
        rule: u8,
        addValue: ContractAddress,
    }

    //@note tengo que guardar un mapping que registre el ID al usuario que lo creo, para poder
    //llenar la UI de un user.

    #[storage]
    struct Storage {
        configurer: ContractAddress,
        asker: ContractAddress,
        countInvariantID: u32,
        isInvariantActive: Map<u32, bool>,
        invariants_uint: Map<u32, InvariantUint>,
        invariants_address: Map<u32, InvariantAddress>,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, _configurer: ContractAddress, _asker: ContractAddress) {
        self.configurer.write(_configurer);
        self.asker.write(_asker);
        //Invariant ID inicia en 1
        self.countInvariantID.write(1);
        // AccessControl-related initialization
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, get_caller_address());
        self.accesscontrol._grant_role(INVARIANT_CONFIGURER, _configurer);
        self.accesscontrol._grant_role(INVARIANT_ASKER, _asker);
    }

    #[abi(embed_v0)]
    impl ZamnaInvariantsEnforcerImpl of super::IZamnaInvariantsEnforcer<ContractState> {
        // Create Invariants Type Uint.
        fn Create_Invariant_Uint(
            ref self: ContractState,
            _name: ByteArray, // implementar ByteArray
            _contract: ContractAddress,
            _type: u8,
            _rule: u8,
            _invariantValue: u256,
        ) {
            //Only invariant configurer can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_CONFIGURER);
            let inv = InvariantUint {
                name: _name,
                asker: _contract,
                invariantType: _type,
                rule: _rule,
                uintValue: _invariantValue,
            };
            // Register the invariant en el mapping correspondiente.
            let invariantID = self.countInvariantID.read();
            self.invariants_uint.entry(invariantID).write(inv);
            // actualizar el mapping de activado para dejar la invariant activada.
            self.isInvariantActive.entry(invariantID).write(true);
            // Incrementamos el Invariants ID counter
            self.countInvariantID.write(invariantID + 1);
        }
        // Create Invariants Type Address.
        fn Create_Invariant_Address(
            ref self: ContractState,
            _name: ByteArray, // implementar ByteArray
            _contract: ContractAddress,
            _type: u8,
            _rule: u8,
            _invariantValue: ContractAddress,
        ) {
            //Only invariant configurer can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_CONFIGURER);
            let inv = InvariantAddress {
                name: _name,
                asker: _contract,
                invariantType: _type,
                rule: _rule,
                addValue: _invariantValue,
            };
            // Register the invariant en el mapping correspondiente.
            let invariantID = self.countInvariantID.read();
            self.invariants_address.entry(invariantID).write(inv);
            // actualizar el mapping de activado para dejar la invariant activada.
            self.isInvariantActive.entry(invariantID).write(true);
            // Incrementamos el Invariants ID counter, aunque son 2 mapping separados
            self.countInvariantID.write(invariantID + 1);
        }

        // Update invariants type Uint
        fn Update_Invariant_Uint(
            ref self: ContractState,
            _invariantID: u32,
            _name: ByteArray,
            _contract: ContractAddress,
            _rule: u8,
            _invariantValue: u256,
        ) {
            //Only invariant configurer can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_CONFIGURER);
            // Check invariant is inactive so can be updated.
            assert(_invariantID < self.countInvariantID.read(), 'Invalid Invariant ID');
            assert(
                !self.isInvariantActive.entry(_invariantID).read(), 'Invariant Should be Disable.',
            );

            let inv = InvariantUint {
                name: _name,
                asker: _contract,
                invariantType: 1, // uint type
                rule: _rule,
                uintValue: _invariantValue,
            };
            // Register the invariant in the mapping.
            self.invariants_uint.entry(_invariantID).write(inv);
            // set the invariant as active again.
            self.isInvariantActive.entry(_invariantID).write(true);
        }
        // Update invariants type Address
        fn Update_Invariant_Address(
            ref self: ContractState,
            _invariantID: u32,
            _name: ByteArray,
            _contract: ContractAddress,
            _rule: u8,
            _invariantValue: ContractAddress,
        ) {
            //Only invariant configurer can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_CONFIGURER);
            assert(_invariantID < self.countInvariantID.read(), 'Invalid Invariant ID');
            // Check invariant is inactive so can be updated.
            assert(
                !self.isInvariantActive.entry(_invariantID).read(), 'Invariant Should be Disable.',
            );

            let inv = InvariantAddress {
                name: _name,
                asker: _contract,
                invariantType: 3, // address type
                rule: _rule,
                addValue: _invariantValue,
            };
            // Register the invariant in the mapping.
            self.invariants_address.entry(_invariantID).write(inv);
            // set the invariant as active again.
            self.isInvariantActive.entry(_invariantID).write(true);
        }

        // Enforce Uint Invariants
        fn Enforce_Invariant_Uint(
            ref self: ContractState, _invariantID: u32, _contractValue: u256,
        ) {
            //Only invariant asker can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_ASKER);
            // Invariant should be active.
            assert(self.isInvariantActive.entry(_invariantID).read(), 'Invalid Invariant ID.');
            // read the invariant data
            let inv = self.invariants_uint.entry(_invariantID).read();
            // Validate is an invariant type uint
            assert(inv.invariantType == 1, 'Invariant is not type Uint');
            // Note: falta agregar el cobro del fee para futuras versiones.
            // Rules: 1: "<", 2: "<=", 3: "==", 4: ">=", 5: ">", 6: !=
            if inv.rule == 1 {
                // el valor tiene que ser menor si no revierte la tx
                assert(_contractValue < inv.uintValue, 'Hack Reverted: Invariant Broken');
            } else if inv.rule == 2 {
                assert(_contractValue <= inv.uintValue, 'Hack Reverted: Invariant Broken');
            } else if inv.rule == 3 {
                assert(_contractValue == inv.uintValue, 'Hack Reverted: Invariant Broken');
            } else if inv.rule == 4 {
                assert(_contractValue >= inv.uintValue, 'Hack Reverted: Invariant Broken');
            } else if inv.rule == 5 {
                // rule = 5
                assert(_contractValue > inv.uintValue, 'Hack Reverted: Invariant Broken');
            }
        }
        // Enforce Address Invariants
        fn Enforce_Invariant_Address(
            ref self: ContractState, _invariantID: u32, _contractValue: ContractAddress,
        ) {
            //Only invariant asker can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_ASKER);
            // Invariant should be active.
            assert(self.isInvariantActive.entry(_invariantID).read(), 'Invalid Invariant ID.');
            // read the invariant data
            let inv = self.invariants_address.entry(_invariantID).read();
            //@note falta agregar el cobro del fee para futuras versiones.
            //Validar que es el tipo correcto (address).
            assert(inv.invariantType == 3, 'Invariant is not type Address');
            // Rules: 3: "==", 6: "!="
            if inv.rule == 3 {
                // la address enviada por el contrato tiene que ser igual a la address registrada en
                // la invariant, si no revierte la tx.
                assert(_contractValue == inv.addValue, 'Hack Reverted: Invariant Broken');
            } else if inv.rule == 6 {
                // rule = 2
                assert(_contractValue != inv.addValue, 'Hack Reverted: Invariant Broken');
            }
        }

        // disable invariants
        fn Disable_Invariant(ref self: ContractState, _invariantID: u32, isEnable: bool) {
            //Only invariant configurer can call this function.
            self.accesscontrol.assert_only_role(INVARIANT_CONFIGURER);
            // Invariant should be active.
            assert(self.isInvariantActive.read(_invariantID), 'Invariant is already Disable');
            // Disable the invariant
            self.isInvariantActive.write(_invariantID, isEnable);
        }
        fn get_Invariant_Status(self: @ContractState, _invariantID: u32) -> bool {
            self.isInvariantActive.read(_invariantID)
        }

        // Get Uint Invariant Data.
        fn getInvariant_Uint(
            self: @ContractState, _invariantID: u32,
        ) -> (ByteArray, ContractAddress, u8, u8, u256) {
            let inv = self.invariants_uint.read(_invariantID);
            // return struct values.
            return (inv.name, inv.asker, inv.invariantType, inv.rule, inv.uintValue);
        }
        // Get Address Invariant Data.
        fn getInvariant_Address(
            self: @ContractState, _invariantID: u32,
        ) -> (ByteArray, ContractAddress, u8, u8, ContractAddress) {
            let invAdd = self.invariants_address.read(_invariantID);
            // return struct values.
            return (invAdd.name, invAdd.asker, invAdd.invariantType, invAdd.rule, invAdd.addValue);
        }
        // Return the Invariants Count
        fn getInvariantCount(self: @ContractState) -> u32 {
            self.countInvariantID.read()
        }
        // Admin Functions
        fn setConfigurer(ref self: ContractState, _newConfigurer: ContractAddress) {
            //Only the Defalt Admin can call this function (Zamna Factory contract or address set by
            //zamna factory)
            self.accesscontrol.assert_only_role(DEFAULT_ADMIN_ROLE);
            // revoke Configurer Role from previous Address.
            self.accesscontrol._revoke_role(INVARIANT_CONFIGURER, self.configurer.read());
            // set the Configurer Role to the new Address.
            self.accesscontrol._grant_role(INVARIANT_CONFIGURER, _newConfigurer);
            // update configurer address in the contract storage.
            self.configurer.write(_newConfigurer);
        }

        fn setAsker(ref self: ContractState, _newAsker: ContractAddress) {
            //Only the Defalt Admin can call this function (Zamna Factory contract or address set by
            //zamna factory)
            self.accesscontrol.assert_only_role(DEFAULT_ADMIN_ROLE);

            // revoke Asker Role from previous Address.
            self.accesscontrol._revoke_role(INVARIANT_ASKER, self.asker.read());
            // set the Asker Role to the new Address.
            self.accesscontrol._grant_role(INVARIANT_ASKER, _newAsker);
            // update Asker address in the contract storage.
            self.asker.write(_newAsker);
        }
    }
}

