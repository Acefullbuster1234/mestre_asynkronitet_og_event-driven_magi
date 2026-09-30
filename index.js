const express = require('express');
const fs = require('node:fs/promises');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('Hello nobheads!');
});
app.get('/read-file', async (req, res) => {
    try {
        const filinhold = await fs.readFile('data.json', 'utf8');
        const files = JSON.parse(filinhold);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify(files));
    } catch (err) {
        console.error('error reading file', err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('server error');
    }
})
app.post('/write-file', async (req, res) => {
    const { content } = req.body ?? {};

    if (typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({
            fejl: 'you have to send JSON with the field "Content" as text, that is not empty'
        })
    }
    try {
        await fs.writeFile('data.json', JSON.stringify({content}, null, 2), 'utf8');
        res.status(200).json({message: 'the file was updated successfully'});
    }catch(err) {
        console.error('error writing file', err);
        res.status(500).json({fejl: 'the file could not be written in'})
    }
})
app.listen(3000, () => {
    console.log('Server started on port 3000');
});