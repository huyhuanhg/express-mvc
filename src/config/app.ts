const { dirname } = require('path');
const appDir = dirname(require.main?.filename);

const MODEL_FILTER_PATH = `${appDir}/${process.env.MODEL_FILTER_PATH || 'src/ModelFilters'}`

export {
  MODEL_FILTER_PATH
}
