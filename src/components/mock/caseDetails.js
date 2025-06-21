// Mock case details data
export const mockCaseDetails = {
  id: '123456789',
  title: 'Customer Service Escalation - Billing Dispute',
  description: 'Customer reported incorrect billing charges for the last quarter. Amount disputed: $450.00',
  status: 'in_progress',
  priority: 'high',
  channel: 'email',
  createdAt: '2025-06-15T14:30:00Z',
  updatedAt: '2025-06-21T15:20:00Z',
  assignedTo: {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com'
  },
  customer: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 555-0123',
    accountNumber: 'ACCT123456'
  },
  history: [
    {
      timestamp: '2025-06-15T14:30:00Z',
      type: 'created',
      description: 'Case created by Sarah Johnson',
      notes: 'Customer reported incorrect billing charges. Amount disputed: $450.00'
    },
    {
      timestamp: '2025-06-15T15:00:00Z',
      type: 'comment',
      description: 'Initial investigation started',
      notes: 'Reviewing billing records for Q2 2025. Checking system logs for any discrepancies.'
    },
    {
      timestamp: '2025-06-16T09:00:00Z',
      type: 'status_update',
      description: 'Status changed to In Progress',
      notes: 'Discrepancy found in billing system. Preparing refund documentation.'
    },
    {
      timestamp: '2025-06-21T15:20:00Z',
      type: 'comment',
      description: 'Customer update',
      notes: 'Waiting for customer to review refund documentation before finalizing.'
    }
  ],
  documents: [
    {
      id: 'doc1',
      name: 'billing-dispute-2025-q2.pdf',
      type: 'pdf',
      uploadedAt: '2025-06-15T14:30:00Z',
      uploadedBy: 'Sarah Johnson'
    },
    {
      id: 'doc2',
      name: 'refund-documentation-2025-q2.pdf',
      type: 'pdf',
      uploadedAt: '2025-06-16T09:00:00Z',
      uploadedBy: 'Sarah Johnson'
    }
  ],
  comments: [
    {
      id: 'comment1',
      author: 'Sarah Johnson',
      timestamp: '2025-06-15T15:00:00Z',
      content: 'Initial investigation started. Reviewing billing records for Q2 2025. Checking system logs for any discrepancies.'
    },
    {
      id: 'comment2',
      author: 'John Smith',
      timestamp: '2025-06-16T10:00:00Z',
      content: 'I appreciate you looking into this. The charges seem higher than what we were quoted.'
    },
    {
      id: 'comment3',
      author: 'Sarah Johnson',
      timestamp: '2025-06-21T15:20:00Z',
      content: 'I found the discrepancy. It seems there was a double-charging issue in our system. I\'ve prepared the refund documentation. Could you review it and let me know if you have any questions?'
    }
  ]
};
