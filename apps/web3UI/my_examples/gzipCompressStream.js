const fs = require('fs');
const zlib = require('zlib');

const READ_FILE_NAME = 'data.txt';
const WRITE_FILE_NAME = 'data.txt.gz';

// Create read and write streams
const readStream = fs.createReadStream(READ_FILE_NAME);
const writeStream = fs.createWriteStream(WRITE_FILE_NAME);

// Create brotli compress object
const gzip = zlib.createGzip({level:2});
//const brotli = zlib.createBrotliCompress();

// Pipe the read and write operations with brotli compression
const stream = readStream.pipe(gzip).pipe(writeStream);
//const stream = readStream.pipe(brotli).pipe(writeStream);

stream.on('finish', () => {
  console.log('Done compressing 😎');
});
