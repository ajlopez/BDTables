pragma solidity ^0.6.0;

import './Table.sol';

contract TransfersTable {
    Table public table;
    
    constructor() public {
        table = new Table(3, 1000);
    }
    
    function addRow(address from, address to, uint256 amount) public {
        bytes32[] memory fields = new bytes32[](3);
        
        assembly {
            mstore(add(fields, 0x20), from)
            mstore(add(fields, 0x40), to)
            mstore(add(fields, 0x60), amount)
        }
        
        table.addRow(fields);
    }
    
    function getRow(uint256 noRow) public view returns (address from, address to, uint256 amount) {
        bytes32[] memory fields = table.getRow(noRow);
        
        from = address(uint256(fields[0]));
        to = address(uint256(fields[1]));
        amount = uint256(fields[2]);
    }
    
    function deleteRow(uint256 noRow) public {
        table.deleteRow(noRow);
    }
}

