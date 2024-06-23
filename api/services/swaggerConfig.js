const swaggerJsdoc = require('swagger-jsdoc');
const PORT = process.env.PORT;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Code Quest API',
            version: '1.0.0',
            description: 'Code Quest API Documentation',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['./controllers/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
