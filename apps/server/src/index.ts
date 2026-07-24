import app from "./app";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
