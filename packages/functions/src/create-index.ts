import axios from 'axios';

const OPENSEARCH_ENDPOINT = process.env.OPENSEARCH_ENDPOINT!;
const COLLECTION_NAME = process.env.COLLECTION_NAME!;
const indexName = 'vector-index'; // The name of the vector index

// Lambda handler function to create the index
export const handler = async (event: any): Promise<any> => {
  const url = `${OPENSEARCH_ENDPOINT}/${COLLECTION_NAME}/index/${indexName}`;

  // Define the request body for creating the vector index
  const indexBody = {
    mappings: {
      properties: {
        my_vector_field: {
          type: 'dense_vector',
          dims: 768, // Adjust the dimensions based on your vector size
        },
      },
    },
  };

  try {
    // Send a PUT request to create the index
    const response = await axios.put(url, indexBody);
    console.log('Index created successfully:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Index created successfully',
        data: response.data,
      }),
    };
  } catch (error) {
    console.error('Error creating index:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating index',
        error: error,
      }),
    };
  }
};
