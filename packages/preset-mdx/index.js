const sbMdxPlugin = require('./storybook-mdx-plugin');

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  const {
    babelLoaderOptions,
    mdxOptions,
    mdxLoaderOptions = {},
    rule = {},
  } = options;

  const combinedMdxLoaderOptions = {
    ...mdxLoaderOptions,
    mdPlugins: [
      [
        sbMdxPlugin.md,
        mdxOptions
      ],
      ...(mdxLoaderOptions.mdPlugins || []),
    ],
    compilers: [
      ...(mdxLoaderOptions.compilers || []),
      sbMdxPlugin.createCompiler(mdxOptions),
    ]
  };

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: /.mdx?$/,
          ...rule,
          use: [
            ...wrapLoader('babel-loader', babelLoaderOptions),
            ...wrapLoader('@mdx-js/loader', combinedMdxLoaderOptions),
          ]
        }
      ]
    }
  };
}

function wrapLoader(loader, options) {
  if (options === false) {
    return [];
  }

  return [{
    loader,
    options,
  }];
}

module.exports = { webpack };