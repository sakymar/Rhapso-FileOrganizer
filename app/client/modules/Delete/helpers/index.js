import fs from "fs";

export const deleteFiles = paths => {
  paths.forEach(path => {
    fs.unlinkSync(path);
  });
};
