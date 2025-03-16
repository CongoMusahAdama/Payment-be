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
            }
        ],

        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the user',
                        },
                        email: {
                            type: 'string',
                            description: 'The email of the user',
                        },
                        password: {
                            type: 'string',
                            description: 'The password of the user',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'The role of the user',
                        },
                        phone: {
                            type: 'string',
                            description: 'The phone number of the user',
                        },
                        address: {
                            type: 'string',
                            description: 'The address of the user',
                        },
                        wallet: {
                            type: 'string',
                            description: 'The wallet ID associated with the user',
                        },
                        transactions: {
                            type: 'array',
                            items: {
                                type: 'string',
                                description: 'Transaction IDs associated with the user',
                            },
                        },
                        kycDocument: {
                            type: 'string',
                            description: 'The KYC document of the user',
                        },
                        moneyRequests: {
                            type: 'array',
                            items: {
                                type: 'string',
                                description: 'Money request IDs associated with the user',
                            },
                        },
                        payments: {
                            type: 'array',
                            items: {
                                type: 'string',
                                description: 'Payment IDs associated with the user',
                            },
                        },
                    },
                },
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
