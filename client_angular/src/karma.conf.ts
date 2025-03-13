/*module.exports = (config) => {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],
    //...
  });
}*/
module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/*.ts'
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  });
};

