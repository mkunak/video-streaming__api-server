import express from 'express';

import { videoRouter } from './video';
import { screenshotRouter } from './screenshots';
import { screensaverRouter } from './screensavers';

const _router = express.Router({ mergeParams: true });

_router.use(videoRouter);
_router.use(screenshotRouter);
_router.use(screensaverRouter);

export { _router as router };
