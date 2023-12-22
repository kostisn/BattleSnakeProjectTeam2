import ngrok from 'ngrok';
import express from 'express';

export default async function runServer(handlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    console.log("Received GET request on /");
    try {
      const infoResponse = handlers.info(); ":"
      console.log("Info response:", "\n", infoResponse);
      res.send(infoResponse);
    } catch (error) {
      console.error("Error in GET /:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/start", (req, res) => {
    handlers.start(req.body);
    res.send("ok");
  });

  app.post("/move", (req, res) => {
    res.send(handlers.move(req.body));
  });

  app.post("/end", (req, res) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.use(function(req, res, next) {
    res.set("Server", "battlesnake/github/starter-snake-javascript");
    next();
  })

  const host = '0.0.0.0';
  const port = process.env.PORT || 8000;

  app.listen(port, host, async () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`);
  
    if (process.env.NGROK_AUTHTOKEN) {
      try {
        await ngrok.authtoken(process.env.NGROK_AUTHTOKEN);
        const ngrokResponse = await ngrok.connect(port);
        
        // Log the entire response object
        console.log('ngrok response:', ngrokResponse);
        console.log('Type of ngrok response:', typeof ngrokResponse);
  
        // If ngrokResponse is an object, log its properties
        if (typeof ngrokResponse === 'object') {
          Object.keys(ngrokResponse).forEach(key => {
            console.log(key, ':', ngrokResponse[key]);
          });
        }
      } catch (error) {
        console.error(`Error establishing ngrok tunnel: ${error}`);
      }
    } else {
      console.log('NGROK_AUTHTOKEN is not set. Skipping ngrok tunnel.');
    }
  });
}
