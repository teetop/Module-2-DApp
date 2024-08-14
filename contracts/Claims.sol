// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Claims {


    address immutable owner;

    struct Beneficiary {
        address user;
        uint256 amount;
        uint256 claimTime;
        bool claimed;
    }

    mapping (address => Beneficiary) public beneficiaries;
    mapping (address => uint256) balances;

    event BeneficiaryAdded(address beneficiary, uint256 amount, uint256 claimTime);
    event Claimed(address beneficiary, uint256 amount, uint256 claimTime);

    constructor () {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function addBenefitiary(address _recipient, uint256 _amount, uint256 _time) external onlyOwner {
        
        require(_recipient != address(0), "Address zero not allowed");
        uint256 _claimTime = block.timestamp + _time;
        require(_claimTime > block.timestamp, "Claim time must in future");

        assert(_amount > 0);

        beneficiaries[_recipient] = Beneficiary(_recipient, _amount, _claimTime, false);

        emit BeneficiaryAdded(_recipient, _amount, _claimTime);
    }

    function claimBenefit() external {
        Beneficiary storage _beneficiary = beneficiaries[msg.sender];

        if (_beneficiary.user == address(0)) revert("You are not a beneficiary");
        if (_beneficiary.claimTime > block.timestamp) revert("Not yet time!!!");
        if (_beneficiary.claimed) revert("Benefit claimed already!");

        _beneficiary.claimed = true;

        balances[msg.sender] = _beneficiary.amount;
        emit Claimed(_beneficiary.user, _beneficiary.amount, block.timestamp);
    }

    function yourBalance() external view returns(uint256) {
        uint256 _balance = balances[msg.sender];
        require(_balance > 0, "You have no balance");
        return _balance;
    }
}