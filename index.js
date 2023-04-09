import weaviate from 'weaviate-ts-client';
import { readFileSync , writeFileSync } from 'fs';
import { Buffer } from 'buffer';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

/**
 * Get Schema
 */
const schemaRes = await client.schema.getter().do();
console.log(schemaRes);


/**
 * Store an Image
 */
const img = readFileSync('./images/1.png');
const b64 = Buffer.from(img).toString('base64');

await client.data.creator().withClassName('IMG').withProperties(
{
    image: b64,
    text: 'MATRIX MEME'
}).do();



/**
 * Query an Image
 */
const test = Buffer.from( readFileSync('./test.jpeg') ).toString('base64');
const resImage = await client.graphql.get().withClassName('IMG').withFields(['image']).withNearImage({ image: test }).withLimit(1).do();

/**
 * Write result to Filesystem
 */
const result = resImage.data.Get.IMG[0].image;
writeFileSync('./result.jpg', result, 'base64');