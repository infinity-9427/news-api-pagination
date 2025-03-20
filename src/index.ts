import newsRouter from "./routes/news.routes.js";
import { createApp } from "./app.js";


const PORT: number | string = process.env.PORT || 5000;

const { app, port } = createApp( { port: PORT } );


app.use( "/api/v1/news", newsRouter );



app.listen( port, () => {
  console.log( `Server is running at http://localhost:${PORT}` );
} );
