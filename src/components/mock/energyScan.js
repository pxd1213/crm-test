export const mockEnergyScanData = {
  accountName: 'Sample Account',
  statementDate: '2025-06-21',
  netRevenue: 1234.56,
  usageData: [
    {
      period: '2025-05-01 to 2025-06-30',
      usage: 500,
      cost: 100.50
    },
    {
      period: '2025-06-01 to 2025-07-31',
      usage: 450,
      cost: 90.25
    }
  ],
  billingPeriod: '2025-05-01 to 2025-07-31',
  totalCost: 190.75,
  previousBalance: 0,
  paymentDue: 190.75,
  dueDate: '2025-08-15'
};
