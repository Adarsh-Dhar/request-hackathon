// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console} from "forge-std/Script.sol";
import {InvoiceBidding} from "../src/market.sol";
contract InvoiceNFTMarketplaceScript is Script {
    
    
    InvoiceBidding public invoicenftmarketplace;
    function setUp() public {
        // If you need to set up any prerequisites before deployment
    }
    function run() public {
        // Replace these with actual addresses of deployed contracts

        
        // Start broadcasting transactions
        vm.startBroadcast();
        // Deploy the Mira contract
        invoicenftmarketplace = new InvoiceBidding(

        );
        // Log the deployed contract address
        console.log("Invoice marketplace deployed at:", address(invoicenftmarketplace));
        // Stop broadcasting
        vm.stopBroadcast();
    }
}