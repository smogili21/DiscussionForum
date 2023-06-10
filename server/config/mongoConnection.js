const MongoClient = require('mongodb').MongoClient;
const settings = {
    mongoConfig: {
        serverUrl: 'mongodb+srv://roundtable:roundtable@cluster0.j8soz.mongodb.net/RoundTable?retryWrites=true&w=majority',
        database: 'Round-Table'

    }
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        _db = await _connection.db(mongoConfig.database);
    }

    return _db;
};