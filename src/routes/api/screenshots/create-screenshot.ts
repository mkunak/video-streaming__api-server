import express from 'express';

import { createScreenshot } from '../../../route-services/screenshots';

const _router = express.Router({ mergeParams: true });

_router.post('/screenshot', createScreenshot);

export { _router as createScreenshotRouter };
