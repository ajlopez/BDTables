
const Table = artifacts.require('Table');
const ExpensesTable = artifacts.require('ExpensesTable');

const truffleAssert = require('truffle-assertions');

contract('ExpensesTable', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];
    const dan = accounts[3];
    
    let expensesTable;
    let table;
    
    beforeEach(async function () {
        expensesTable = await ExpensesTable.new();        
        table = await Table.at(await expensesTable.table());
    });
    
    it('initial state', async function () {        
        assert.equal(Number(await table.noColumns()), 2);
        assert.equal(Number(await table.noRows()), 0);
    });
    
    it('add row and get row', async function () {
        await expensesTable.addRow("food", 1000);
        
        assert.equal(Number(await table.noColumns()), 2);
        assert.equal(Number(await table.noRows()), 1);
        
        const result = await expensesTable.getRow(0);
        
        assert.equal(result.description, 'food');
        assert.equal(Number(result.amount), 1000);
    });
    
    it('add rows', async function () {
        await expensesTable.addRow("food", 1000);
        await expensesTable.addRow("clothes", 2000);
        await expensesTable.addRow("ether", 300);
        
        assert.equal(Number(await table.noColumns()), 2);
        assert.equal(Number(await table.noRows()), 3);
    });
    
    it('add rows and delete row', async function () {
        await expensesTable.addRow("food", 1000);
        await expensesTable.addRow("clothes", 2000);
        await expensesTable.addRow("ether", 300);
        
        expensesTable.deleteRow(1)
        
        assert.equal(Number(await table.noColumns()), 2);
        assert.equal(Number(await table.noRows()), 2);
        
        const result = await expensesTable.getRow(0);
        
        assert.equal(result.description, "food");
        assert.equal(Number(result.amount), 1000);

        const result2 = await expensesTable.getRow(1);
        
        assert.equal(result2.description, "ether");
        assert.equal(Number(result2.amount), 300);
    });
    
    it('cannot delete unknow row', async function () {
        await expensesTable.addRow("food", 1000);
        await expensesTable.addRow("clothes", 2000);
        await expensesTable.addRow("ether", 300);
        
        await truffleAssert.reverts(expensesTable.deleteRow(3));
        
        assert.equal(Number(await table.noColumns()), 2);
        assert.equal(Number(await table.noRows()), 3);
    });
    
    it('update row', async function () {
        await expensesTable.addRow("food", 1000);
        await expensesTable.addRow("clothes", 2000);
        await expensesTable.addRow("ether", 300);
        
        await expensesTable.updateRow(1,"gold", 6000);
        
        assert.equal(Number(await table.noColumns()), 2);
        assert.equal(Number(await table.noRows()), 3);
        
        const result = await expensesTable.getRow(1);
        
        assert.equal(result.description, "gold");
        assert.equal(Number(result.amount), 6000);
    });    
    
    it('cannot update unknown row', async function () {
        await expensesTable.addRow("food", 1000);
        await expensesTable.addRow("clothes", 2000);
        await expensesTable.addRow("ether", 300);
        
        await truffleAssert.reverts(expensesTable.updateRow(3, "silver", 6000));
    });    
});

