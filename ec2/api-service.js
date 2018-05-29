const http = require('http');
const fs = require('fs');
const os = require('os');
const winston = require('winston');

const dotenv = require('dotenv');
dotenv.config();

const config = {
  appName: process.env.APP_NAME,
  dbUrl: process.env.DB_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
  port: parseInt(process.env.PORT, 10) || 3000,
  responseFile: process.env.RESPONSE_FILE,
  ec2ResIdx: process.env.EC2_RES_IDX || 4
};

const logger = winston.createLogger({
  level: config.logLevel,
  transports: [new winston.transports.Console()],
  format: winston.format.simple()
});

const hostname = os.hostname();

const request = require('superagent');
let metaData = null;
const getEc2Meta = async () => {
  const res = { 'source': 'ref [M]'};
  let value;
  const keys = ['ami-id', 'instance-type', 'local-hostname', 'local-ipv4', 'public-hostname', 'public-ipv4'];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      value = await request.get(`http://169.254.169.254/latest/meta-data/${key}`);
      res[key] = value.text;
    } catch (e) {
      logger.error(`Could not get meta-data for "${key}".`);
    }
  }
  metaData = res;
};
getEc2Meta();

const DbData = require('./db-data');
const dbData = new DbData({ url: config.dbUrl, logger });

const app = new http.Server();

app.on('request', async (req, res) => {
  if (req.method === 'GET' && req.url === '/health-check') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.write(JSON.stringify({ ok: true }));
    res.end();
  } else {
    logger.info(`---> ${req.method} ${req.url}`);
    if (req.method === 'GET' && req.url === '/api/v1/info') {
      try {
        const response = JSON.parse(fs.readFileSync(config.responseFile));
        response[config.ec2ResIdx]['service-name'] = config.appName;
        response[config.ec2ResIdx]['service-port'] = config.port;
        response[config.ec2ResIdx]['meta-data'] = metaData;
        const dbInfo = await dbData.updateInvocations(config.appName);
        if (!dbInfo) { throw new Error(); }
        response[config.ec2ResIdx]['db-stats'] = {
          'rds': 'ref [5]',
          ...dbInfo
        };
        res.writeHead(200, {
          'content-type': 'application/json',
          'access-control-allow-origin': '*'
	      });
        res.write(JSON.stringify(response));
        res.end();
      } catch (e) {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.write(JSON.stringify({
          ok: false,
          message: 'internal error'
        }));
        res.end();
      }
    } else {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.write(JSON.stringify({
        ok: false,
        message: 'bad request'
      }));
      res.end();
    }
  }
});

app.listen(config.port, () => {
  logger.info(`[${config.appName}] started, listening at ${hostname} on port ${config.port}`);
});
dbData.connect();
