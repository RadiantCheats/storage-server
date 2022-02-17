import express from 'express';
import config from './config.js';
import fs from 'fs';
import { encrypt, decrypt } from './utils/cypher.js';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = config.port || "3000";
const __dirname = path.resolve(path.dirname('..'));
const keys = config.keys;

app.use('/*', (req, res, next) => {
    if (keys.includes(req.headers['unfortunatism']) && decrypt(req.headers['iv'], req.headers['content']) == encrypt(req.headers['iv'])) {
        next();
    } else {
        res.send({ success: false });
    }
});

// Files

app.use(bodyParser.json())

app.get('/authtokens', (req, res) => {
    return res.sendFile(__dirname + '/storage/authtokens.json');
})
app.post('/authtokens', (req, res) => {
    const body = req.body;
    if (!body) return res.send({ success: false })
    fs.readFile(__dirname + '/storage/authtokens.json', (err, data) => {
        if (err) {
          console.error(err);
          return res.send({ success: false, message: 'An error occurred in fs.' })
        };
        var data = JSON.parse(data);
        data.push(body);
        fs.writeFile(__dirname + '/storage/authtokens.json', JSON.stringify(data, null, 2), (err, result) => {
            if (err) {
                return res.send({ success: false, message: 'An error occurred in fs.' })
            } else {
                return res.send({ success: true, body: JSON.stringify(data, null, 2) })
            }
        });
      });
})

app.get('/giveaways', (req,res) => {
    return res.sendFile(__dirname + '/giveaways.json');
})
app.post('/giveaways', (req, res) => {
    const body = req.body;
    if (!body) return res.send({ success: false })
    fs.writeFile(__dirname + '/storage/giveaways.json', JSON.stringify(body), (err, result) => {
        if (err) {
            return res.send({ success: false, message: 'An error occurred in fs.' })
        } else {
            return res.send({ success: true, body: JSON.stringify(body) })
        }
    })
})

app.get('/backups', (req,res) => {
    const id = req.query.id;
    if (!id) return res.send({ success: false })
    return res.sendFile(__dirname + `/storage/backups/${id}.json`);
})
app.post('/backups', (req, res) => {
    const id = req.query.id;
    const body = req.body;

    if (!body) return res.send({ success: false })
    if (!id) return res.send({ success: false })

    fs.writeFile(__dirname + `/storage/backups/${id}.json`, JSON.stringify(body), (err, result) => {
        if (err) {
            return res.send({ success: false, message: 'An error occurred in fs.' })
        } else {
            return res.send({ success: true, body: JSON.stringify(body) })
        }
    })
})

app.use(bodyParser.text())

app.get('/transcripts', (req,res) => {
    app.use(bodyParser.text())
    const id = req.query.id;
    if (!id) return res.send({ success: false })
    return res.sendFile(__dirname + `/storage/transcripts/${id}.html`);
})
app.post('/transcripts', (req, res) => {
    const id = req.query.id;
    const body = req.body;

    console.log(body)
    if (!body) return res.send({ success: false })
    if (!id) return res.send({ success: false })

    fs.writeFile(__dirname + `/storage/transcripts/${id}.html`, body, (err, result) => {
        if (err) {
            return res.send({ success: false, message: 'An error occurred in fs.' })
        } else {
            return res.send({ success: true, body: body })
        }
    })
})

app.listen(port, () => console.log(`Server listening on port ${port}.`));

process.on('unhandledRejection', (e) => console.log(e));
process.on('rejectionHandled', (e) => console.log(e));
process.on('uncaughtException', (e) => console.log(e));

function alert (error) {
    // add later
}