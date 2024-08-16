// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract Game {

    address immutable owner;
    bytes32 mistery;

    mapping(address => uint256) public balanceOf;

    event GamePlayed(string result);

    constructor(address[] memory players) {
        owner = msg.sender;
        initializePlayers(players);
    }

    function initializePlayers(address[] memory players) private {
        for (uint256 i = 0; i < players.length; i++) {
            balanceOf[players[i]] = 1000;
        }
    }

    function setMistery(string memory _mistery) external returns(bool) {
        require(msg.sender == owner, "ONLY_OWNER");

        mistery = keccak256(abi.encodePacked(_mistery));
        return true;
    }

    function playGame(uint256 _amount, string memory _guess) external {
        require(msg.sender != owner, "OWNER_CANNOT_PLAY!");
        require(balanceOf[msg.sender] >= _amount, "INSUFFICIENT BALANCE");

        bytes32 result = keccak256(abi.encodePacked(_guess));
         uint256 _perc = (_amount * 10) / 100;
         string memory message;

        if (result == mistery) {
            balanceOf[msg.sender] += _perc;
            message = "You Won!";
            
        } else {
            balanceOf[msg.sender] -= _amount;
            message = "You lost!";
        }

        emit GamePlayed(message);

    }
}