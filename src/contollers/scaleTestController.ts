import { Request, Response } from 'express';


export const testScale = (req: Request, res: Response) => {
   const randomWeight = Math.floor(Math.random() * 40001) + 10000;

   console.log(`number: ${randomWeight}`)

   res.json({ data: { weight: randomWeight } })
}
