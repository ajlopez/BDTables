pragma solidity ^0.6.0;

import './Table.sol';

contract ExpensesTable {
    Table public table;
    
    mapping(bytes32 => string) public hashToString;
    
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
}

