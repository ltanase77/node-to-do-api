const env = process.env.NODE_ENV || "development";
console.log(`***** ${env} *****` );
if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];
    console.log(envConfig);
    Object.keys(envConfig).forEach( function(key) {
        process.env[key] = envConfig[key];
    });
}

/* if (env == 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp';
} else if (env == 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/ToDoAppTest';
} */


