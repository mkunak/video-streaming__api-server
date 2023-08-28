import express from 'express';

import { getVideoList } from '../../../route-services/video';

const _router = express.Router({ mergeParams: true });

_router.get('/video-list', getVideoList);

export { _router as getVideoListRouter };
