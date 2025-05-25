// Import the required traits and functions from Snforge
use snforge_std::{ContractClassTrait, DeclareResultTrait, declare};
// And additionally the testing utilities
use snforge_std::{
    get_class_hash, start_cheat_caller_address, start_cheat_caller_address_global,
    stop_cheat_caller_address, stop_cheat_caller_address_global,
};
use starknet::{ClassHash, ContractAddress};
use zamnasec::MockVault::{IMockVaultDispatcher, IMockVaultDispatcherTrait};
use zamnasec::ZamnaInvariantsEnforcer::{
    IZamnaInvariantsEnforcerDispatcher, IZamnaInvariantsEnforcerDispatcherTrait,
    IZamnaInvariantsEnforcerSafeDispatcher, IZamnaInvariantsEnforcerSafeDispatcherTrait,
};
use zamnasec::zamnaFactory::{
    IZamnaFactoryDispatcher, IZamnaFactoryDispatcherTrait, IZamnaFactorySafeDispatcher,
};


// Declare and deploy the contract and return its dispatcher.
fn deploy_ZamnaEnforcer() -> (IZamnaInvariantsEnforcerDispatcher, ContractAddress) {
    let configurer: ContractAddress = 'configurer'.try_into().unwrap();
    let asker: ContractAddress = 'asker'.try_into().unwrap();
    //let admin: ContractAddress = 'admin'.try_into().unwrap();
    let constructor_calldata = array![configurer.into(), asker.into()];

    // Declare the Smart Contract.
    let contract = declare("ZamnaInvariantsEnforcer").unwrap().contract_class();
    // deployea the smart contract.
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    // Return the dispatcher.
    // It allows to interact with the contract based on its interface.
    (IZamnaInvariantsEnforcerDispatcher { contract_address }, contract_address)
}

fn deploy_vault(zEnforcerAddress: ContractAddress) -> (IMockVaultDispatcher, ContractAddress) {
    // Constructor Data
    //let zEnforcerAddress: ContractAddress = 'zEnforcerAddress'.try_into().unwrap();
    let callData = array![zEnforcerAddress.into()];

    // Declare the Smart Contract.
    let contract = declare("MockVault").unwrap().contract_class();
    // deployea the smart contract.
    let (contract_address, _) = contract.deploy(@callData).unwrap();

    // Return the dispatcher.
    // It allows to interact with the contract based on its interface.
    (IMockVaultDispatcher { contract_address }, contract_address)
}

fn deploy_ZamnaFactory() -> (
    IZamnaFactoryDispatcher, IZamnaInvariantsEnforcerDispatcher, ContractAddress,
) {
    let (ZIE_Dispatcher, ZE_Contract_address) = deploy_ZamnaEnforcer();
    let zEnforcer: ClassHash = get_class_hash(ZE_Contract_address);
    let owner: ContractAddress = 'owner'.try_into().unwrap();
    let constructor_calldata = array![zEnforcer.into(), owner.into()];
    // Declare the Smart Contract.
    let contract = declare("zamnaFactory").unwrap().contract_class();
    // deployea the smart contract.
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    // Return the dispatcher.
    // It allows to interact with the contract based on its interface.
    (IZamnaFactoryDispatcher { contract_address }, ZIE_Dispatcher, contract_address)
}
// Testing deploymento of zamnaFactory y zamnaEnforcer.
#[test]
fn test_deployment() {
    let (zFactoryDispatcher, _, _) = deploy_ZamnaFactory();
    let configurer: ContractAddress = 'configurer'.try_into().unwrap();
    let asker: ContractAddress = 'asker'.try_into().unwrap();
    let allowedDeployer: ContractAddress = 'allowedDeployer'.try_into().unwrap();
    let owner: ContractAddress = 'owner'.try_into().unwrap();
    // Permitimos un deployer de invariants contract.
    start_cheat_caller_address_global(owner);
    zFactoryDispatcher.allowInvariantsDeployer(allowedDeployer, true);
    stop_cheat_caller_address_global();
    // Deploy invariant contract, only allowedDeployer can deploy invariants
    start_cheat_caller_address_global(allowedDeployer);
    let _ = zFactoryDispatcher.deploy_invariants_contract(configurer, asker);
    stop_cheat_caller_address_global();
}

// testing Create and update invariants
#[test]
fn create_update_invariants() {
    let (zFactoryDispatcher, _, _) = deploy_ZamnaFactory();
    let configurer: ContractAddress = 'configurer'.try_into().unwrap();
    let asker: ContractAddress = 'asker'.try_into().unwrap();
    let allowedDeployer: ContractAddress = 'allowedDeployer'.try_into().unwrap();
    let owner: ContractAddress = 'owner'.try_into().unwrap();

    // Permitimos un deployer de invariants contract.
    start_cheat_caller_address_global(owner);
    zFactoryDispatcher.allowInvariantsDeployer(allowedDeployer, true);
    stop_cheat_caller_address_global();
    // Deploy invariant contract, only allowedDeployer can deploy invariants
    start_cheat_caller_address_global(allowedDeployer);
    let invariantAddress = zFactoryDispatcher.deploy_invariants_contract(configurer, asker);
    stop_cheat_caller_address_global();
    // create a dispatcher
    let zEnforcerDispatcher = IZamnaInvariantsEnforcerDispatcher {
        contract_address: invariantAddress,
    };
    // revierte si no la llama el configurer.
    start_cheat_caller_address_global(configurer);
    // Invariant ID = 1
    zEnforcerDispatcher.Create_Invariant_Uint("Invariant uint 1", asker, 1, 1, 100);
    stop_cheat_caller_address_global();

    // revierte si no la llama el configurer.
    start_cheat_caller_address_global(configurer);
    // Invariant ID = 2
    // type: 3 (address invariant) Rule:3 ("==")
    zEnforcerDispatcher.Create_Invariant_Address("Invariant Address 1", asker, 3, 3, configurer);
    stop_cheat_caller_address_global();

    //update invariant uint, Falla si no la llama el configurer y si la invarian no esta desactivada
    //y si el ID invariant no es correcto
    start_cheat_caller_address_global(configurer);
    zEnforcerDispatcher.Disable_Invariant(1);
    zEnforcerDispatcher.Update_Invariant_Uint(1, "Invariant uint 1", asker, 1, 200);
    stop_cheat_caller_address_global();

    let (name, _asker, invariantType, rule, uintvalue) = zEnforcerDispatcher.getInvariant_Uint(1);
    assert_eq!(name, "Invariant uint 1");
    assert_eq!(_asker, asker);
    assert_eq!(invariantType, 1);
    assert_eq!(rule, 1);
    assert_eq!(uintvalue, 200);

    //update invariant Address, Rule:6 => "!="
    // Falla si no la llama el configurer, Si la invariant no esta deshabilitada y si el ID
    // invariant no es correcto
    start_cheat_caller_address_global(configurer);
    // Las invariants se desabilitan correctamente.
    zEnforcerDispatcher.Disable_Invariant(2);
    zEnforcerDispatcher.Update_Invariant_Address(2, "Invariant Address update", asker, 6, asker);
    stop_cheat_caller_address_global();

    // validate the data change
    let (name, _asker, invariantType, rule, addressValue) = zEnforcerDispatcher
        .getInvariant_Address(2);
    assert_eq!(name, "Invariant Address update");
    assert_eq!(_asker, asker);
    assert_eq!(invariantType, 3);
    assert_eq!(rule, 6);
    assert_eq!(addressValue, asker);
}

// Testing Invariant Enforcement.
#[test]
#[feature("safe_dispatcher")]
fn test_Invariant_Enforcement() {
    let (zFactoryDispatcher, _, _) = deploy_ZamnaFactory();
    let configurer: ContractAddress = 'configurer'.try_into().unwrap();
    let asker: ContractAddress = 'asker'.try_into().unwrap();
    let allowedDeployer: ContractAddress = 'allowedDeployer'.try_into().unwrap();
    let owner: ContractAddress = 'owner'.try_into().unwrap();

    // Permitimos un deployer de invariants contract.
    start_cheat_caller_address_global(owner);
    zFactoryDispatcher.allowInvariantsDeployer(allowedDeployer, true);
    stop_cheat_caller_address_global();
    // Deploy invariant contract, only allowedDeployer can deploy invariants
    start_cheat_caller_address_global(allowedDeployer);
    let invariantAddress = zFactoryDispatcher.deploy_invariants_contract(configurer, asker);
    stop_cheat_caller_address_global();
    // create a dispatcher
    let zEnforcerDispatcher = IZamnaInvariantsEnforcerDispatcher {
        contract_address: invariantAddress,
    };
    let zEnforcerSafeDispatcher = IZamnaInvariantsEnforcerSafeDispatcher {
        contract_address: invariantAddress,
    };
    // revierte si no la llama el configurer.
    // Invariant ID = 1
    start_cheat_caller_address_global(configurer);
    zEnforcerDispatcher.Create_Invariant_Uint("Invariant uint 1", asker, 1, 1, 100);
    stop_cheat_caller_address_global();

    // revierte si no la llama el configurer.
    // Invariant ID = 2
    // type: 3 (address invariant) Rule:3 ("==")
    start_cheat_caller_address_global(configurer);
    zEnforcerDispatcher.Create_Invariant_Address("Invariant Address 1", asker, 3, 3, configurer);
    stop_cheat_caller_address_global();

    // Enforce invariant type uint, revert if the calles is not the asker and the invariant ID is
    // not valid.
    start_cheat_caller_address_global(asker);
    match zEnforcerSafeDispatcher.Enforce_Invariant_Uint(1, 200) {
        Result::Ok(_) => panic!("Entrypoint did not panic"),
        Result::Err(panic_data) => {
            assert(*panic_data.at(0) == 'Hack Reverted: Invariant Broken', *panic_data.at(0));
        },
    }
    stop_cheat_caller_address_global();

    // Enforce invariant type uint, revert if the calles is not the asker and the invariant ID is
    // not valid or is not a type address invariant. Si la invariant no se rompre, entonces no
    // revierte la Tx.
    start_cheat_caller_address_global(asker);
    match zEnforcerSafeDispatcher.Enforce_Invariant_Address(2, asker) {
        Result::Ok(_) => panic!("Entrypoint did not panic"),
        Result::Err(panic_data) => {
            assert(*panic_data.at(0) == 'Hack Reverted: Invariant Broken', *panic_data.at(0));
        },
    }
    stop_cheat_caller_address_global();
}

// Testing Change Configurer and Asker Roles works correctly
#[test]
fn test_change_configurer_asker_roles() {
    let (zFactoryDispatcher, _, _) = deploy_ZamnaFactory();
    let configurer: ContractAddress = 'configurer'.try_into().unwrap();
    let asker: ContractAddress = 'asker'.try_into().unwrap();
    let allowedDeployer: ContractAddress = 'allowedDeployer'.try_into().unwrap();
    let owner: ContractAddress = 'owner'.try_into().unwrap();

    // Permitimos un deployer de invariants contract.
    start_cheat_caller_address_global(owner);
    zFactoryDispatcher.allowInvariantsDeployer(allowedDeployer, true);
    stop_cheat_caller_address_global();
    // Deploy invariant contract, only allowedDeployer can deploy invariants
    start_cheat_caller_address_global(allowedDeployer);
    let invariantAddress = zFactoryDispatcher.deploy_invariants_contract(configurer, asker);
    stop_cheat_caller_address_global();
    // create a dispatcher
    let zEnforcerDispatcher = IZamnaInvariantsEnforcerDispatcher {
        contract_address: invariantAddress,
    };

    // Change Configuer role
    let newConfigurer: ContractAddress = 'newConfigurer'.try_into().unwrap();
    // revierte si no lo llama el Admin allowed Configurer(allowedDeployer).
    start_cheat_caller_address_global(allowedDeployer);
    zFactoryDispatcher.Change_Configurer_Role(newConfigurer, invariantAddress);
    stop_cheat_caller_address_global();
    // revierte si no la llama el newConfigurer.
    // Invariant ID = 1
    start_cheat_caller_address_global(newConfigurer);
    zEnforcerDispatcher.Create_Invariant_Uint("Invariant uint 1", asker, 1, 1, 100);
    stop_cheat_caller_address_global();

    // Change asker Role
    let newAsker: ContractAddress = 'newAsker'.try_into().unwrap();
    // revierte si no lo llama el Admin allowed Configurer(allowedDeployer).
    start_cheat_caller_address_global(allowedDeployer);
    zFactoryDispatcher.Change_Asker_Role(newAsker, invariantAddress);
    stop_cheat_caller_address_global();
    // Revierte si no es llamada por el nuevo asker.
    // Rule: 1 => "<"
    start_cheat_caller_address_global(newAsker);
    zEnforcerDispatcher.Enforce_Invariant_Uint(1, 90);
    stop_cheat_caller_address_global();
}
// Falta test del update class hash

//Test Vault First Attack Depositor fails because ZamnaInvariantEnforcer Protect the Vault.

#[test]
fn test_Vault_First_Depositor_Attack() {
    let (zFactoryDispatcher, _, _) = deploy_ZamnaFactory();
    let configurer: ContractAddress = 'configurer'.try_into().unwrap();
    let asker: ContractAddress = 'asker'.try_into().unwrap();
    let allowedDeployer: ContractAddress = 'allowedDeployer'.try_into().unwrap();
    let owner: ContractAddress = 'owner'.try_into().unwrap();
    let attacker: ContractAddress = 'attacker'.try_into().unwrap();

    // Permitimos un deployer de invariants contract.
    start_cheat_caller_address_global(owner);
    zFactoryDispatcher.allowInvariantsDeployer(allowedDeployer, true);
    stop_cheat_caller_address_global();
    // Deploy invariant contract, only allowedDeployer can deploy invariants
    start_cheat_caller_address_global(allowedDeployer);
    let invariantAddress = zFactoryDispatcher.deploy_invariants_contract(configurer, asker);
    stop_cheat_caller_address_global();
    // deploy the mock vault
    let (vaultDispatcher, asker_vaultAddress) = deploy_vault(invariantAddress);
    // create a dispatcher
    let zEnforcerDispatcher = IZamnaInvariantsEnforcerDispatcher {
        contract_address: invariantAddress,
    };

    // Invariant ID = 1
    start_cheat_caller_address_global(configurer);
    zEnforcerDispatcher
        .Create_Invariant_Address("Invariant Address 1", asker_vaultAddress, 3, 3, allowedDeployer);
    stop_cheat_caller_address_global();

    // revierte si no lo llama el Admin allowed Configurer(allowedDeployer).
    start_cheat_caller_address_global(allowedDeployer);
    // se configura al vault como el asker
    zFactoryDispatcher.Change_Asker_Role(asker_vaultAddress, invariantAddress);
    stop_cheat_caller_address_global();

    // Revert if is not called by allowedDeployer who is the address allowed to be the first
    // depositor in the invariant rule, to avoid the first depositor attack.
    start_cheat_caller_address(contract_address: asker_vaultAddress, caller_address: attacker);
    vaultDispatcher.deposit(1000);
    stop_cheat_caller_address(contract_address: asker_vaultAddress);
    // start_cheat_caller_address_global(asker_vaultAddress);
// zEnforcerDispatcher.Enforce_Invariant_Address(1, configurer);
// stop_cheat_caller_address_global();
}

