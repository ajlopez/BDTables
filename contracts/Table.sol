pragma solidity ^0.6.0;

contract Table {
    uint256 public noRows;
    uint256 public noColumns;
    
    uint256 constant MAX_INT = uint256(-1);
    
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
    
    function updateRow(uint256 noRow, bytes32[] memory fields) public {
        uint256 offset = noRow * noColumns;
        
        for (uint256 k = 0; k < noColumns; k++) {
            assembly {              
                sstore(
                    add(k, add(data_slot, offset)),
                    mload(add(32, add(fields, mul(k, 0x20))))
                )
            }
        }
    }
    
    function getRow(uint256 noRow) public view returns (bytes32[] memory fields) {
        fields = new bytes32[](noColumns);
        
        uint256 offset = noRow * noColumns;
        
        for (uint256 k = 0; k < noColumns; k++) {
            assembly {              
                mstore(
                    add(32, add(fields, mul(k, 0x20))),
                    sload(add(k, add(data_slot, offset)))
                )
            }
        }
    }
    
    function queryRow(
        uint256 fromRow,
        uint256 toRow,
        uint256 noColumn,
        bytes32 value
    ) public view returns (uint256) {
        uint256 offset = fromRow * noColumns + noColumn;
        
        if (toRow >= noRows)
            toRow = noRows - 1;
        
        for (uint256 noRow = fromRow; noRow <= toRow; noRow++) {
            bytes32 cell;
            
            assembly {
                cell := sload(add(data_slot, offset))
            }
            
            if (cell == value)
                return noRow;
            
            offset += noColumns;
        }
        
        return MAX_INT;
    }
}
