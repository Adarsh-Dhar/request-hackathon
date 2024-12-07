// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console} from "forge-std/Script.sol";
import {InvoiceNFTMarketplace} from "../src/market.sol";
contract InvoiceNFTMarketplaceScript is Script {
    
    
    InvoiceNFTMarketplace public invoicenftmarketplace;
    function setUp() public {
        // If you need to set up any prerequisites before deployment
    }
    function run() public {
        // Replace these with actual addresses of deployed contracts
        address invoiceNFTAddress = address(0x424B268a73027Fc163A90aE40Ec3a61F926d06c5);
        
        // Start broadcasting transactions
        vm.startBroadcast();
        // Deploy the Mira contract
        invoicenftmarketplace = new InvoiceNFTMarketplace(
        invoiceNFTAddress
        );
        // Log the deployed contract address
        console.log("Invoice marketplace deployed at:", address(invoicenftmarketplace));
        // Stop broadcasting
        vm.stopBroadcast();
    }
}