import initKnex from 'knex';
import config from './knexfile.js';

const knex = initKnex(config.development || config);

knex.schema.alterTable('master_presensi', table => {
    table.string('SHIFT_SNAPSHOT', 255).nullable();
}).then(() => {
    console.log('Column SHIFT_SNAPSHOT added successfully.');
    process.exit(0);
}).catch(err => {
    if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Column already exists.');
        process.exit(0);
    }
    console.error('Error:', err.message);
    process.exit(1);
});
