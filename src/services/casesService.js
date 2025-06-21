import { mockCases } from '../components/mock/cases.js';

export const CASE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const CASE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const CASE_CHANNEL = {
  EMAIL: 'email',
  PHONE: 'phone',
  CHAT: 'chat',
  TICKET: 'ticket'
};

export class CasesService {
  constructor() {
    // No initialization needed for mock service
  }

  createCase(caseData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCase = {
          id: Date.now().toString(),
          ...caseData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        resolve(newCase);
      }, 1000);
    });
  }

  getCase(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const caseItem = mockCases.find(c => c.id === id);
        resolve(caseItem || null);
      }, 500);
    });
  }

  getCases(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredCases = [...mockCases];
        
        if (filters.status) {
          filteredCases = filteredCases.filter(c => c.status === filters.status);
        }
        if (filters.priority) {
          filteredCases = filteredCases.filter(c => c.priority === filters.priority);
        }
        if (filters.channel) {
          filteredCases = filteredCases.filter(c => c.channel === filters.channel);
        }

        resolve(filteredCases);
      }, 500);
    });
  }

  updateCase(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const caseIndex = mockCases.findIndex(c => c.id === id);
        if (caseIndex !== -1) {
          mockCases[caseIndex] = {
            ...mockCases[caseIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  deleteCase(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const caseIndex = mockCases.findIndex(c => c.id === id);
        if (caseIndex !== -1) {
          mockCases.splice(caseIndex, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  getCaseStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: mockCases.length,
          byStatus: {
            open: mockCases.filter(c => c.status === CASE_STATUS.OPEN).length,
            in_progress: mockCases.filter(c => c.status === CASE_STATUS.IN_PROGRESS).length,
            resolved: mockCases.filter(c => c.status === CASE_STATUS.RESOLVED).length,
            closed: mockCases.filter(c => c.status === CASE_STATUS.CLOSED).length
          },
          byPriority: {
            low: mockCases.filter(c => c.priority === CASE_PRIORITY.LOW).length,
            medium: mockCases.filter(c => c.priority === CASE_PRIORITY.MEDIUM).length,
            high: mockCases.filter(c => c.priority === CASE_PRIORITY.HIGH).length,
            urgent: mockCases.filter(c => c.priority === CASE_PRIORITY.URGENT).length
          },
          byChannel: {
            email: mockCases.filter(c => c.channel === CASE_CHANNEL.EMAIL).length,
            phone: mockCases.filter(c => c.channel === CASE_CHANNEL.PHONE).length,
            chat: mockCases.filter(c => c.channel === CASE_CHANNEL.CHAT).length,
            ticket: mockCases.filter(c => c.channel === CASE_CHANNEL.TICKET).length
          }
        };
        resolve(stats);
      }, 500);
    });
  }

  getRecentActivity(limit = 5) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recent = mockCases
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, limit)
          .map(caseItem => ({
            id: caseItem.id,
            title: caseItem.title,
            status: caseItem.status,
            channel: caseItem.channel,
            updatedAt: caseItem.updatedAt,
            assignedTo: caseItem.assignedTo
          }));
        resolve(recent);
      }, 500);
    });
  }

  getChannelIcon(channel) {
    switch (channel) {
      case CASE_CHANNEL.EMAIL:
        return 'mail';
      case CASE_CHANNEL.PHONE:
        return 'phone';
      case CASE_CHANNEL.CHAT:
        return 'chat_bubble';
      case CASE_CHANNEL.TICKET:
        return 'description';
      default:
        return 'help';
    }
  }

  getActivityTitle(activity) {
    return activity.title || 'Untitled';
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  }
}

export default CasesService;
