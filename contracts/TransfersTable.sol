pragma solidity ^0.6.0;

import './Table.sol';

contract TransfersTable {
    Table public table;
    
    constructor() public {
        table = new Table(3, 1000);
    }
}
