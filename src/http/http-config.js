export const defaultConfig = {
  baseURL: process.env.servicePath,
  withCredentials: true,
  validateStatus(status) {
    return status === 200;
  },
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
};

//上传文件config
export const fileConfig = {
  withCredentials: true,
  headers: {'Content-Type': 'multipart/form-data'}
};

export const getHeader = config => ({
  ...config.headers,
});
