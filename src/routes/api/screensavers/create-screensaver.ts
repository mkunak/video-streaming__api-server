import express from 'express';

import { createScreensaver } from '../../../route-services/screensavers';

const _router = express.Router({ mergeParams: true });

_router.post('/screensaver', createScreensaver);

export { _router as createScreensaverRouter };
