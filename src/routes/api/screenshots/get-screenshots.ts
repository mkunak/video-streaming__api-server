import express from 'express';

import { getScreenshots } from '../../../route-services/screenshots';

const _router = express.Router({ mergeParams: true });

_router.get('/screenshots', getScreenshots);

export { _router as getScreenshotsRouter };
