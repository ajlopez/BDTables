
Table = artifacts.require('Table');

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

