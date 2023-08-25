import { getScreenshots } from './queries/get-screenshots';
import { getScreenshotsByVideoItemId } from './queries/get-screenshots-by-video-item-id';
import { createScreenshot } from './actions/create-screenshot';
import { updateScreenshotsDatabase } from './actions/update-screenshots-database';
import { deleteScreenshot } from './actions/delete-screenshot';

export {
  getScreenshots,
  getScreenshotsByVideoItemId,
  createScreenshot,
  updateScreenshotsDatabase,
  deleteScreenshot,
};
