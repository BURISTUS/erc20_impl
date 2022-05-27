//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Math {
    function add(uint a, uint b) public pure returns (uint result) {
        result = a + b;
        require(result >= a);
    }

    function sub(uint a, uint b) public pure returns (uint result) {
        require(b <= a);
        result = a - b;
    }
}

contract RinusToken is Math {
    string public name = "RinusToken";
    string public symbol = "RINC";
    uint8 public decimals = 8;
    uint public tokenSupply = 10000000000;
    address public owner;

    mapping(address => uint) private balances;
    mapping(address => mapping(address => uint)) private allowances;

    modifier onlyOwner(){
        require(msg.sender == owner, "Not an owner");
        _;
    }

    modifier enoughTokens(address addr, uint amount){
        require(balances[addr] >= amount, "Not enough tokens");
        _;
    }

    modifier havePay(){
        require(msg.value > 0, "You have to pay for ft");
        _;
    }

    event Transfer(address indexed sender, address recipient, uint amount);
    event Approval(address indexed owner, address spender, uint amount);

    constructor() {
        owner = msg.sender;
        balances[owner] = tokenSupply;
    }

    function totalSupply() public view returns(uint) {
        return balances[owner];
    }

    function mint(address account, uint amount) external onlyOwner{
        balances[account] = add(balances[account], amount);
        tokenSupply = add(tokenSupply, amount);
        emit Transfer(address(0), account, amount);
    }

    function burn(uint amount) public {
        balances[msg.sender] = sub(balances[msg.sender], amount);
        tokenSupply = sub(tokenSupply, amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    function balanceOf(address tokenOwner) public view returns(uint) {
        return balances[tokenOwner];
    }

    function allowance(address tokenOwner) public view returns(uint balance){
        return balances[tokenOwner];
    }

    function transfer(address recipient, uint amount) public enoughTokens(msg.sender, amount) returns(bool){
        balances[recipient] = add(balances[recipient], amount);
        balances[msg.sender] = sub(balances[msg.sender], amount);
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) public enoughTokens(msg.sender, amount) returns (bool) {
        allowances[msg.sender][spender] = add(allowances[msg.sender][spender], amount);
        emit Approval(msg.sender, spender, amount);
        return true;
    }


}
