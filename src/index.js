import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import { participants } from './services/pix.js';
import { infoLog } from './handlers/exceptionHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: false,
  },
}));

// API routes
app.get('/pix/participants/:ispb', participants);

app.listen(PORT, () => {
  infoLog(`PIX Service running on port ${PORT}`);
  infoLog(`Swagger documentation available at http://localhost:${PORT}/docs`);
});
