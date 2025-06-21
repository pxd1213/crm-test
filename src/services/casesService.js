import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

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
  constructor() {
    this.casesCollection = collection(db, 'cases');
  }

  async createCase(caseData) {
    const caseRef = doc(this.casesCollection);
    await setDoc(caseRef, {
      ...caseData,
      id: caseRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: CASE_STATUS.OPEN,
    });
    return caseRef.id;
  }

  async getCase(caseId) {
    const caseRef = doc(this.casesCollection, caseId);
    const caseDoc = await getDoc(caseRef);
    if (!caseDoc.exists()) {
      throw new Error('Case not found');
    }
    return { ...caseDoc.data(), id: caseDoc.id };
  }

  async updateCase(caseId, caseData) {
    const caseRef = doc(this.casesCollection, caseId);
    await updateDoc(caseRef, {
      ...caseData,
      updatedAt: new Date(),
    });
  }

  async deleteCase(caseId) {
    const caseRef = doc(this.casesCollection, caseId);
    await deleteDoc(caseRef);
  }

  async getCasesByStatus(status) {
    const q = query(this.casesCollection, where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async getOpenCases() {
    return this.getCasesByStatus(CASE_STATUS.OPEN);
  }

  async getCaseStats() {
    try {
      const [totalCases, avgResponseTime, avgSatisfaction] = await Promise.all([
        this.getTotalCases(),
        this.getAverageResponseTime(),
        this.getAverageSatisfaction(),
      ]);

      return {
        totalCases,
        responseTime: avgResponseTime,
        satisfactionScore: avgSatisfaction,
        openCases: (await this.getOpenCases()).length,
      };
    } catch (error) {
      console.error('Error fetching case stats:', error);
      throw error;
    }
  }

  async getTotalCases() {
    const q = query(this.casesCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }

  async getAverageResponseTime() {
    const q = query(this.casesCollection);
    const querySnapshot = await getDocs(q);
    const cases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const totalResponseTime = cases.reduce((sum, caseData) => {
      if (caseData.responseTime) {
        return sum + caseData.responseTime;
      }
      return sum;
    }, 0);

    return cases.length > 0 ? totalResponseTime / cases.length : 0;
  }

  async getAverageSatisfaction() {
    const q = query(this.casesCollection);
    const querySnapshot = await getDocs(q);
    const cases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const totalScore = cases.reduce((sum, caseData) => {
      if (caseData.satisfactionScore) {
        return sum + caseData.satisfactionScore;
      }
      return sum;
    }, 0);

    return cases.length > 0 ? totalScore / cases.length : 0;
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
