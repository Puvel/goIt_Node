const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');
const { promises: fsPromises } = require('fs');

exports.avatarMin = async (req, res, next) => {
  const { path: filePath, destination: multerDest, filename } = req.file;
  const DESTINATION_PATH = './public/images';

  await imagemin([`${multerDest}/${filename}`], {
    destination: './public/images',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  await fsPromises.unlink(filePath);

  req.file.destination = DESTINATION_PATH;
  req.file.path = path.join(DESTINATION_PATH, filename);

  next();
};
