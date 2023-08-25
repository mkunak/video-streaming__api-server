import express from 'express';

import { getScreenshotsByVideoItemId } from '../../../route-services/screenshots';

const _router = express.Router({ mergeParams: true });

_router.get('/screenshots/:videoItemId', getScreenshotsByVideoItemId);

export { _router as getScreenshotsByVideoItemIdRouter };
