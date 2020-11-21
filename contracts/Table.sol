pragma solidity ^0.6.0;

contract Table {
    uint256 public noRows;
    uint256 public noColumns;
    
    bytes32[1000] public data;
    
    constructor(uint256 _noColumns) public {
        noColumns = _noColumns;
    }
    
    function addRow(bytes32[] memory fields) public {
        uint256 offset = noRows * noColumns;
        
        for (uint256 k = 0; k < noColumns; k++) {
            assembly {              
                sstore(
                    add(k, add(data_slot, offset)),
                    mload(add(32, add(fields, mul(k, 0x20))))
                )
            }
        }
        
        noRows++;
    }
    
    function getRow(uint256 noRow) public view returns (bytes32[] memory fields) {
        fields = new bytes32[](noColumns);
        
        uint256 offset = noRow * noColumns;
        
        for (uint256 k = 0; k < noColumns; k++)
            fields[k] = data[offset + k];
    }
}
