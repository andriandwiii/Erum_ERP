const fs = require('fs');
let sql = fs.readFileSync('erperum.sql', 'utf8');
const modifyRegex = /ALTER TABLE `([^`]+)`\s+MODIFY `([^`]+)` ([^,]+) AUTO_INCREMENT(?:,\s*AUTO_INCREMENT=(\d+))?;/g;
let matches = [...sql.matchAll(modifyRegex)];
for (let match of matches) {
    let tableName = match[1];
    let colName = match[2];
    let type = match[3];
    let autoInc = match[4];
    
    // Find the create table line for this column and add AUTO_INCREMENT
    // type might contain parenthesis like int(11), we need to escape them for regex
    let escapedType = type.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    
    // We look for CREATE TABLE `tableName` followed by everything up to the column definition
    let createRegex = new RegExp("(CREATE TABLE `" + tableName + "`[\\s\\S]*?`" + colName + "`\\s+" + escapedType + ")");
    
    if (createRegex.test(sql)) {
        sql = sql.replace(createRegex, `$1 AUTO_INCREMENT`);
        
        // Replace the ALTER TABLE ... MODIFY with just the AUTO_INCREMENT assignment
        if (autoInc) {
            sql = sql.replace(match[0], `ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ${autoInc};`);
        } else {
            sql = sql.replace(match[0], '');
        }
    }
}
fs.writeFileSync('erperum_fixed.sql', sql);
console.log('Fixed ' + matches.length + ' tables.');
