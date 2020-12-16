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

    function queryUnsignedInteger(uint256 fromRow, uint256 toRow, uint256 noColumn, uint256 operator, uint256 value) public view returns (uint256) {
        if (operator == OP_EQUAL)
            return table.queryRow(fromRow, toRow, noColumn, bytes32(value));
            
        for (uint256 k = fromRow; k <= toRow; k++) {
            uint256 field = uint256(table.getField(k, noColumn));
            
            if (operator == OP_NOT_EQUAL)
                if (field != value)
                    return k;
                else
                    continue;
                    
            if (operator == OP_GREATER)
                if (field > value)
                    return k;
                else
                    continue;
                    
            if (operator == OP_GREATER_OR_EQUAL)
                if (field >= value)
                    return k;
                else
                    continue;
                    
            if (operator == OP_LESS)
                if (field < value)
                    return k;
                else
                    continue;
                    
            if (operator == OP_LESS_OR_EQUAL)
                if (field <= value)
                    return k;
                else
                    continue;
        }
        
        return MAX_INT;
    }
}

