# ZamnaSec Starknet Reignite Hackathon

This is the code of the ZamnaSec protocol created for the Starknet Reignite Hackathon.

Frontend folder: Holds the Frontend app created in Nextjs/react/typescript. It implements the Starknet react Hooks to interact with the starknet blockchain.

The project is starknet foundry proyect, so the src folder holds the contract's code write in cairo and deployed on the Sepolia Starknet chain for this hackathon.

To implement the smart contract's code locally follow the steps in the snfoundry website, and for the frontend create a nextjs app using the code in the frontend folder.

If you want to test locally, then you should deploy new contracts. In the Zamna Factory you should allow a deployer address (function: allowInvariantsDeployer), so you can deploy an invariants contract after deployment of the contracts, you should update the contracts addresses in the frontend app so the frontend can use this new contracts to update the interface.

This are the address of the contracts deployed on sepolia starknet showed in the Demo Video:

```
    Zamna Factory Deployment:
Contract deployed: 0x00ec7db7f6bb1d9b0895ded0a2c9758964951db8ece69dda78212f8f432e7afb

    Zamna Invariants Enforcer:
Contract deployed: 0x006587786730dbfbd9a0cf5e3a323c29031d2a386b20f054a1b3c351acb794cb

    Vault Deployment.
Contract deployed: 0x005789d1f5b42ba3ad111ed93b7a704f742af1ccf956a7a0c536f9319b6d5d99
```
