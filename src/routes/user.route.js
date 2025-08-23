import express from 'express';
import { userSync, getCurrentUser } from '../controllers/user.controller.js';
import { requireAuth } from '@clerk/express';

const route= express.Router();

route.post("/sync",requireAuth(),userSync)
route.get("/me", getCurrentUser);

export default route;