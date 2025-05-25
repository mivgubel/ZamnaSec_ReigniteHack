export const zFactoryAbi = [
	{
		name: "ZamnaFactoryImpl",
		type: "impl",
		interface_name: "zamnasec::zamnaFactory::IZamnaFactory",
	},
	{
		name: "core::bool",
		type: "enum",
		variants: [
			{
				name: "False",
				type: "()",
			},
			{
				name: "True",
				type: "()",
			},
		],
	},
	{
		name: "zamnasec::zamnaFactory::IZamnaFactory",
		type: "interface",
		items: [
			{
				name: "deploy_invariants_contract",
				type: "function",
				inputs: [
					{
						name: "configurer",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "asker",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [
					{
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				state_mutability: "external",
			},
			{
				name: "Change_Configurer_Role",
				type: "function",
				inputs: [
					{
						name: "_newConfigurer",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_invariantContract",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Change_Asker_Role",
				type: "function",
				inputs: [
					{
						name: "_newAsker",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_invariantContract",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "allowInvariantsDeployer",
				type: "function",
				inputs: [
					{
						name: "_deployer",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_isAllowed",
						type: "core::bool",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "allowAdminConfigurer",
				type: "function",
				inputs: [
					{
						name: "_invariantContract",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_configurer",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_isAllowed",
						type: "core::bool",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "update_zamnaEnforcer_class_hash",
				type: "function",
				inputs: [
					{
						name: "zEnforcer_class_hash",
						type: "core::starknet::class_hash::ClassHash",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
		],
	},
	{
		name: "OwnableMixinImpl",
		type: "impl",
		interface_name: "openzeppelin_access::ownable::interface::OwnableABI",
	},
	{
		name: "openzeppelin_access::ownable::interface::OwnableABI",
		type: "interface",
		items: [
			{
				name: "owner",
				type: "function",
				inputs: [],
				outputs: [
					{
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				state_mutability: "view",
			},
			{
				name: "transfer_ownership",
				type: "function",
				inputs: [
					{
						name: "new_owner",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "renounce_ownership",
				type: "function",
				inputs: [],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "transferOwnership",
				type: "function",
				inputs: [
					{
						name: "newOwner",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "renounceOwnership",
				type: "function",
				inputs: [],
				outputs: [],
				state_mutability: "external",
			},
		],
	},
	{
		name: "constructor",
		type: "constructor",
		inputs: [
			{
				name: "class_hash",
				type: "core::starknet::class_hash::ClassHash",
			},
			{
				name: "owner",
				type: "core::starknet::contract_address::ContractAddress",
			},
		],
	},
	{
		kind: "struct",
		name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
		type: "event",
		members: [
			{
				kind: "key",
				name: "previous_owner",
				type: "core::starknet::contract_address::ContractAddress",
			},
			{
				kind: "key",
				name: "new_owner",
				type: "core::starknet::contract_address::ContractAddress",
			},
		],
	},
	{
		kind: "struct",
		name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
		type: "event",
		members: [
			{
				kind: "key",
				name: "previous_owner",
				type: "core::starknet::contract_address::ContractAddress",
			},
			{
				kind: "key",
				name: "new_owner",
				type: "core::starknet::contract_address::ContractAddress",
			},
		],
	},
	{
		kind: "enum",
		name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
		type: "event",
		variants: [
			{
				kind: "nested",
				name: "OwnershipTransferred",
				type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
			},
			{
				kind: "nested",
				name: "OwnershipTransferStarted",
				type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
			},
		],
	},
	{
		kind: "enum",
		name: "zamnasec::zamnaFactory::zamnaFactory::Event",
		type: "event",
		variants: [
			{
				kind: "flat",
				name: "OwnableEvent",
				type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
			},
		],
	},
] as const;
