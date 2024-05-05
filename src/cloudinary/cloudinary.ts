import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'bibekdev',
      api_key: '459931782425247',
      api_secret: 'sjM3e_rGTqhkeeNnAmBwzCTC0S8',
    });
  },
};
