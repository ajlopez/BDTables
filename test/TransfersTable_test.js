
const Table = artifacts.require('Table');
const TransfersTable = artifacts.require('TransfersTable');

contract('TransferTable', function (accounts) {
    it('initial state', async function () {
        const transfersTable = await TransfersTable.new();
        
        const table = await Table.at(await transfersTable.table());
        
        assert.equal(Number(await table.noColumns()), 3);
        assert.equal(Number(await table.noRows()), 0);
    });
});