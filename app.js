const express = require('express');
const request = require('request');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/generate_image', (req, res) => {
  const description = req.body.description;
  const apiKey = process.env.OPENAI_API_KEY;
  const options = {
    url: 'https://api.openai.com/v1/images/generations',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: description,
      model: 'image-alpha-001'
    })
  };

  request.post(options, (err, resp, body) => {
    if (err) {
      return res.status(500).send(err);
    }
    const response = JSON.parse(body);
    res.send(`
      <html>
        <body>
          <form action="/generate_image" method="post">
            <input type="text" name="description" placeholder="Enter a description" />
            <button type="submit">Generate Image</button>
          </form>
          <br />
          if (!response.data) {
            console.error('Error: No data returned from OpenAI API');
          } else if (!response.data[0]) {
            console.error('Error: No image returned from OpenAI API');
          } else {
            res.send('<img src="${response.data[0].url}" />');
          }
        </body>
      </html>
    `);
  });
});

app.listen(3000, () => {
  console.log('Image generation service listening on port 3000!');
});
