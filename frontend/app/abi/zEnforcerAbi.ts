export const zEnforcerAbi = [
	{
		name: "ZamnaInvariantsEnforcerImpl",
		type: "impl",
		interface_name: "zamnasec::ZamnaInvariantsEnforcer::IZamnaInvariantsEnforcer",
	},
	{
		name: "core::byte_array::ByteArray",
		type: "struct",
		members: [
			{
				name: "data",
				type: "core::array::Array::<core::bytes_31::bytes31>",
			},
			{
				name: "pending_word",
				type: "core::felt252",
			},
			{
				name: "pending_word_len",
				type: "core::integer::u32",
			},
		],
	},
	{
		name: "core::integer::u256",
		type: "struct",
		members: [
			{
				name: "low",
				type: "core::integer::u128",
			},
			{
				name: "high",
				type: "core::integer::u128",
			},
		],
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
		name: "zamnasec::ZamnaInvariantsEnforcer::IZamnaInvariantsEnforcer",
		type: "interface",
		items: [
			{
				name: "Create_Invariant_Uint",
				type: "function",
				inputs: [
					{
						name: "_name",
						type: "core::byte_array::ByteArray",
					},
					{
						name: "_contract",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_type",
						type: "core::integer::u8",
					},
					{
						name: "_rule",
						type: "core::integer::u8",
					},
					{
						name: "_invariantValue",
						type: "core::integer::u256",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Create_Invariant_Address",
				type: "function",
				inputs: [
					{
						name: "_name",
						type: "core::byte_array::ByteArray",
					},
					{
						name: "_contract",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_type",
						type: "core::integer::u8",
					},
					{
						name: "_rule",
						type: "core::integer::u8",
					},
					{
						name: "_invariantValue",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Update_Invariant_Uint",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
					{
						name: "_name",
						type: "core::byte_array::ByteArray",
					},
					{
						name: "_contract",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_rule",
						type: "core::integer::u8",
					},
					{
						name: "_invariantValue",
						type: "core::integer::u256",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Update_Invariant_Address",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
					{
						name: "_name",
						type: "core::byte_array::ByteArray",
					},
					{
						name: "_contract",
						type: "core::starknet::contract_address::ContractAddress",
					},
					{
						name: "_rule",
						type: "core::integer::u8",
					},
					{
						name: "_invariantValue",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Enforce_Invariant_Uint",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
					{
						name: "_contractValue",
						type: "core::integer::u256",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Enforce_Invariant_Address",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
					{
						name: "_contractValue",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "Disable_Invariant",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
					{
						name: "isEnable",
						type: "core::bool",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "get_Invariant_Status",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
				],
				outputs: [
					{
						type: "core::bool",
					},
				],
				state_mutability: "view",
			},
			{
				name: "getInvariant_Uint",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
				],
				outputs: [
					{
						type: "(core::byte_array::ByteArray, core::starknet::contract_address::ContractAddress, core::integer::u8, core::integer::u8, core::integer::u256)",
					},
				],
				state_mutability: "view",
			},
			{
				name: "getInvariant_Address",
				type: "function",
				inputs: [
					{
						name: "_invariantID",
						type: "core::integer::u32",
					},
				],
				outputs: [
					{
						type: "(core::byte_array::ByteArray, core::starknet::contract_address::ContractAddress, core::integer::u8, core::integer::u8, core::starknet::contract_address::ContractAddress)",
					},
				],
				state_mutability: "view",
			},
			{
				name: "getInvariantCount",
				type: "function",
				inputs: [],
				outputs: [
					{
						type: "core::integer::u32",
					},
				],
				state_mutability: "view",
			},
			{
				name: "setConfigurer",
				type: "function",
				inputs: [
					{
						name: "_newConfigurer",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "setAsker",
				type: "function",
				inputs: [
					{
						name: "_newAsker",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
		],
	},
	{
		name: "AccessControlImpl",
		type: "impl",
		interface_name: "openzeppelin_access::accesscontrol::interface::IAccessControl",
	},
	{
		name: "openzeppelin_access::accesscontrol::interface::IAccessControl",
		type: "interface",
		items: [
			{
				name: "has_role",
				type: "function",
				inputs: [
					{
						name: "role",
						type: "core::felt252",
					},
					{
						name: "account",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [
					{
						type: "core::bool",
					},
				],
				state_mutability: "view",
			},
			{
				name: "get_role_admin",
				type: "function",
				inputs: [
					{
						name: "role",
						type: "core::felt252",
					},
				],
				outputs: [
					{
						type: "core::felt252",
					},
				],
				state_mutability: "view",
			},
			{
				name: "grant_role",
				type: "function",
				inputs: [
					{
						name: "role",
						type: "core::felt252",
					},
					{
						name: "account",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "revoke_role",
				type: "function",
				inputs: [
					{
						name: "role",
						type: "core::felt252",
					},
					{
						name: "account",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
			{
				name: "renounce_role",
				type: "function",
				inputs: [
					{
						name: "role",
						type: "core::felt252",
					},
					{
						name: "account",
						type: "core::starknet::contract_address::ContractAddress",
					},
				],
				outputs: [],
				state_mutability: "external",
			},
		],
	},
	{
		name: "SRC5Impl",
		type: "impl",
		interface_name: "openzeppelin_introspection::interface::ISRC5",
	},
	{
		name: "openzeppelin_introspection::interface::ISRC5",
		type: "interface",
		items: [
			{
				name: "supports_interface",
				type: "function",
				inputs: [
					{
						name: "interface_id",
						type: "core::felt252",
					},
				],
				outputs: [
					{
						type: "core::bool",
					},
				],
				state_mutability: "view",
			},
		],
	},
	{
		name: "constructor",
		type: "constructor",
		inputs: [
			{
				name: "_configurer",
				type: "core::starknet::contract_address::ContractAddress",
			},
			{
				name: "_asker",
				type: "core::starknet::contract_address::ContractAddress",
			},
		],
	},
	{
		kind: "struct",
		name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
		type: "event",
		members: [
			{
				kind: "data",
				name: "role",
				type: "core::felt252",
			},
			{
				kind: "data",
				name: "account",
				type: "core::starknet::contract_address::ContractAddress",
			},
			{
				kind: "data",
				name: "sender",
				type: "core::starknet::contract_address::ContractAddress",
			},
		],
	},
	{
		kind: "struct",
		name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
		type: "event",
		members: [
			{
				kind: "data",
				name: "role",
				type: "core::felt252",
			},
			{
				kind: "data",
				name: "account",
				type: "core::starknet::contract_address::ContractAddress",
			},
			{
				kind: "data",
				name: "sender",
				type: "core::starknet::contract_address::ContractAddress",
			},
		],
	},
	{
		kind: "struct",
		name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
		type: "event",
		members: [
			{
				kind: "data",
				name: "role",
				type: "core::felt252",
			},
			{
				kind: "data",
				name: "previous_admin_role",
				type: "core::felt252",
			},
			{
				kind: "data",
				name: "new_admin_role",
				type: "core::felt252",
			},
		],
	},
	{
		kind: "enum",
		name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
		type: "event",
		variants: [
			{
				kind: "nested",
				name: "RoleGranted",
				type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
			},
			{
				kind: "nested",
				name: "RoleRevoked",
				type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
			},
			{
				kind: "nested",
				name: "RoleAdminChanged",
				type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
			},
		],
	},
	{
		kind: "enum",
		name: "openzeppelin_introspection::src5::SRC5Component::Event",
		type: "event",
		variants: [],
	},
	{
		kind: "enum",
		name: "zamnasec::ZamnaInvariantsEnforcer::ZamnaInvariantsEnforcer::Event",
		type: "event",
		variants: [
			{
				kind: "flat",
				name: "AccessControlEvent",
				type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
			},
			{
				kind: "flat",
				name: "SRC5Event",
				type: "openzeppelin_introspection::src5::SRC5Component::Event",
			},
		],
	},
] as const;
