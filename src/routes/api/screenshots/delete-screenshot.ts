import express from 'express';

import { deleteScreenshot } from '../../../route-services/screenshots';

const _router = express.Router({ mergeParams: true });

_router.delete('/screenshot', deleteScreenshot);

export { _router as deleteScreenshotRouter };
