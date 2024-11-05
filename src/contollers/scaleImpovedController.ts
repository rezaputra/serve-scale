import { Request, Response } from 'express';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import 'dotenv/config';

export const getImprovedScale = async (req: Request, res: Response) => {
   // Set up serial port configuration
   const serialPort = new SerialPort({
      path: process.env.SCALE_PORT as string,
      baudRate: 2400,
      dataBits: 7,
      parity: 'none',
      stopBits: 1,
      autoOpen: false
   });

   const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

   try {
      // Open the serial port (wrapped in a promise)
      await new Promise<void>((resolve, reject) => {
         serialPort.open((err) => {
            if (err) {
               console.error('Error opening port:', err.message);
               return reject(new Error('Failed to open serial port'));
            }
            console.log('Port opened successfully! Waiting for data...');
            resolve();
         });
      });

      // Await data from the parser
      const weightData = await new Promise<string>((resolve, reject) => {
         parser.once('data', (data) => {
            console.log('Data received:', data);
            resolve(data.trim());
         });

         // Set a timeout for data retrieval (e.g., 5 seconds)
         setTimeout(() => reject(new Error('Timeout: No data received from scale')), 5000);
      });

      const parsedWeight = parseInt(weightData.split(',')[2].replace(/[^\d]/g, ''), 10);

      // Respond with the weight data
      res.json({ data: { weight: parsedWeight } });
   } catch (error: any) {
      // Error handling (port open failure, timeout, etc.)
      console.error('Error:', error.message);
      res.status(500).json({ message: error.message });
   } finally {
      // Close the port after use
      if (serialPort.isOpen) {
         serialPort.close((err) => {
            if (err) {
               console.error('Error closing port:', err.message);
            } else {
               console.log('Port closed successfully');
            }
         });
      }
   }
};
