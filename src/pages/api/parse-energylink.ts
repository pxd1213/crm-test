import { NextApiRequest, NextApiResponse } from 'next';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import { ParsedData } from '../../components/EnergyLinkUploader';
import formidable from 'formidable';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const form = new formidable.IncomingForm();
    const [file] = await new Promise<File[]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve(Object.values(files));
      });
    });

    // Parse PDF
    const pdfBuffer = Buffer.from(file as any);
    const pdfText = await pdfParse(pdfBuffer);

    // Use OpenAI to parse the text into structured data
    const prompt = `Parse the following EnergyLink PDF statement and extract the following fields:
    - Account Name
    - Statement Date
    - Net Revenue

    Return the data in JSON format with the following structure:
    {
      "accountName": "",
      "statementDate": "",
      "netRevenue": ""
    }

    PDF Text:
    ${pdfText.text}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
}
