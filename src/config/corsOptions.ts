import dotenv from 'dotenv';
dotenv.config();

const whitelist = process.env.CORS_WHITELIST?.split(',') || [];

export const corsOptions = {
   origin: function (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS'));
      }
   },
};
