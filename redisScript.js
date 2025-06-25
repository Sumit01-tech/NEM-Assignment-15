const redis = require('redis');

async function run() {
    const client = redis.createClient();

    client.on('error', (err) => console.error('Redis Client Error:', err));

    await client.connect();

    const key = 'name';
    const value = 'John Doe';

    await client.set(key, value);
    console.log(`Stored: ${key} = ${value}`);

    const storedValue = await client.get(key);
    console.log(`Retrieved: ${key} = ${storedValue}`);

    await client.del(key);
    console.log(`Deleted key: ${key}`);

    await client.quit();
}

run().catch(console.error);
