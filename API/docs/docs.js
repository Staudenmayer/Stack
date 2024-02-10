/**
 * @swagger
 * 
 * tags:
 *  name: Auth
 *  description: The Auth methods of the API
 * /login:
 *  post:
 *      summary: login with the user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Auth'
 *      responses:
 *          200:
 *              description: The logged in user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Auth'
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of your user
 *         password:
 *           type: password
 *           description: The password of your user
 *       example:
 *         email: invalid@email.com
 *         password: password
 */