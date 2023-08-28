import express from 'express';

import { streamVideoItemById } from '../../../route-services/video';

const _router = express.Router({ mergeParams: true });

_router.get('/video/:id', streamVideoItemById);

export { _router as streamVideoItemByIdRouter };
