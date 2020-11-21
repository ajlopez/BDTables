
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
        
        await table.addRow([ '0x01', '0x02', '0x03', '0x04' ]);
        
        const noColumns = Number(await table.noColumns());
        const noRows = Number(await table.noRows());
        
        assert.equal(noColumns, 4);
        assert.equal(noRows, 1);
    });
    
    it('add and get row', async function () {
        const table = await Table.new(4);
        
        await table.addRow([ toBytes32(1), toBytes32(2), toBytes32(3), toBytes32(4) ]);
        const row = await table.getRow(0);
        
        const noColumns = Number(await table.noColumns());
        const noRows = Number(await table.noRows());
        
        assert.equal(noColumns, 4);
        assert.equal(noRows, 1);
        
        assert.ok(row);
        assert.ok(Array.isArray(row));
        assert.equal(row.length, 4);
        
        assert.equal(row[0], 1);
        assert.equal(row[1], 2);
        assert.equal(row[2], 3);
        assert.equal(row[3], 4);
    });
});

function toBytes32(value) {
    let result = value.toString(16);
    
    while (result.length < 64)
        result = '0' + result;
    
    return '0x' + result;
}
