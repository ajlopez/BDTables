
const Table = artifacts.require('Table');

const truffleAssert = require('truffle-assertions');

contract('Table', function (accounts) {
    const MAX_INT = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const DATA_OFFSET = 1000;
    
    describe('initial tests', function () {
        const NO_COLUMNS = 4;
    
        let table;
        
        beforeEach(async function () {
            table = await Table.new(NO_COLUMNS, DATA_OFFSET);
        });
        
        it('create contract', async function () {          
            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 0);
        });
        
        it('add row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            
            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 1);
        });
        
        it('add and get row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            const row = await table.getRow(0);
            
            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 1);
            
            checkRowData(row, 0, NO_COLUMNS);
        });
        
        it('add and get two rows', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            const row = await table.getRow(0);
            
            checkRowData(row, 0, NO_COLUMNS);
            
            const row2 = await table.getRow(1);
            
            checkRowData(row2, 1, NO_COLUMNS);
        });
        
        it('add, update and get row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 1);
            
            await table.updateRow(0, createRowData(1, NO_COLUMNS));
            
            const noColumns2 = Number(await table.noColumns());
            const noRows2 = Number(await table.noRows());
            
            assert.equal(noColumns2, NO_COLUMNS);
            assert.equal(noRows2, 1);

            const row = await table.getRow(0);
            
            checkRowData(row, 1, NO_COLUMNS);
        });
        
        it('cannot update unknown row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 1);
            
            await truffleAssert.reverts(table.updateRow(1, createRowData(1, NO_COLUMNS)));
            
            const noColumns2 = Number(await table.noColumns());
            const noRows2 = Number(await table.noRows());
            
            assert.equal(noColumns2, NO_COLUMNS);
            assert.equal(noRows2, 1);

            const row = await table.getRow(0);
            
            checkRowData(row, 0, NO_COLUMNS);
        });
        
        it('add rows and get field', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            const field00 = await table.getField(0, 0);
            const field12 = await table.getField(1, 2);
            
            assert.equal(field00, 1);
            assert.equal(field12, 7);
        });
        
        it('cannot retrieve field from unknown column', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            await truffleAssert.reverts(table.getField(0, NO_COLUMNS));
        });
        
        it('cannot retrieve field from unknown row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            await truffleAssert.reverts(table.getField(2, 0));
        });
        
        it('add rows and get fields', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            const fields = await table.getFields(0, 1, 2);
            
            assert.equal(fields.length, 2);
            assert.equal(fields[0], 3);
            assert.equal(fields[1], 7);
        });
        
        it('cannot retrieve fields from unknown column', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            await truffleAssert.reverts(table.getFields(0, 1, NO_COLUMNS));
        });
        
        it('cannot retrieve fields from invalid row range', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            await truffleAssert.reverts(table.getFields(2, 0, 0));
        });
        
        it('set field', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            const newData = createRowData(2, NO_COLUMNS)[2];
            
            await table.setField(1, 2, newData);
            
            const field = await table.getField(1, 2);
            
            assert.equal(field, newData);
        });
        
        it('cannot set field in unknown column', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            const newData = createRowData(2, NO_COLUMNS)[2];

            await truffleAssert.reverts(table.setField(0, NO_COLUMNS, newData));
        });
        
        it('cannot set field in unknown row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));
            await table.addRow(createRowData(1, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 2);
            
            const newData = createRowData(2, NO_COLUMNS)[2];

            await truffleAssert.reverts(table.setField(2, 0, newData));
        });

        it('cannot retrieve non existant row', async function () {
            await table.addRow(createRowData(0, NO_COLUMNS));

            const noColumns = Number(await table.noColumns());
            const noRows = Number(await table.noRows());
            
            assert.equal(noColumns, NO_COLUMNS);
            assert.equal(noRows, 1);
            
            await truffleAssert.reverts(table.getRow(1));
        });
    });
    
    describe('query row', function () {
        const NO_COLUMNS = 4;
        const NO_ROWS = 4;
    
        let table;
        
        before(async function () {
            table = await Table.new(NO_COLUMNS, DATA_OFFSET);
            
            for (let k = 0; k < NO_ROWS; k++)
                await table.addRow(createRowData(k, NO_COLUMNS));
            
            const row = await table.getRow(0);
            
            checkRowData(row, 0, NO_COLUMNS);
        });
        
        it('query first row', async function () {
            const noRow = await table.queryRow(0, NO_ROWS - 1, 1, toBytes32(2));
            
            assert.equal(noRow, 0);
        });
        
        it('query unknown row', async function () {
            const noRow = await table.queryRow(0, NO_ROWS - 1, 1, toBytes32(0));
            
            assert.equal(noRow.toString(16), MAX_INT);
        });
        
        it('query unknown row using big range', async function () {
            const noRow = await table.queryRow(0, NO_ROWS * 2, 1, toBytes32(0));
            
            assert.equal(noRow.toString(16), MAX_INT);
        });
        
        it('query second row', async function () {
            const noRow = await table.queryRow(0, NO_ROWS - 1, 1, toBytes32(getValue(1, 1, NO_COLUMNS)));
            
            assert.equal(noRow, 1);
        });
        
        it('query last row', async function () {
            const noRow = await table.queryRow(0, NO_ROWS - 1, 1, toBytes32(getValue(NO_ROWS - 1, 1, NO_COLUMNS)));
            
            assert.equal(noRow, NO_ROWS - 1);
        });
    });
    
    describe('delete row', function () {
        const NO_COLUMNS = 4;
        const NO_ROWS = 4;
    
        let table;
        
        beforeEach(async function () {
            table = await Table.new(NO_COLUMNS, DATA_OFFSET);
            
            for (let k = 0; k < NO_ROWS; k++)
                await table.addRow(createRowData(k, NO_COLUMNS));
            
            const row = await table.getRow(0);
            
            checkRowData(row, 0, NO_COLUMNS);
        });
        
        it('delete first row', async function () {
            await table.deleteRow(0);
            
            const noRows = await table.noRows();
            
            assert.equal(noRows, 3);
            
            checkRowData(await table.getRow(0), 3, NO_COLUMNS);
            checkRowData(await table.getRow(1), 1, NO_COLUMNS);
            checkRowData(await table.getRow(2), 2, NO_COLUMNS);
        });
        
        it('delete second row', async function () {
            await table.deleteRow(1);
            
            const noRows = await table.noRows();
            
            assert.equal(noRows, 3);
            
            checkRowData(await table.getRow(0), 0, NO_COLUMNS);
            checkRowData(await table.getRow(1), 3, NO_COLUMNS);
            checkRowData(await table.getRow(2), 2, NO_COLUMNS);
        });
        
        it('delete last row', async function () {
            await table.deleteRow(3);
            
            const noRows = await table.noRows();
            
            assert.equal(noRows, 3);
            
            checkRowData(await table.getRow(0), 0, NO_COLUMNS);
            checkRowData(await table.getRow(1), 1, NO_COLUMNS);
            checkRowData(await table.getRow(2), 2, NO_COLUMNS);
        });
        
        it('cannot delete non existant row', async function () {
            await truffleAssert.reverts(table.deleteRow(4));
            
            const noRows = await table.noRows();
            
            assert.equal(noRows, 4);
            
            checkRowData(await table.getRow(0), 0, NO_COLUMNS);
            checkRowData(await table.getRow(1), 1, NO_COLUMNS);
            checkRowData(await table.getRow(2), 2, NO_COLUMNS);
            checkRowData(await table.getRow(3), 3, NO_COLUMNS);
        });
    });
});

function createRowData(nrow, ncolumns) {
    const fields = [];
    const initial = nrow * ncolumns + 1;
    
    for (let k = 0; k < ncolumns; k++)
        fields.push(toBytes32(getValue(nrow, k, ncolumns)));
    
    return fields;
}

function getValue(nrow, ncol, ncolumns) {
    return nrow * ncolumns + 1 + ncol;
}

function checkRowData(row, nrow, ncolumns) {
    assert.ok(row);
    assert.ok(Array.isArray(row));
    assert.equal(row.length, ncolumns);
    
    const initial = nrow * ncolumns + 1;
    
    for (let k = 0; k < ncolumns; k++)
        assert.equal(row[k], initial + k);
}

function toBytes32(value) {
    let result = value.toString(16);
    
    while (result.length < 64)
        result = '0' + result;
    
    return '0x' + result;
}

