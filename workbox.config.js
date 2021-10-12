module.exports = {
    InjectManifest: options => {
      options.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024;
      return options;
    }
  };