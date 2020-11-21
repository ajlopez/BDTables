pragma solidity ^0.6.0;

contract Table {
    uint256 public noRows;
    uint256 public noColumns;
    
    constructor(uint256 _noColumns) public {
        noColumns = _noColumns;
    }
    
    function addRow(bytes32[] memory fields) public {
        noRows++;
    }
}
