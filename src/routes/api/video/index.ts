import express from 'express';

import { getVideoListRouter } from './get-video-list';
import { getVideoItemByIdRouter } from './get-video-item-by-id';
import { streamVideoItemByIdRouter } from './stream-video-by-id';
import { updateVideoItemByIdRouter } from './update-video-item-by-id';
import { updateVideoListDatabaseRouter } from './update-video-list-database';

const _router = express.Router({ mergeParams: true });

_router.use(getVideoListRouter);
_router.use(getVideoItemByIdRouter);
_router.use(streamVideoItemByIdRouter);
_router.use(updateVideoItemByIdRouter);
_router.use(updateVideoListDatabaseRouter);

export { _router as videoRouter };
