'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
//   region: 'localhost',
//   endpoint: 'http://localhost:8000'
}); // remove when deploying!

module.exports.create = async event => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      content: data.content
    }
  }

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: params.Item
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(
        {
          message: 'Could not create the note.'
        },
        null,
        2
      ),
    };
  }
};

module.exports.getOne = async event => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    const response = await dynamoDb.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: response
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(
        {
          message: 'Error in getting note'
        },
        null,
        2
      ),
    };
  }
};

module.exports.getAll = async event => {
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  try {
    const response = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: response
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(
        {
          message: 'Error in getting note'
        },
        null,
        2
      ),
    };
  }
};

module.exports.update = async event => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    },

    ExpressionAttributeValues: {
      ':content': data.content
    },

    UpdateExpression: 'SET content = :content',

    ReturnValues: 'ALL_NEW'
  };

  try {
    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Note updated'
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(
        {
          message: 'Error in getting note'
        },
        null,
        2
      ),
    };
  }
};

module.exports.delete = async event => {
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Note deleted'
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(
        {
          message: 'Error in delete note'
        },
        null,
        2
      ),
    };
  }

};