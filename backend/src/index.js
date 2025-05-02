import app from "./app.js";
import connectDB from "./db/index.db.js";
import dotenv from 'dotenv'
import colors from 'colors';
colors.enable();

dotenv.config({
    path: './.env'
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server Running on Port: http://localhost:${process.env.PORT} at ${new Date().toLocaleString('en-US')}`
          .bgCyan.bold.underline
      );
    });
  })
  .catch((err) => {
    console.error("Database connection failed!!", err);
  });
