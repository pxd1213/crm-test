import { db } from '../firebase';
import {
  ref,
  set,
  get,
  query,
  orderByChild,
  equalTo,
  onValue
} from 'firebase/database';

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
  CHAT: 'chat',
  PHONE: 'phone',
  TICKET: 'ticket'
};

export class CasesService {
  casesRef;

  constructor() {
    this.casesRef = ref(db, 'cases');
  }

  async createCase(caseData) {
    const newCaseRef = ref(this.casesRef, Date.now());
    await set(newCaseRef, {
      ...caseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: CASE_STATUS.OPEN,
      id: newCaseRef.key
    });
    return newCaseRef.key;
  }

  async getCase(id) {
    const caseRef = ref(this.casesRef, id);
    const snapshot = await get(caseRef);
    if (!snapshot.exists()) {
      throw new Error('Case not found');
    }
    return {
      id: snapshot.key,
      ...snapshot.val()
    };
  }

  async getCases(filters = {}) {
    const caseRef = ref(this.casesRef);
    let queryRef = caseRef;

    if (filters.status) {
      queryRef = query(caseRef, orderByChild('status'), equalTo(filters.status));
    }

    if (filters.priority) {
      queryRef = query(caseRef, orderByChild('priority'), equalTo(filters.priority));
    }

    if (filters.channel) {
      queryRef = query(caseRef, orderByChild('channel'), equalTo(filters.channel));
    }

    queryRef = query(queryRef, orderByChild('createdAt'));

    const snapshot = await get(queryRef);
    return Object.entries(snapshot.val() || {}).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  async updateCase(id, updates) {
    const caseRef = ref(this.casesRef, id);
    await set(caseRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteCase(id) {
    const caseRef = ref(this.casesRef, id);
    await set(caseRef, null);
  }

  async getCaseStats() {
    const caseRef = ref(this.casesRef);
    const snapshot = await get(caseRef);
    const stats = {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0
    };

    const cases = snapshot.val() || {};
    stats.total = Object.keys(cases).length;

    Object.values(cases).forEach(caseData => {
      const status = caseData.status;
      switch (status) {
        case CASE_STATUS.OPEN:
          stats.open++;
          break;
        case CASE_STATUS.IN_PROGRESS:
          stats.inProgress++;
          break;
        case CASE_STATUS.RESOLVED:
          stats.resolved++;
          break;
        case CASE_STATUS.CLOSED:
          stats.closed++;
          break;
      }
    });

    return stats;
  }

  async getRecentActivity(limit = 5) {
    const caseRef = ref(this.casesRef);
    const queryRef = query(caseRef, orderByChild('createdAt'));
    const snapshot = await get(queryRef);
    const cases = snapshot.val() || {};

    return Object.entries(cases)
      .sort(([, a], [, b]) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(([id, caseData]) => ({
        id,
        title: `Case ${caseData.subject}`,
        description: `Status: ${caseData.status}`,
        channel: caseData.channel,
        time: new Date(caseData.createdAt).toLocaleString()
      }))
      .map(activity => ({
        type: activity.channel,
        icon: this.getChannelIcon(activity.channel),
        title: this.getActivityTitle(activity),
        description: activity.description || activity.subject,
        time: this.getTimeAgo(activity.createdAt),
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  getChannelIcon(channel) {
    switch (channel) {
      case CASE_CHANNEL.CHAT:
        return 'Chat';
      case CASE_CHANNEL.EMAIL:
        return 'Email';
      case CASE_CHANNEL.PHONE:
        return 'Phone';
      default:
        return 'SupportAgent';
    }
  }

  getActivityTitle(activity) {
    switch (activity.channel) {
      case CASE_CHANNEL.CHAT:
        return 'New Chat Conversation';
      case CASE_CHANNEL.EMAIL:
        return 'New Email Received';
      case CASE_CHANNEL.PHONE:
        return 'Incoming Support Call';
      default:
        return 'New Support Case';
    }
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp.toDate();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}
