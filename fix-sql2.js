const fs = require('fs');
let sql = fs.readFileSync('erperum.sql', 'utf8');

// Match lines like:
// ALTER TABLE `inv_pengiriman_d`
//   MODIFY `ID_PENGIRIMAN_D` int UNSIGNED NOT NULL AUTO_INCREMENT;
// OR
//   MODIFY `ID_PENGIRIMAN_D` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

const lines = sql.split('\n');
let newLines = [];
let i = 0;
let modifiedCount = 0;

while (i < lines.length) {
    let line = lines[i];
    
    // Look for ALTER TABLE `table_name`
    if (line.trim().startsWith('ALTER TABLE `') && i + 1 < lines.length && lines[i+1].includes('MODIFY `')) {
        let tableNameMatch = line.match(/ALTER TABLE `([^`]+)`/);
        let modifyLine = lines[i+1];
        let modifyMatch = modifyLine.match(/MODIFY `([^`]+)`([^;]+)AUTO_INCREMENT/);
        
        if (tableNameMatch && modifyMatch) {
            let tableName = tableNameMatch[1];
            let colName = modifyMatch[1];
            
            // Check if there is an AUTO_INCREMENT=X at the end
            let autoIncValMatch = modifyLine.match(/AUTO_INCREMENT\s*=\s*(\d+)/);
            
            // Now we need to find the CREATE TABLE line for this table and column
            // We search backwards or forwards in newLines/lines
            // Actually, let's just do a string replace on the entire SQL built so far
        }
    }
    
    i++;
}

// Better approach using regex on full text
// The previous regex had an issue because ([^,]+) was too greedy or failed on missing comma.
const modifyRegex = /ALTER TABLE `([^`]+)`\s+MODIFY `([^`]+)`([^;]+?)AUTO_INCREMENT(?:,\s*AUTO_INCREMENT=(\d+))?;/g;
let matches = [...sql.matchAll(modifyRegex)];

for (let match of matches) {
    let fullMatch = match[0];
    let tableName = match[1];
    let colName = match[2];
    let typePart = match[3].trim(); // e.g., "int UNSIGNED NOT NULL"
    let autoInc = match[4];
    
    // Find the create table line for this column and add AUTO_INCREMENT
    // type might contain parenthesis like int(11), we need to escape them for regex
    let escapedType = typePart.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    
    let createRegex = new RegExp("(CREATE TABLE `" + tableName + "`[\\s\\S]*?`" + colName + "`\\s+" + escapedType + ")");
    
    if (createRegex.test(sql)) {
        sql = sql.replace(createRegex, "$1 AUTO_INCREMENT");
        
        // Replace the ALTER TABLE ... MODIFY with just the AUTO_INCREMENT assignment
        if (autoInc) {
            sql = sql.replace(fullMatch, "ALTER TABLE `" + tableName + "` AUTO_INCREMENT = " + autoInc + ";");
        } else {
            sql = sql.replace(fullMatch, "");
        }
    }
}
fs.writeFileSync('erperum_fixed2.sql', sql);
console.log('Fixed ' + matches.length + ' tables.');
