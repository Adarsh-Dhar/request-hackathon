// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {MockERC20} from "./MockERC20.sol";
import {InvoiceNFT} from "../src/InvoiceNFT.sol";
import {InvoiceNFTMarketplace} from "../src/market.sol";

contract InvoiceNFTMarketplaceTest is Test {
    InvoiceNFT public invoiceNFT;
    InvoiceNFTMarketplace public marketplace;
    MockERC20 public invoiceCurrency;
    MockERC20 public settlementCurrency;
    
    address public owner;
    address public seller;
    address public buyer;

    function setUp() public {
        // Setup addresses
        owner = makeAddr("owner");
        seller = makeAddr("seller");
        buyer = makeAddr("buyer");

        // Deploy mock ERC20 tokens
        vm.startPrank(owner);
        invoiceCurrency = new MockERC20("Invoice Token", "INV");
        settlementCurrency = new MockERC20("Settlement Token", "SETT");

        // Deploy InvoiceNFT contract
        invoiceNFT = new InvoiceNFT();

        // Deploy Marketplace contract
        marketplace = new InvoiceNFTMarketplace(address(invoiceNFT));

        // Mint tokens to seller and buyer
        invoiceCurrency.mint(seller, 1000 ether);
        settlementCurrency.mint(buyer, 1000 ether);
        vm.stopPrank();
    }

    // ... (previous test functions remain the same)

    function testGetInvoiceDetails() public {
        // Create an invoice
        vm.startPrank(seller);
        uint256 tokenId = marketplace.createAndListInvoice(
            seller, 
            "Ethereum", 
            address(invoiceCurrency), 
            address(settlementCurrency), 
            "Test Invoice", 
            10, 
            100, 
            10, 
            5, 
            block.timestamp + 30 days, 
            500
        );
        vm.stopPrank();

        // Retrieve invoice details
        (
            address from,
            address to,
            string memory paymentChain,
            address invoiceCurrencyAddr,
            address settlementCurrencyAddr,
            string memory description,
            uint256 quantity,
            uint256 unitPrice,
            uint256 discount,
            uint256 tax,
            uint256 amount,
            bool isPaid,
            uint256 deadline
        ) = marketplace.getInvoiceDetails(tokenId);

        // Assertions
        assertEq(from, seller, "Incorrect 'from' address");
        assertEq(to, seller, "Incorrect 'to' address");
        assertEq(paymentChain, "Ethereum", "Incorrect payment chain");
        assertEq(invoiceCurrencyAddr, address(invoiceCurrency), "Incorrect invoice currency");
        assertEq(settlementCurrencyAddr, address(settlementCurrency), "Incorrect settlement currency");
        assertEq(description, "Test Invoice", "Incorrect description");
        assertEq(quantity, 10, "Incorrect quantity");
        assertEq(unitPrice, 100, "Incorrect unit price");
        assertEq(discount, 10, "Incorrect discount");
        assertEq(tax, 5, "Incorrect tax");
        assertEq(amount, (10 * 100) - 10 + 5, "Incorrect total amount"); // (quantity * unit_price) - discount + tax
        assertFalse(isPaid, "Invoice should not be paid");
        assertEq(deadline, block.timestamp + 30 days, "Incorrect deadline");
    }

    function testGetActiveListings() public {
        // Create multiple invoices
        vm.startPrank(seller);
        uint256 tokenId1 = marketplace.createAndListInvoice(
            seller, 
            "Ethereum", 
            address(invoiceCurrency), 
            address(settlementCurrency), 
            "Test Invoice 1", 
            10, 
            100, 
            10, 
            5, 
            block.timestamp + 30 days, 
            500
        );

        uint256 tokenId2 = marketplace.createAndListInvoice(
            seller, 
            "Polygon", 
            address(invoiceCurrency), 
            address(settlementCurrency), 
            "Test Invoice 2", 
            5, 
            200, 
            20, 
            10, 
            block.timestamp + 45 days, 
            750
        );
        vm.stopPrank();

        // Retrieve active listings
        InvoiceNFTMarketplace.Listing[] memory listings = marketplace.getActiveListings();

        // Assertions
        assertGt(listings.length, 1, "Should have multiple active listings");
        
        // Check first listing
        assertEq(listings[0].seller, seller, "Incorrect seller for first listing");
        assertEq(listings[0].tokenId, tokenId1, "Incorrect token ID for first listing");
        assertEq(listings[0].listingPrice, 500, "Incorrect listing price for first listing");
        assertTrue(listings[0].isActive, "First listing should be active");

        // Check second listing
        assertEq(listings[1].seller, seller, "Incorrect seller for second listing");
        assertEq(listings[1].tokenId, tokenId2, "Incorrect token ID for second listing");
        assertEq(listings[1].listingPrice, 750, "Incorrect listing price for second listing");
        assertTrue(listings[1].isActive, "Second listing should be active");
    }

    function testGetBidsForToken() public {
        // Create an invoice
        vm.startPrank(seller);
        uint256 tokenId = marketplace.createAndListInvoice(
            seller, 
            "Ethereum", 
            address(invoiceCurrency), 
            address(settlementCurrency), 
            "Test Invoice", 
            10, 
            100, 
            10, 
            5, 
            block.timestamp + 30 days, 
            500
        );
        vm.stopPrank();

        // Place multiple bids from different buyers
        address buyer1 = makeAddr("buyer1");
        address buyer2 = makeAddr("buyer2");

        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);

        vm.prank(buyer1);
        marketplace.placeBid{value: 600}(tokenId);

        vm.prank(buyer2);
        marketplace.placeBid{value: 700}(tokenId);

        // Retrieve bids for the token
        InvoiceNFTMarketplace.Bid[] memory bids = marketplace.getBidsForToken(tokenId);

        // Assertions
        assertEq(bids.length, 2, "Should have two bids");

        // Check first bid
        assertEq(bids[0].bidder, buyer1, "Incorrect first bidder");
        assertEq(bids[0].amount, 600, "Incorrect first bid amount");
        assertEq(uint8(bids[0].status), uint8(InvoiceNFTMarketplace.BidStatus.Pending), "First bid should be pending");
        assertEq(bids[0].tokenId, tokenId, "Incorrect token ID for first bid");

        // Check second bid
        assertEq(bids[1].bidder, buyer2, "Incorrect second bidder");
        assertEq(bids[1].amount, 700, "Incorrect second bid amount");
        assertEq(uint8(bids[1].status), uint8(InvoiceNFTMarketplace.BidStatus.Pending), "Second bid should be pending");
        assertEq(bids[1].tokenId, tokenId, "Incorrect token ID for second bid");
    }
}