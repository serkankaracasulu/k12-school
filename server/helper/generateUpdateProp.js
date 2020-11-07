module.exports = function generateUpdateProp(values) {
  let doc = { $set: {} };
  for (const key in values) {
    if (key !== "_id") {
      const prop = {
        [key]: values[key]
      };
      doc.$set = { ...doc.$set, ...prop };
    }
  }
  return doc;
};
