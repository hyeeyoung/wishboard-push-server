const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({
  path: './.env',
});

module.exports = {
  target: 'node',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pushScheduler.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.DB_HOST': JSON.stringify(process.env.DB_HOST),
      'process.env.DB_USER': JSON.stringify(process.env.DB_USER),
      'process.env.DB_PASSWORD': JSON.stringify(process.env.DB_PASSWORD),
      'process.env.DB_PORT': JSON.stringify(process.env.DB_PORT),
      'process.env.DB_NAME': JSON.stringify(process.env.DB_NAME),
      'process.env.FIREBASE_TYPE': JSON.stringify(process.env.FIREBASE_TYPE),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
        process.env.FIREBASE_PROJECT_ID,
      ),
      'process.env.FIREBASE_PRIVATE_KEY': JSON.stringify(
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ),
      'process.env.FIREBASE_CLIENT_EMAIL': JSON.stringify(
        process.env.FIREBASE_CLIENT_EMAIL,
      ),
      'process.env.FIREBASE_CLIENT_ID': JSON.stringify(
        process.env.FIREBASE_CLIENT_ID,
      ),
      'process.env.FIREBASE_AUTH_URI': JSON.stringify(
        process.env.FIREBASE_AUTH_URI,
      ),
      'process.env.FIREBASE_TOKEN_URI': JSON.stringify(
        process.env.FIREBASE_TOKEN_URI,
      ),
      'process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URI': JSON.stringify(
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URI,
      ),
      'process.env.FIREBASE_CLIENT_X509_CERT_URI': JSON.stringify(
        process.env.FIREBASE_CLIENT_X509_CERT_URI,
      ),
      'process.env.SLACK_API_TOKEN': JSON.stringify(
        process.env.SLACK_API_TOKEN,
      ),
    }),
  ],
  stats: {
    errorDetails: true,
  },
};
