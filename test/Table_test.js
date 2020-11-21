
Table = artifacts.require('Table');

contract('Table', function (accounts) {
    it('create contract', async function () {
        const table = await Table.new(4);
        
        const noColumns = Number(await table.noColumns());
        const noRows = Number(await table.noRows());
        
        assert.equal(noColumns, 4);
        assert.equal(noRows, 0);
    });
    
    it('add row', async function () {
        const table = await Table.new(4);
        
        await table.addRow(createRowData(0, 4));
        
        const noColumns = Number(await table.noColumns());
        const noRows = Number(await table.noRows());
        
        console.log('noColumns', noColumns);
        console.log('noRows', noRows);
        
        assert.equal(noColumns, 4);
        assert.equal(noRows, 1);
    });
    
    it('add and get row', async function () {
        const table = await Table.new(4);
        
        await table.addRow(createRowData(0, 4));
        const row = await table.getRow(0);
        
        const noColumns = Number(await table.noColumns());
        const noRows = Number(await table.noRows());
        
        assert.equal(noColumns, 4);
        assert.equal(noRows, 1);
        
        checkRowData(row, 0, 4);
    });
    
    it('add and get two rows', async function () {
        const table = await Table.new(4);
        
        await table.addRow(createRowData(0, 4));
        await table.addRow(createRowData(1, 4));

        const noColumns = Number(await table.noColumns());
        const noRows = Number(await table.noRows());
        
        assert.equal(noColumns, 4);
        assert.equal(noRows, 2);
        
        const row = await table.getRow(0);
        
        checkRowData(row, 0, 4);
        
        const row2 = await table.getRow(1);
        
        checkRowData(row2, 1, 4);
    });
});

function createRowData(nrow, ncolumns) {
    const fields = [];
    const initial = nrow * ncolumns + 1;
    
    for (let k = 0; k < ncolumns; k++)
        fields.push(toBytes32(initial + k));
    
    return fields;
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

