import express from 'express';

import { updateVideoListDatabase } from '../../../route-services/video';

const _router = express.Router({ mergeParams: true });

_router.patch('/video-list', updateVideoListDatabase);

export { _router as updateVideoListDatabaseRouter };
