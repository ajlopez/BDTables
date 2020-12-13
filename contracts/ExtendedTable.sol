pragma solidity ^0.6.0;

import './Table.sol';

contract ExtendedTable {
    Table public table;
    
    mapping(bytes32 => string) public hashToString;
    
    uint256 constant MAX_INT = uint256(-1);

    uint256 constant public OP_EQUAL = 0;
    uint256 constant public OP_NOT_EQUAL = 1;
    uint256 constant public OP_GREATER = 2;
    uint256 constant public OP_GREATER_OR_EQUAL = 3;
    uint256 constant public OP_LESS = 4;
    uint256 constant public OP_LESS_OR_EQUAL = 5;
    
    function initialize(uint256 noColumns, uint256 dataOffset) internal {
        table = new Table(noColumns, dataOffset);
    }
}

