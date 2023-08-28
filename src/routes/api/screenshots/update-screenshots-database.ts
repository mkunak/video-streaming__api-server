import express from 'express';

import { updateScreenshotsDatabase } from '../../../route-services/screenshots';

const _router = express.Router({ mergeParams: true });

_router.patch('/screenshots', updateScreenshotsDatabase);

export { _router as updateScreenshotsDatabaseRouter };
