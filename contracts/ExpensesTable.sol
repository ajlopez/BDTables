pragma solidity ^0.6.0;

import './Table.sol';

contract ExpensesTable {
    Table public table;
    
    mapping(bytes32 => string) public hashToString;
    
    uint256 constant MAX_INT = uint256(-1);

    uint256 constant public AMOUNT_COLUMN = 1;
    
    uint256 constant public OP_EQUAL = 0;
    uint256 constant public OP_NOT_EQUAL = 1;
    uint256 constant public OP_GREATER = 2;
    uint256 constant public OP_GREATER_OR_EQUAL = 3;
    uint256 constant public OP_LESS = 4;
    uint256 constant public OP_LESS_OR_EQUAL = 5;
    
    constructor() public {
        table = new Table(2, 1000);
    }
    
    function addRow(string memory description, uint256 amount) public {
        bytes32[] memory fields = new bytes32[](2);
        bytes32 hash = keccak256(abi.encodePacked(description));
        
        assembly {
            mstore(add(fields, 0x20), hash)
            mstore(add(fields, 0x40), amount)
        }
        
        table.addRow(fields);
        
        hashToString[hash] = description;
    }
    
    function updateRow(uint256 noRow, string memory description, uint256 amount) public {
        bytes32[] memory fields = new bytes32[](2);
        bytes32 hash = keccak256(abi.encodePacked(description));
        
        assembly {
            mstore(add(fields, 0x20), hash)
            mstore(add(fields, 0x40), amount)
        }
        
        table.updateRow(noRow, fields);
        
        hashToString[hash] = description;
    }
    
    function getRow(uint256 noRow) public view returns (string memory description, uint256 amount) {
        bytes32[] memory fields = table.getRow(noRow);
        
        description = hashToString[fields[0]];
        amount = uint256(fields[1]);
    }
    
    function deleteRow(uint256 noRow) public {
        table.deleteRow(noRow);
    }
    
    function queryAmount(uint256 fromRow, uint256 toRow, uint256 operator, uint256 value) public view returns (uint256) {
        if (operator == OP_EQUAL)
            return table.queryRow(fromRow, toRow, AMOUNT_COLUMN, bytes32(value));
            
        for (uint256 k = fromRow; k <= toRow; k++) {
            uint256 field = uint256(table.getField(k, AMOUNT_COLUMN));
            
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

