pragma solidity ^0.6.0;

contract Table {
    uint256 public noRows;
    uint256 public noColumns;
    uint256 public dataOffset;
    
    uint256 constant MAX_INT = uint256(-1);
    
    constructor(uint256 _noColumns, uint256 _dataOffset) public {
        noColumns = _noColumns;
        dataOffset = _dataOffset;
    }
    
    function addRow(bytes32[] memory fields) public {
        uint256 offset = noRows * noColumns + dataOffset;
        
        for (uint256 k = 0; k < noColumns; k++) {
            assembly {              
                sstore(
                    add(k, offset),
                    mload(add(32, add(fields, mul(k, 0x20))))
                )
            }
        }
        
        noRows++;
    }
    
    function updateRow(uint256 noRow, bytes32[] memory fields) public {
        require(noRow < noRows, "unknown row");
        
        uint256 offset = noRow * noColumns + dataOffset;
        
        for (uint256 k = 0; k < noColumns; k++) {
            assembly {              
                sstore(
                    add(k, offset),
                    mload(add(32, add(fields, mul(k, 0x20))))
                )
            }
        }
    }
    
    function getRow(uint256 noRow) public view returns (bytes32[] memory fields) {
        require(noRow < noRows, "unknown row");
        
        fields = new bytes32[](noColumns);
        
        uint256 offset = noRow * noColumns + dataOffset;
        
        for (uint256 k = 0; k < noColumns; k++) {
            assembly {              
                mstore(
                    add(32, add(fields, mul(k, 0x20))),
                    sload(add(k, offset))
                )
            }
        }
    }
    
    function getField(uint256 noRow, uint256 noColumn) public view returns(bytes32 field) {
        require(noRow < noRows, "unknown row");
        require(noColumn < noColumns, "unknown column");

        uint256 offset = noRow * noColumns + noColumn + dataOffset;
        
        assembly {
                field := sload(offset)
        }
    }
    
    function deleteRow(uint256 noRow) public {
        require(noRow < noRows, "unknown row");
        
        uint256 offset = noRow * noColumns + dataOffset;
        uint256 offset2 = (noRows - 1) * noColumns + dataOffset;
        
        for (uint256 k = 0; k < noColumns; k++) {
            if (offset != offset2) {
                assembly {
                    sstore(
                        add(k, offset),
                        sload(add(k, offset2))
                    )
                }
            }
            
            assembly {              
                sstore(
                    add(k, offset2),
                    0
                )
            }
        }
        
        noRows--;
    }
    
    function queryRow(
        uint256 fromRow,
        uint256 toRow,
        uint256 noColumn,
        bytes32 value
    ) public view returns (uint256) {
        uint256 offset = fromRow * noColumns + noColumn + dataOffset;
        
        if (toRow >= noRows)
            toRow = noRows - 1;
        
        for (uint256 noRow = fromRow; noRow <= toRow; noRow++) {
            bytes32 cell;
            
            assembly {
                cell := sload(offset)
            }
            
            if (cell == value)
                return noRow;
            
            offset += noColumns;
        }
        
        return MAX_INT;
    }
}
