import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Money Transfer App',
            version: '1.0.0',
            description: 'API documentation for transferring money',
        },
        servers: [
            {
                url: 'http://localhost:5000', // Update with your server URL
            },
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'Auth management operations',
            },
            {
                name: 'User Profile Management',
                description: 'User profile operations',
            },
            {
                name: 'Money Transfer Management',
                description: 'Money transfer operations',
            },
            {
                name: 'Payment Management',
                description: 'Payment operations',
            },
            {
                name: 'Report Management',
                description: 'Report generation and downloading operations',
            },
        ],

        components: {
            schemas: {
                MoneyRequest: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The ID of the money request',
                        },
                        amount: {
                            type: 'number',
                            description: 'The amount requested',
                        },
                        status: {
                            type: 'string',
                            description: 'The status of the request',
                        },
                    },
                },
                // Add other schemas as needed...
            },

            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
