const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// All the Routes

// Create File
app.post('/createfile', (req, res) => {
  const { filename, content, password } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are needed to enter !' });
  }

  if (password && typeof password !== 'string') {
    return res.status(400).json({ error: 'Password must be only a string' });
  }

  const filePath = path.join(__dirname, filename);
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create file' });
    }
    res.status(200).send();
  });
});

// Read File
app.get('/getfile/:filename', (req, res) => {
  const { filename } = req.params;
  const { password } = req.query;

  if (!password) {
    return res.status(401).json({ error: 'Password is required to access this file' });
  }

  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(400).json({ error: 'File not found' });
    }
    res.json({ content: data });
  });
});

// Update File
app.put('/updatefile/:filename', (req, res) => {
  const { filename } = req.params;
  const { content, password } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required for updating file' });
  }

  if (!password) {
    return res.status(401).json({ error: 'Password is required to update this file' });
  }

  const filePath = path.join(__dirname, filename);
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update file' });
    }
    res.status(200).send();
  });
});

// Delete File
app.delete('/deletefile/:filename', (req, res) => {
  const { filename } = req.params;
  const { password } = req.query;

  if (!password) {
    return res.status(401).json({ error: 'Password is required to delete this file' });
  }


  const filePath = path.join(__dirname, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete the file' });
    }
    res.status(200).send();
  });
});

// Get All Files
app.get('/getallfiles', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get the files' });
      }
      res.json({ files: files });
    });
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
