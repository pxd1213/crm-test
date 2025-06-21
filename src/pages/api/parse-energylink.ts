import { NextApiRequest, NextApiResponse } from 'next';
import pdfParse from 'pdf-parse';
import { Configuration, OpenAIApi } from 'openai';
import { ParsedData } from '../../components/EnergyLinkUploader';
import formidable from 'formidable';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.pdf;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse PDF
    const pdfBuffer = Buffer.from(file.data);
    const pdfText = await pdfParse(pdfBuffer);

    // Use OpenAI to parse the text into structured data
    const prompt = `
      Parse the following EnergyLink statement text and extract the following information:
      - Account Name
      - Statement Date
      - Net Revenue
      
      Return the information in JSON format with these exact field names:
      {
        "accountName": "",
        "statementDate": "",
        "netRevenue": 0
      }
      
      Text to parse:
      ${pdfText.text}
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const parsedData = JSON.parse(completion.data.choices[0].message?.content || '{}');
    res.status(200).json(parsedData as ParsedData);
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process the PDF' });
  }
}
