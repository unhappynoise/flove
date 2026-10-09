import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const useCloudinary = !!env('CLOUDINARY_NAME');

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: useCloudinary
      ? {
          config: {
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: env('CLOUDINARY_NAME'),
              api_key: env('CLOUDINARY_KEY'),
              api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
              upload: {},
              delete: {},
            },
            security: {
              allowedTypes: allowedMediaTypes,
              deniedTypes,
            },
          },
        }
      : {
          config: {
            security: {
              allowedTypes: allowedMediaTypes,
              deniedTypes,
            },
          },
        },
    email: {
      config: {
        provider: 'strapi-provider-email-brevo',
        providerOptions: {
          apiKey: env('BREVO_API_KEY'),
        },
        settings: {
          defaultSenderEmail: env('EMAIL_FROM'),
          defaultSenderName: 'Flové',
          defaultReplyTo: env('EMAIL_FROM'),
        },
      },
    },
  };
};

export default config;
