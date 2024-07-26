import express from 'express';

// Controller imports
import cartItemController from '../controllers/cartItem-controller.js';

// Validator imports
import { listCartItemValidator, cartItemIdValidator, cartItemValidator } from '../serializers/validator/cartItem-controller-validator.js';

const route = express();

/**
 * Route to list all the product list based on various conditions
 */

route.get('/', listCartItemValidator, cartItemController.listCartItemsController);

route.post('/', cartItemValidator, cartItemController.createCartItemController);

route.get('/:cartItemId', cartItemIdValidator, cartItemController.getCartItemByIdController);

route.patch('/:cartItemId', cartItemIdValidator, cartItemValidator, cartItemController.updateCartItemController);

route.delete('/:cartItemId', cartItemIdValidator, cartItemController.deleteCartItemController);

export default route;

