import { Router } from 'express';


// User-route
const userRouter = Router();


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
export default baseRouter;
