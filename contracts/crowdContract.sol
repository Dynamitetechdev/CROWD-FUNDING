//SPDX-License-Identifier: MIT
pragma solidity >0.5.8 <0.9.0;

contract CrowdFund {
    address public ownerAddress;
    uint256 public minimumEth = 1000;
    address[] public listOfFunders;
    mapping(address => uint) public getAmountPaid;

    constructor() {
        ownerAddress = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerAddress, "Not Owner");
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(msg.value >= minimumEth, "Send 1 eth at least");
        listOfFunders.push(msg.sender);
        getAmountPaid[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        (bool withdrawSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(withdrawSuccess, "Withdrawal Not Successful");

        for (uint256 index = 0; index < listOfFunders.length; index++) {
            address eachFunderAddress = listOfFunders[index];
            getAmountPaid[eachFunderAddress] = 0;
        }
        listOfFunders = new address[](0);
    }
}
