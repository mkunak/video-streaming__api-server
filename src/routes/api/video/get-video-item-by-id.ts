import express from 'express';

import { getVideoItemById } from '../../../route-services/video';

const _router = express.Router({ mergeParams: true });

_router.get('/video-item/:id', getVideoItemById);

export { _router as getVideoItemByIdRouter };
