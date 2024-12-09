const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.get('/fetch-connections', async (req, res) => {
  try {
    const email = req.query.email; // Retrieve email from the request
    const password = req.query.password; // Retrieve password from the request

    // Call your Puppeteer scraping function here (getConnections)
    const connections = await getConnections(email, password);

    // Send the scraped data back to the client as JSON
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Puppeteer scraping function
async function getConnections(email, password) {
  // Your Puppeteer code to log in and scrape LinkedIn connections
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to LinkedIn and login (use your login code here)
  await page.goto('https://www.linkedin.com/login');
  await page.type('input[name="session_key"]', email);
  await page.type('input[name="session_password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Scrape the connections
  await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');
  const connections = await page.evaluate(() => {
    // Scrape connection data (this part depends on how LinkedIn displays it)
    const connectionList = [];
    document.querySelectorAll('.mn-connection-card').forEach(card => {
      const name = card.querySelector('.mn-connection-card__name').innerText;
      const title = card.querySelector('.mn-connection-card__occupation').innerText;
      connectionList.push({ name, title });
    });
    return connectionList;
  });

  await browser.close();
  return connections;
}
