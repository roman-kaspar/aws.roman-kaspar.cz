const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

const TableName = process.env['DYNAMODB_TABLE'];

exports.handler = (event, context, callback) => {
  const params1 = {
    Key: {
      id: { S: context.functionName }
    },
    TableName
  };

  const params2 = {
    Item: {
      id: { S: context.functionName },
      count: { N: (1).toString() }
    },
    TableName
  };

  const dynamoReadTimeStart = Date.now();
  dynamodb.getItem(params1, (err1, data1) => {
    const dynamoReadTime = Date.now() - dynamoReadTimeStart;
    console.log(`DynamoDB read query time: ${dynamoReadTime}ms.`);
    if (err1) {
      console.log(`DynamoDB read error: ${err1}`);
      callback({
        statusCode: 500,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          ok: false,
          error: err1
        })
      });
    } else {
      console.log(`Read success: data = ${JSON.stringify(data1)}`);
      if (data1 && data1.Item && data1.Item.count && data1.Item.count.N) {
        params2.Item.count.N = (parseInt(data1.Item.count.N, 10) + 1).toString();
      }
      console.log(`Lambda function "${context.functionName}" has been invoked ${params2.Item.count.N} times already!`);
      const dynamoWriteTimeStart = Date.now();
      dynamodb.putItem(params2, (err2) => {
        const dynamoWriteTime = Date.now() - dynamoWriteTimeStart;
        console.log(`DynamoDB write query time: ${dynamoWriteTime}ms.`);
        if (err2) {
          console.log(`error: ${err2}`);
          callback({
            statusCode: 500,
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              ok: false,
              error: err2
            })
          });
        } else {
          callback(null, {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'access-control-allow-origin': '*'
            },
            body: JSON.stringify({
              ok: true,
              dynamodb: {
                name: TableName,
                readMs: dynamoReadTime,
                writeMs: dynamoWriteTime
              },
              lambda: {
                name: context.functionName,
                invocations: params2.Item.count.N
              }
            })
          });
        }
      });
    }
  });
};
