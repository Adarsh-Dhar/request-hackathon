// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvoiceBidding {
    // Struct to represent an invoice
    struct Invoice {
        address owner;
        string currency;
        string description;
        uint256 amount;
        uint256 deadline;
        uint256 minPrice;
        bool isActive;
        address highestBidder;
        uint256 highestBid;
    }

    // Array to store all invoices
    Invoice[] public invoices;

    // Mapping to track bids for each invoice
    mapping(uint256 => mapping(address => uint256)) public bids;

    // Event to log invoice creation
    event InvoiceCreated(
        uint256 indexed invoiceId, 
        address indexed owner, 
        string description, 
        uint256 amount
    );

    // Event to log new bid
    event BidPlaced(
        uint256 indexed invoiceId, 
        address indexed bidder, 
        uint256 bidAmount
    );

    // Function to publish an invoice
    function publishInvoice(
        string memory _currency,
        string memory _description,
        uint256 _amount,
        uint256 _deadline,
        uint256 _minPrice
    ) public returns (uint256) {
        // Validate inputs
        require(_amount > 0, "Amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_minPrice > 0, "Minimum price must be greater than 0");

        // Create new invoice
        Invoice memory newInvoice = Invoice({
            owner: msg.sender,
            currency: _currency,
            description: _description,
            amount: _amount,
            deadline: _deadline,
            minPrice: _minPrice,
            isActive: true,
            highestBidder: address(0),
            highestBid: 0
        });

        // Add invoice to array and get its ID
        invoices.push(newInvoice);
        uint256 invoiceId = invoices.length - 1;

        // Emit event
        emit InvoiceCreated(invoiceId, msg.sender, _description, _amount);

        return invoiceId;
    }

    // Function to place a bid on an invoice
    function placeBid(uint256 _invoiceId) public payable {
        // Validate invoice exists and is active
        require(_invoiceId < invoices.length, "Invalid invoice ID");
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.isActive, "Invoice is not active");
        require(block.timestamp <= invoice.deadline, "Bidding has ended");

        // Validate bid amount
        require(msg.value >= invoice.minPrice, "Bid must be at least minimum price");
        require(msg.value > invoice.highestBid, "Bid must be higher than current highest bid");

        // Refund previous highest bidder if exists
        if (invoice.highestBidder != address(0)) {
            payable(invoice.highestBidder).transfer(invoice.highestBid);
        }

        // Update invoice with new highest bid
        invoice.highestBidder = msg.sender;
        invoice.highestBid = msg.value;

        // Store individual bid
        bids[_invoiceId][msg.sender] = msg.value;

        // Emit event
        emit BidPlaced(_invoiceId, msg.sender, msg.value);
    }

    // Function to get all invoices
    function getAllInvoices() public view returns (Invoice[] memory) {
        return invoices;
    }

    // Function to get total number of invoices
    function getInvoiceCount() public view returns (uint256) {
        return invoices.length;
    }

    // Function to close an invoice (only owner can do this)
    function closeInvoice(uint256 _invoiceId) public {
        require(_invoiceId < invoices.length, "Invalid invoice ID");
        Invoice storage invoice = invoices[_invoiceId];
        require(msg.sender == invoice.owner, "Only invoice owner can close");
        
        invoice.isActive = false;

        // Transfer highest bid to invoice owner if a bid was made
        if (invoice.highestBidder != address(0)) {
            payable(invoice.owner).transfer(invoice.highestBid);
        }
    }
}