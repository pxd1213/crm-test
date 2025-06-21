import { db } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

export const CASE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const CASE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const CASE_TYPE = {
  BUG: 'bug',
  FEATURE_REQUEST: 'feature_request',
  TECHNICAL_SUPPORT: 'technical_support',
  BILLING: 'billing',
  GENERAL_INQUIRY: 'general_inquiry',
};

export const CASE_CHANNEL = {
  EMAIL: 'email',
  CHAT: 'chat',
  PHONE: 'phone',
  TICKET: 'ticket',
};

export class CasesService {
  constructor() {
    this.casesCollection = collection(db, 'cases');
  }

  async createCase(caseData) {
    try {
      const caseRef = await addDoc(this.casesCollection, {
        ...caseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: CASE_STATUS.OPEN,
      });
      return caseRef.id;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  }

  async getCases(filters = {}) {
    try {
      let q = query(this.casesCollection);

      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.priority) {
        q = query(q, where('priority', '==', filters.priority));
      }
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters.channel) {
        q = query(q, where('channel', '==', filters.channel));
      }
      if (filters.assignedTo) {
        q = query(q, where('assignedTo', '==', filters.assignedTo));
      }

      // Add sorting and pagination
      q = query(q, orderBy('createdAt', 'desc'));
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  }

  async updateCase(caseId, updates) {
    try {
      const caseRef = doc(this.casesCollection, caseId);
      await updateDoc(caseRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  }

  async getCaseStats() {
    try {
      const stats = {
        totalCases: 0,
        openCases: 0,
        resolvedCases: 0,
        responseTime: 0,
        satisfactionScore: 0,
        activeChats: 0,
        unreadEmails: 0,
        pendingCalls: 0,
      };

      // Get total cases
      const totalCasesQuery = query(this.casesCollection);
      const totalCasesSnapshot = await getDocs(totalCasesQuery);
      stats.totalCases = totalCasesSnapshot.size;

      // Get cases by status
      const openCasesQuery = query(this.casesCollection, where('status', '==', CASE_STATUS.OPEN));
      const openCasesSnapshot = await getDocs(openCasesQuery);
      stats.openCases = openCasesSnapshot.size;

      const resolvedCasesQuery = query(this.casesCollection, where('status', '==', CASE_STATUS.RESOLVED));
      const resolvedCasesSnapshot = await getDocs(resolvedCasesQuery);
      stats.resolvedCases = resolvedCasesSnapshot.size;

      // Calculate average response time (simplified for now)
      const recentCasesQuery = query(this.casesCollection, orderBy('createdAt', 'desc'), limit(10));
      const recentCasesSnapshot = await getDocs(recentCasesQuery);
      const recentCases = recentCasesSnapshot.docs.map(doc => doc.data());
      
      const responseTimes = recentCases
        .filter(caseData => caseData.responseTime)
        .map(caseData => caseData.responseTime);
      
      if (responseTimes.length > 0) {
        stats.responseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      }

      // Get active chats
      const activeChatsQuery = query(this.casesCollection, 
        where('channel', '==', CASE_CHANNEL.CHAT),
        where('status', 'in', [CASE_STATUS.OPEN, CASE_STATUS.IN_PROGRESS])
      );
      const activeChatsSnapshot = await getDocs(activeChatsQuery);
      stats.activeChats = activeChatsSnapshot.size;

      return stats;
    } catch (error) {
      console.error('Error fetching case stats:', error);
      throw error;
    }
  }

  async getRecentActivity(limit = 5) {
    try {
      const activityQuery = query(
        this.casesCollection,
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const activitySnapshot = await getDocs(activityQuery);
      return activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).map(activity => ({
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
        return <ChatIcon color="primary" />;
      case CASE_CHANNEL.EMAIL:
        return <EmailIcon color="secondary" />;
      case CASE_CHANNEL.PHONE:
        return <PhoneIcon color="success" />;
      default:
        return <SupportAgentIcon color="primary" />;
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
