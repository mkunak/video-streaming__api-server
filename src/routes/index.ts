import express from 'express';

import { router } from './api';

const _routes: { [version: string]: express.Router } = {};

_routes['api'] = router;

export { _routes as routes };
