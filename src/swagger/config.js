import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Options de configuration pour swagger-jsdoc
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Documentation for your API endpoints",
        },
    },
    apis: ["./src/swagger/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};