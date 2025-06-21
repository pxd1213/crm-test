import { CasesService } from '../../services/casesService';

export default async function handler(req, res) {
  try {
    const casesService = new CasesService();
    
    // Create test cases
    await casesService.createCase({
      subject: "Test Case 1",
      description: "This is a test case for demonstration",
      priority: "medium",
      channel: "email"
    });

    await casesService.createCase({
      subject: "Test Case 2",
      description: "Another test case for testing",
      priority: "high",
      channel: "phone"
    });

    res.status(200).json({ message: "Test cases created successfully" });
  } catch (error) {
    console.error('Error creating test cases:', error);
    res.status(500).json({ error: 'Failed to create test cases' });
  }
}
