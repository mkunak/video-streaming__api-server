import express from 'express';

import { createScreensaverRouter } from './create-screensaver';

const _router = express.Router({ mergeParams: true });

_router.use(createScreensaverRouter);

export { _router as screensaverRouter };
