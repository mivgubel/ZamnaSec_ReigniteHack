"use client"
import { useState, useEffect } from "react";
import type { Abi } from "starknet";
import { useAccount,useContract, useNetwork, useReadContract, useSendTransaction } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import {zFactoryAbi} from "../abi/zFactoryAbi";
import {zEnforcerAbi} from "../abi/zEnforcerAbi";

function Modal({ open, onClose, title, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" aria-hidden="true"></div>
      <div className="relative bg-white border border-blue-200 rounded-2xl p-0 w-full max-w-md shadow-xl font-sans text-slate-800">
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-blue-100">
          <h3 className="text-lg font-bold" style={{ color: '#1e293b' }}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-[#1e293b] text-2xl font-bold focus:outline-none ml-2">&times;</button>
        </div>
        <div className="p-6 pt-4">{children}</div>
      </div>
    </div>
  );
}

function shortAddress(addr: string) {
  if (!addr) return "N/A";
  const displayLength = 7 + 3 + 4; // 10 chars + '...' + 8 chars
  if (addr.length > displayLength) {
    return addr.slice(0, 7) + '...' + addr.slice(-4);
  } else {
    return addr;
  }
}

function formatAddressForDisplay(addr: any): string {
  if (addr === undefined || addr === null) return "N/A";
  try {
    const bigIntValue = BigInt(addr);
    return "0x" + bigIntValue.toString(16).padStart(1, '0');
  } catch (e) {
    console.error("Failed to format address for display:", addr, e);
    return addr?.toString() || "N/A"; // Fallback to string representation
  }
}

function formatValueForDisplay(value: any, type: string): string {
  if (value === undefined || value === null) return "N/A";
  try {
    const bigIntValue = BigInt(value);
    if (type === "ADDRESS") {
      return "0x" + bigIntValue.toString(16).padStart(1, '0');
    } else if (type === "UINT") {
      return bigIntValue.toString(10); // Decimal format for UINT
    }
    return value?.toString() || "N/A"; // Default to string for other types
  } catch (e) {
    console.error("Failed to format value for display:", value, type, e);
    return value?.toString() || "N/A"; // Fallback to string representation
  }
}



export default function Dashboard() {
  const factoryAddress = "0x00ec7db7f6bb1d9b0895ded0a2c9758964951db8ece69dda78212f8f432e7afb";
  const zEnforcerAddress = "0x006587786730dbfbd9a0cf5e3a323c29031d2a386b20f054a1b3c351acb794cb";
  const { address } = useAccount();
  const router = useRouter();
  //let invariantID = 0;
  // zFactoryAbi satisfies Abi;

    // Redirigir si no hay wallet conectada

    useEffect(() => {
      if (!address) {
        router.replace("/");
        //return null;
      } 
    }, [address, router]);

    

  const [modalOpen, setModalOpen] = useState(false);
  const [newInvariant, setNewInvariant] = useState<any>({ name: "", type: "UINT", rule: "<", value: "", asker: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editInvariant, setEditInvariant] = useState<any>({ name: "", type: "UINT", rule: "<", value: "", asker: "" });
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deployAddresses, setDeployAddresses] = useState({ configurer: "", asker: "" });
  const [error, setError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Define the range of invariant IDs to read
  const invariantIdsToRead = [1, 2, 3, 4,5]; // Attempt to read invariants with IDs 1 to 5

  // Read UINT invariants
  const { data: uintInv0, isLoading: isLoadingUint0, error: errorUint0 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Uint",
    args: [invariantIdsToRead[0]],
    watch: true, // Keep watching for changes
  });

  const { data: uintInv1, isLoading: isLoadingUint1, error: errorUint1 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Uint",
    args: [invariantIdsToRead[1]],
     watch: true,
  });

   const { data: uintInv2, isLoading: isLoadingUint2, error: errorUint2 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Uint",
    args: [invariantIdsToRead[2]],
     watch: true,
  });

   const { data: uintInv3, isLoading: isLoadingUint3, error: errorUint3 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Uint",
    args: [invariantIdsToRead[3]],
     watch: true,
  });

   const { data: uintInv4, isLoading: isLoadingUint4, error: errorUint4 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Uint",
    args: [invariantIdsToRead[4]],
     watch: true,
  });


  // Read Address invariants
   const { data: addressInv0, isLoading: isLoadingAddress0, error: errorAddress0 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Address",
    args: [invariantIdsToRead[0]],
     watch: true,
  });

   const { data: addressInv1, isLoading: isLoadingAddress1, error: errorAddress1 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Address",
    args: [invariantIdsToRead[1]],
     watch: true,
  });
   const { data: addressInv2, isLoading: isLoadingAddress2, error: errorAddress2 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Address",
    args: [invariantIdsToRead[2]],
     watch: true,
  });
   const { data: addressInv3, isLoading: isLoadingAddress3, error: errorAddress3 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Address",
    args: [invariantIdsToRead[3]],
     watch: true,
  });
   const { data: addressInv4, isLoading: isLoadingAddress4, error: errorAddress4 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "getInvariant_Address",
    args: [invariantIdsToRead[4]],
     watch: true,
  });

  // Read Invariant Status
   const { data: statusInv0, isLoading: isLoadingStatus0, error: errorStatus0 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "get_Invariant_Status",
    args: [invariantIdsToRead[0]],
     watch: true,
   });

   const { data: statusInv1, isLoading: isLoadingStatus1, error: errorStatus1 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "get_Invariant_Status",
    args: [invariantIdsToRead[1]],
     watch: true,
   });

   const { data: statusInv2, isLoading: isLoadingStatus2, error: errorStatus2 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "get_Invariant_Status",
    args: [invariantIdsToRead[2]],
     watch: true,
   });

   const { data: statusInv3, isLoading: isLoadingStatus3, error: errorStatus3 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "get_Invariant_Status",
    args: [invariantIdsToRead[3]],
     watch: true,
   });

   const { data: statusInv4, isLoading: isLoadingStatus4, error: errorStatus4 } = useReadContract({
    abi: zEnforcerAbi as Abi,
    address: zEnforcerAddress,
    functionName: "get_Invariant_Status",
    args: [invariantIdsToRead[4]],
     watch: true,
   });


  // Combine and format fetched data
  const fetchedInvariants = [
    uintInv0, uintInv1, uintInv2, uintInv3, uintInv4,
    addressInv0, addressInv1, addressInv2, addressInv3, addressInv4,
    statusInv0, statusInv1, statusInv2, statusInv3, statusInv4
  ]
  .map((data: any, index: number) => {
    // Check if data exists and the invariant has a name before mapping
    if (!data || !data[0] || data[0].toString() === "N/A") return null;

    // Determine the original invariant ID and type based on the index in the combined array
    const originalId = invariantIdsToRead[index % invariantIdsToRead.length];
    const type = index < invariantIdsToRead.length ? "UINT" : "ADDRESS";

    // Assuming the structure of the returned data is [name, contract, type, rule, value]
    // name: ByteArray, contract: ContractAddress, type: u8, rule: u8, value: u256 or ContractAddress

    // Basic mapping back to string rules and types for display
     const ruleMapping: { [key: number]: string } = {
      1: "<",
      2: "<=",
      3: "==",
      4: ">=",
      5: ">",
      6: "!=",
    };

     const typeMapping: { [key: number]: string } = {
      1: "UINT",
      3: "ADDRESS",
    };

    return {
      id: originalId,
      name: data[0]?.toString() || "N/A", // Assuming name is the first element and can be converted to string
      asker: data[1] !== undefined ? formatAddressForDisplay(data[1]) : "N/A", // Always show asker in full hex format for table
      type: typeMapping[data[2] as number] || "UNKNOWN", // Assuming type is the third element (u8)
      rule: ruleMapping[data[3] as number] || "UNKNOWN", // Assuming rule is the fourth element (u8)
      value: data[4] !== undefined ? formatValueForDisplay(data[4], type) : "N/A", // Show full value for table, format based on type
      enabled: index < invariantIdsToRead.length * 2 // First half are UINT/ADDRESS data, second half is status data
                 ? true // Default or determine based on actual data structure if needed
                 : data?.result === 1, // Assuming 1 means enabled, 0 means disabled based on get_Invariant_Status return
    };
  })
  .filter(inv => inv !== null);


  // Determine if data is loading
  const isLoadingInvariants = isLoadingUint0 || isLoadingUint1 || isLoadingUint2 || isLoadingUint3 || isLoadingUint4
                             || isLoadingAddress0 || isLoadingAddress1 || isLoadingAddress2 || isLoadingAddress3 || isLoadingAddress4
                             || isLoadingStatus0 || isLoadingStatus1 || isLoadingStatus2 || isLoadingStatus3 || isLoadingStatus4;
  // Determine if there's an error
  const loadingError = errorUint0 || errorUint1 || errorUint2 || errorUint3 || errorUint4
                        || errorAddress0 || errorAddress1 || errorAddress2 || errorAddress3 || errorAddress4
                        || errorStatus0 || errorStatus1 || errorStatus2 || errorStatus3 || errorStatus4;



  const sortedInvariants = [...fetchedInvariants].sort((a: any, b: any) => a.id - b.id);

  const showStatusPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    // Automatically hide popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage(null);
    }, 5000);
  };

  const handleToggle = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked; // Get the new state from the toggle
    showStatusPopup(`Attempting to set invariant with ID ${id} to ${isEnabled ? 'enabled' : 'disabled'}.`);
    // Call the Disable_Invariant function on the contract with the desired state
    const toggleCall = zEnforcerContract?.populate("Disable_Invariant", [id, isEnabled]);
    if (toggleCall) {
      sendEnforcerTx([toggleCall]);
      showStatusPopup(`Toggle Invariant transaction sent for ID ${id} (check wallet for confirmation).`);
      // Note: UI will not automatically update until the transaction is confirmed and data refetches.
    } else {
      showStatusPopup(`Error: Failed to populate toggle invariant call for ID ${id}.`);
    }
  };

  const handleInputChange = (e: any, isEdit = false) => {
    const { name, value, type, checked } = e.target;
    if (isEdit) {
      setEditInvariant((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    } else {
      setNewInvariant((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleEditClick = (inv: any) => {
    setEditId(inv.id);
    // Format values for display in the modal
    setEditInvariant({
      ...inv,
      asker: formatAddressForDisplay(inv.asker),
      value: formatValueForDisplay(inv.value, inv.type),
    });
    setError(null); // Clear error on modal close
    setModalOpen(true);
  };

  // Create invariant modal.
  const handleAddInvariant = async (e: any) => {
    e.preventDefault();
    const invariantData = editId !== null ? editInvariant : newInvariant;
    if (!invariantData.name || !invariantData.value || !invariantData.rule || !invariantData.type || !invariantData.asker) {
      setError("Please fill all fields."); // Add basic error handling
      return;
    }

    setError(null); // Clear previous errors

    // Map string types and rules to u8 (assuming a simple mapping for now)
    const typeMapping: { [key: string]: number } = {
      "UINT": 1,
      "ADDRESS": 3,
      // Add other types if needed
    };

    const ruleMapping: { [key: string]: number } = {
      "<": 1,
      "<=": 2,
      "==": 3,
      ">=": 4,
      ">": 5,
      "!=": 6,
      // Add other rules if needed
    };

    const functionName = editId !== null
      ? (invariantData.type === "UINT" ? "Update_Invariant_Uint" : "Update_Invariant_Address")
      : (invariantData.type === "UINT" ? "Create_Invariant_Uint" : "Create_Invariant_Address");

    const args = editId !== null
      ? [
          editId, // Invariant ID for update
          invariantData.name,
          invariantData.asker, // Pass as string
          //typeMapping[invariantData.type],
          ruleMapping[invariantData.rule],
          invariantData.value, // Pass as string
        ]
      : [
          invariantData.name,
          invariantData.asker, // Pass as string
          typeMapping[invariantData.type],
          ruleMapping[invariantData.rule],
          invariantData.value, // Pass as string
        ];

    const call = zEnforcerContract?.populate(functionName, args);

    if (!call) {
       setError("Failed to populate contract call.");
       showStatusPopup("Error: Failed to populate contract call.");
       return;
     }

    try {
      await sendEnforcerTx([call]);
      showStatusPopup(`${editId !== null ? "Update" : "Create"} Invariant transaction sent (check wallet for confirmation)!`);
       // The table will automatically update when the transaction is confirmed and the useReadContract hooks refetch data.
      setNewInvariant({ name: "", type: "UINT", rule: "<", value: "", asker: "" });
      setModalOpen(false);
    } catch (e: any) {
      console.error("Failed to send create invariant transaction:", e);
      setError(`Failed to create invariant: ${e.message || "Unknown error"}`);
      showStatusPopup(`Error: Failed to create invariant: ${e.message || "Unknown error"}`);
    }
  };

    // Creating the Enforcer Contract and transaction.
    const { contract: zEnforcerContract } = useContract({
      abi: zEnforcerAbi as Abi,
      address: zEnforcerAddress,
    });
  
     const { send: sendEnforcerTx, isPending: isDeployingEnforcer, error: deployErrorEnforcer } = useSendTransaction({
      calls: zEnforcerContract
        ? [zEnforcerContract.populate("Create_Invariant_Uint", ["", "0x0aaa", 1, 1, 0])]
        : undefined,
    }); 

  const handleModalClose = () => {
    setError(null); // Clear error on modal close
    setModalOpen(false);
    setEditId(null); // Reset edit state
    setEditInvariant({ name: "", type: "UINT", rule: "<", value: "", asker: "" }); // Reset edit form state
    setNewInvariant({ name: "", type: "UINT", rule: "<", value: "", asker: "" }); // Reset create form state
  };

  const handleDeployInputChange = (e: any) => {
    const { name, value } = e.target;
    setDeployAddresses((prev) => ({ ...prev, [name]: value }));
  };

  // Creating the Factory Contract and transaction.
  const { contract: zFactoryContract } = useContract({
    abi: zFactoryAbi as Abi,
    address: factoryAddress,
  });

  const { send: sendTx, isPending: isDeploying, error: deployError } = useSendTransaction({
    calls: zFactoryContract
      ? [zFactoryContract.populate("deploy_invariants_contract", ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"])]
      : undefined,
  });



  const handleDeploySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!zFactoryContract) {
      console.error("Factory contract not loaded.");
      return;
    }
    try {
      await sendTx([zFactoryContract.populate("deploy_invariants_contract", [
        deployAddresses.configurer,
        deployAddresses.asker,
      ])]);
      console.log("Deployment transaction sent!");
      setDeployModalOpen(false);
      setDeployAddresses({ configurer: "", asker: "" });
    } catch (e) {
      console.error("Failed to send deployment transaction:", e);
      // Optionally show an error message in the UI
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 font-sans text-slate-800 text-sm">
      <div className="p-8 w-full h-full  bg-blue-50 flex flex-col items-center mt-16">
        <div className="mb-8 w-full">
          <h2 className="text-xl font-bold mb-2 text-center" style={{ color: '#1e293b' }}>
            Invariants Configuration
          </h2>
          <p className="text-sm text-slate-500 text-center mb-4">Admin & Edit your Smart Contract's Rules.</p>
          <div className="flex justify-between mb-4 w-full md:justify-between gap-2">
            <button
              onClick={() => { setDeployModalOpen(true); }}
              className="px-4 py-2 bg-gradient-to-r from-[#1d293b] to-[#2451b1] hover:from-[#0c399a] hover:to-[#c39517] text-white rounded-lg font-sans text-sm transition-all border border-blue-900 shadow flex items-center gap-2"
            >
              {isDeploying ? "Deploying..." : "Deploy Invariants Contract"}
            </button>
            <button
              onClick={() => { setModalOpen(true); }}
              className="px-4 py-2 bg-gradient-to-r from-[#1d293b] to-[#2451b1] hover:from-[#0c399a] hover:to-[#2a65c4] text-white rounded-lg font-sans text-sm transition-all border border-blue-900 shadow flex items-center gap-2"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M12 5v14m7-7H5"/></svg>
              Create Invariant
            </button>
          </div>
          {isLoadingInvariants && <p className="text-center text-blue-600">Loading invariants...</p>}
          {loadingError && <p className="text-center text-red-600">Error loading invariants: {loadingError.message}</p>}
          <div className="overflow-x-auto rounded-lg border border-blue-100 shadow w-full">
            <table className="min-w-full text-sm bg-white" style={{ color: '#1e293b' }}>
              <thead className="sticky top-0 z-20">
                <tr className="bg-blue-50" style={{ color: '#1e293b' }}>
                  <th className="px-3 py-2 whitespace-nowrap">ID</th>
                  <th className="px-3 py-2 whitespace-nowrap">Name</th>
                  <th className="px-3 py-2 whitespace-nowrap">Asker Address</th>
                  <th className="px-3 py-2 whitespace-nowrap">Type</th>
                  <th className="px-3 py-2 whitespace-nowrap">Rule</th>
                  <th className="px-3 py-2 whitespace-nowrap">Value</th>
                  <th className="px-3 py-2 whitespace-nowrap">Enable</th>
                  <th className="px-3 py-2 whitespace-nowrap">Edit</th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingInvariants && !loadingError && sortedInvariants.map((inv: any, idx: any) => (
                  <tr key={inv.id} className={
                    `border-t border-blue-100 transition-colors ${idx%2===0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                  >
                    <td className="px-3 py-2 text-center text-slate-400 whitespace-nowrap">{inv.id}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">{inv.name}</td>
                    <td className="px-3 py-2 text-center font-mono break-all max-w-[120px] md:max-w-xs lg:max-w-md xl:max-w-lg">
                      <span className="block md:hidden">{shortAddress(inv.asker)}</span>
                      <span className="hidden md:block">{inv.asker}</span>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">{inv.type}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">{inv.rule}</td>
                    <td className="px-3 py-2 text-center font-mono break-all max-w-[120px] md:max-w-xs lg:max-w-md xl:max-w-lg">
                    <span className="block md:hidden">{shortAddress(inv.value)}</span>
                    <span className="hidden md:block">{inv.value}</span>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inv.enabled}
                          onChange={(e) => handleToggle(inv.id, e)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                        <div className="absolute ml-1 mt-0.5 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-4 transition-transform"></div>
                      </label>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(inv)}
                        className="px-2 py-1 bg-gradient-to-r from-[#1d293b] to-[#1a62c7] hover:from-[#1b253b] hover:to-[#c39517] text-white rounded font-mono text-xs transition-colors border border-blue-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Popup for status messages */}
        {showPopup && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center z-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{popupMessage}</span>
            <button onClick={() => setShowPopup(false)} className="ml-4 text-white hover:text-gray-200 font-bold">
              &times;
            </button>
          </div>
        )}
        <Modal open={modalOpen} onClose={handleModalClose} title={editId !== null ? 'Edit Invariant' : 'Create Invariant'}>
          <form onSubmit={handleAddInvariant} className="flex flex-col gap-4 w-full text-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="name" style={{ color: '#1e293b' }}>Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={editId !== null ? editInvariant.name : newInvariant.name}
                onChange={e => handleInputChange(e, editId !== null)}
                placeholder="Name"
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm placeholder:text-slate-400"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="asker" style={{ color: '#1e293b' }}>Asker Address</label>
              <input
                id="asker"
                type="text"
                name="asker"
                value={editId !== null ? editInvariant.asker : newInvariant.asker}
                onChange={e => handleInputChange(e, editId !== null)}
                placeholder="0x..."
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm placeholder:text-slate-400"
                required
                pattern="^0x[a-fA-F0-9]{64}$"
                title="Dirección válida (0x...64 hex)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="type" style={{ color: '#1e293b' }}>Type</label>
              <select
                id="type"
                name="type"
                value={editId !== null ? editInvariant.type : newInvariant.type}
                onChange={e => handleInputChange(e, editId !== null)}
                disabled={editId !== null} // Disable type selection when editing
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm"
                required
              >
                <option value="UINT">UINT</option>
                <option value="ADDRESS">ADDRESS</option>
                 {/*<option value="INT">INT</option> 
                <option value="Bool">BOOL</option>
                <option value="Bytes32">BYTES32</option> */}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="rule" style={{ color: '#1e293b' }}>Rule</label>
              <select
                id="rule"
                name="rule"
                value={editId !== null ? editInvariant.rule : newInvariant.rule}
                onChange={e => handleInputChange(e, editId !== null)}
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm"
                required
              >
                {(() => {
                  const typeValue = (editId !== null ? editInvariant.type : newInvariant.type).toUpperCase();
                  if (["BOOL", "ADDRESS", "BYTES32"].includes(typeValue)) {
                    return [
                      <option value="==" key="eq">== (Igual a)</option>,
                      <option value="!=" key="neq">!= (Diferente)</option>
                    ];
                  } else {
                    return [
                      <option value="<" key="lt">&lt; (Menor que)</option>,
                      <option value=">" key="gt">&gt; (Mayor que)</option>,
                      <option value="==" key="eq">== (Igual a)</option>,
                      <option value="!=" key="neq">!= (Diferente)</option>,
                      <option value=">=" key="gte">&gt;= (Mayor o igual a)</option>,
                      <option value="<=" key="lte">&lt;= (Menor o igual a)</option>
                    ];
                  }
                })()}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="value" style={{ color: '#1e293b' }}>Value</label>
              <input
                id="value"
                type="text"
                name="value"
                value={editId !== null ? editInvariant.value : newInvariant.value}
                onChange={e => handleInputChange(e, editId !== null)}
                placeholder="Value"
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm placeholder:text-slate-400"
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <label className="text-sm font-sans font-semibold" htmlFor="enabled" style={{ color: '#1e293b' }}>Enable</label>
              <input
                id="enabled"
                type="checkbox"
                name="enabled"
                checked={editId !== null ? editInvariant.enabled : newInvariant.enabled}
                onChange={e => handleInputChange(e, editId !== null)}
                disabled={true} // Disable manual editing of enabled state via modal
                className="accent-blue-500 w-4 h-4"
              />
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 bg-gradient-to-r from-[#1d293b] to-[#2451b1] hover:from-[#2451b1] hover:to-[#2a65c4] text-white rounded font-sans text-sm transition-colors mt-2"
            >
              {editId !== null ? 'Save Changes' : 'Create Invariant'}
            </button>
          </form>
          {error && (
            <div className="mt-4 w-full flex items-center justify-center">
              <span className="text-red-600 text-xs flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#f87171" strokeWidth="2" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"/><circle cx="12" cy="16" r="1" fill="#f87171"/></svg>
                {error}
              </span>
            </div>
          )}
        </Modal>
        <Modal open={deployModalOpen} onClose={() => setDeployModalOpen(false)} title="Deploy Invariants Contract">
          <form onSubmit={handleDeploySubmit} className="flex flex-col gap-4 w-full text-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="configurer" style={{ color: '#1e293b' }}>Configurer:</label>
              <input
                id="configurer"
                type="text"
                name="configurer"
                value={deployAddresses.configurer}
                onChange={handleDeployInputChange}
                placeholder="0x..."
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm placeholder:text-slate-400"
                required
                pattern="^0x[a-fA-F0-9]+$" // Basic pattern, refine if needed
                title="Enter a valid Starknet address"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-sans font-semibold" htmlFor="asker" style={{ color: '#1e293b' }}>Asker:</label>
              <input
                id="asker"
                type="text"
                name="asker"
                value={deployAddresses.asker}
                onChange={handleDeployInputChange}
                placeholder="0x..."
                className="px-3 py-2 rounded-lg bg-blue-50 text-slate-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-sm placeholder:text-slate-400"
                required
                pattern="^0x[a-fA-F0-9]+$" // Basic pattern, refine if needed
                title="Enter a valid Starknet address"
              />
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 bg-gradient-to-r from-[#1d293b] to-[#2451b1] hover:from-[#2451b1] hover:to-[#2a65c4] text-white rounded font-sans text-sm transition-colors mt-2"
            >
              Deploy
            </button>
          </form>
          {deployError && <p className="text-red-500 text-center mt-2">Error: {deployError.message}</p>}
        </Modal>
        <p className="mt-6 text-xs text-slate-500 text-center">Welcome. This is your Control Panel.</p>
      </div>
    </div>
  );
} 

