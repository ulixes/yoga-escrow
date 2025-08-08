// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EscrowOfferETH is ReentrancyGuard {
    enum Status { Created, Accepted, Completed, Cancelled, Disputed }

    struct Slot {
        uint64 start;
        uint32 durationMin;
        int16  tzOffsetMin;
    }

    struct Offer {
        address buyer;
        address teacher;
        uint256 amountWei;
        Status status;
        uint64 createdAt;
        uint32 acceptWindowSecs;
        uint32 completeWindowSecs;
        string[] handlesLower;
        Slot[]   slots;
        uint8    chosenSlot;
    }

    uint8 private constant NONE = 255;
    mapping(uint256 => Offer) public offers;
    uint256 public nextOfferId;

    event OfferCreated(uint256 indexed offerId, address indexed buyer, uint256 amountWei, uint32 acceptWindowSecs, uint32 completeWindowSecs);
    event OfferAccepted(uint256 indexed offerId, address indexed teacher, uint8 slotIdx, string handleLower);
    event OfferCompleted(uint256 indexed offerId, address indexed teacher, uint256 payoutWei);
    event OfferCancelled(uint256 indexed offerId);
    event OfferDisputed(uint256 indexed offerId);

    error NotBuyer();
    error NotTeacher();
    error InvalidStatus();
    error InvalidSlot();
    error AcceptWindowExpired();
    error TooEarly();
    error NothingToRefund();

    modifier onlyBuyer(uint256 offerId) {
        if (msg.sender != offers[offerId].buyer) revert NotBuyer();
        _;
    }
    modifier inStatus(uint256 offerId, Status s) {
        if (offers[offerId].status != s) revert InvalidStatus();
        _;
    }

    function createOffer(
        string[] calldata handlesLower,
        Slot[]    calldata slots,
        uint32 acceptWindowSecs,
        uint32 completeWindowSecs
    ) external payable nonReentrant returns (uint256 offerId) {
        require(msg.value > 0, "No ETH sent");
        require(handlesLower.length > 0 && handlesLower.length <= 3, "1..3 handles");
        require(slots.length > 0 && slots.length <= 3, "1..3 slots");
        require(acceptWindowSecs > 0, "acceptWindowSecs=0");
        require(completeWindowSecs > 0, "completeWindowSecs=0");

        offerId = nextOfferId++;
        Offer storage ofr = offers[offerId];
        ofr.buyer = msg.sender;
        ofr.amountWei = msg.value;
        ofr.status = Status.Created;
        ofr.createdAt = uint64(block.timestamp);
        ofr.acceptWindowSecs = acceptWindowSecs;
        ofr.completeWindowSecs = completeWindowSecs;
        ofr.chosenSlot = NONE;

        for (uint256 i = 0; i < handlesLower.length; i++) {
            ofr.handlesLower.push(handlesLower[i]);
        }
        for (uint256 j = 0; j < slots.length; j++) {
            ofr.slots.push(slots[j]);
        }

        emit OfferCreated(offerId, msg.sender, msg.value, acceptWindowSecs, completeWindowSecs);
    }

    function acceptOffer(
        uint256 offerId,
        uint8 slotIdx,
        string calldata handleLower
    ) external nonReentrant inStatus(offerId, Status.Created) {
        Offer storage ofr = offers[offerId];
        if (block.timestamp > ofr.createdAt + ofr.acceptWindowSecs) revert AcceptWindowExpired();
        if (slotIdx >= ofr.slots.length) revert InvalidSlot();

        bool found;
        for (uint256 i = 0; i < ofr.handlesLower.length; i++) {
            if (keccak256(bytes(ofr.handlesLower[i])) == keccak256(bytes(handleLower))) {
                found = true; break;
            }
        }
        require(found, "handle not in candidates");

        ofr.teacher = msg.sender;
        ofr.chosenSlot = slotIdx;
        ofr.status = Status.Accepted;

        emit OfferAccepted(offerId, msg.sender, slotIdx, handleLower);
    }

    function complete(uint256 offerId)
        external nonReentrant onlyBuyer(offerId) inStatus(offerId, Status.Accepted)
    {
        Offer storage ofr = offers[offerId];
        uint256 amount = ofr.amountWei;
        address teacher = ofr.teacher;

        ofr.amountWei = 0;
        ofr.status = Status.Completed;

        (bool ok, ) = payable(teacher).call{value: amount}("");
        require(ok, "transfer failed");

        emit OfferCompleted(offerId, teacher, amount);
    }

    function cancelBeforeAccept(uint256 offerId)
        external nonReentrant onlyBuyer(offerId) inStatus(offerId, Status.Created)
    {
        Offer storage ofr = offers[offerId];
        uint256 amount = ofr.amountWei;
        if (amount == 0) revert NothingToRefund();

        ofr.amountWei = 0;
        ofr.status = Status.Cancelled;

        (bool ok, ) = payable(ofr.buyer).call{value: amount}("");
        require(ok, "refund failed");

        emit OfferCancelled(offerId);
    }

    function autoRelease(uint256 offerId) external nonReentrant inStatus(offerId, Status.Accepted) {
        Offer storage ofr = offers[offerId];
        require(ofr.chosenSlot != NONE, "no slot chosen");

        Slot memory s = ofr.slots[ofr.chosenSlot];
        uint256 classEnd = uint256(s.start) + uint256(s.durationMin) * 60;
        if (block.timestamp < classEnd + ofr.completeWindowSecs) revert TooEarly();

        uint256 amount = ofr.amountWei;
        address teacher = ofr.teacher;

        ofr.amountWei = 0;
        ofr.status = Status.Completed;

        (bool ok, ) = payable(teacher).call{value: amount}("");
        require(ok, "auto release failed");

        emit OfferCompleted(offerId, teacher, amount);
    }

    function dispute(uint256 offerId) external inStatus(offerId, Status.Accepted) {
        Offer storage ofr = offers[offerId];
        require(msg.sender == ofr.buyer || msg.sender == ofr.teacher, "not party");
        ofr.status = Status.Disputed;
        emit OfferDisputed(offerId);
    }

    function getOffer(uint256 offerId) external view returns (Offer memory) { return offers[offerId]; }
    function getHandles(uint256 offerId) external view returns (string[] memory) { return offers[offerId].handlesLower; }
    function getSlots(uint256 offerId) external view returns (Slot[] memory) { return offers[offerId].slots; }
}
