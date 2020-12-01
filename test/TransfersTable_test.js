
const Table = artifacts.require('Table');
const TransfersTable = artifacts.require('TransfersTable');

contract('TransferTable', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    
    it('initial state', async function () {
        const transfersTable = await TransfersTable.new();
        
        const table = await Table.at(await transfersTable.table());
        
        assert.equal(Number(await table.noColumns()), 3);
        assert.equal(Number(await table.noRows()), 0);
    });
    
    it('add row', async function () {
        const transfersTable = await TransfersTable.new();
        
        const table = await Table.at(await transfersTable.table());
        
        await transfersTable.addRow(alice, bob, 1000);
        
        assert.equal(Number(await table.noColumns()), 3);
        assert.equal(Number(await table.noRows()), 1);
        
        const fields = await table.getRow(0);
        
        assert.equal(fields[0],
            '0x000000000000000000000000' + alice.substring(2).toLowerCase());
        assert.equal(fields[1],
            '0x000000000000000000000000' + bob.substring(2).toLowerCase());            
        assert.equal(Number(fields[2]), 1000);
    });
    
    it('add row and get row', async function () {
        const transfersTable = await TransfersTable.new();
        
        const table = await Table.at(await transfersTable.table());
        
        await transfersTable.addRow(alice, bob, 1000);
        
        const result = await transfersTable.getRow(0);
        
        assert.equal(result.from, alice);
        assert.equal(result.to, bob);
        assert.equal(Number(result.amount), 1000);
    });
});

