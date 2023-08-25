import express from 'express';

import { updateVideoItemById } from '../../../route-services/video';

const _router = express.Router({ mergeParams: true });

_router.patch('/video-item/:id', updateVideoItemById);

export { _router as updateVideoItemByIdRouter };
