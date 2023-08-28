import express from 'express';

import { getScreenshotsRouter } from './get-screenshots';
import { getScreenshotsByVideoItemIdRouter } from './get-screenshots-by-video-item-id';
import { createScreenshotRouter } from './create-screenshot';
import { updateScreenshotsDatabaseRouter } from './update-screenshots-database';
import { deleteScreenshotRouter } from './delete-screenshot';

const _router = express.Router({ mergeParams: true });

_router.use(getScreenshotsRouter);
_router.use(getScreenshotsByVideoItemIdRouter);
_router.use(createScreenshotRouter);
_router.use(updateScreenshotsDatabaseRouter);
_router.use(deleteScreenshotRouter);

export { _router as screenshotRouter };
