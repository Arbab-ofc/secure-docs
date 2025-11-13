import { db } from '../config/firebase';
import { categoryIcons } from '../utils/validators';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';


const documentsCollection = collection(db, 'documents');
const sharedLogsCollection = collection(db, 'sharedDocuments');


class DocumentService {
  
  async uploadDocument(userId, documentData) {
    try {
      const docRef = await addDoc(documentsCollection, {
        userId,
        title: documentData.title,
        description: documentData.description,
        category: documentData.category,
        documentType: documentData.documentType,
        cloudinaryUrl: documentData.cloudinaryUrl,
        cloudinaryPublicId: documentData.cloudinaryPublicId,
        fileSize: documentData.fileSize,
        mimeType: documentData.mimeType,
        tags: documentData.tags || [],
        shareEnabled: false,
        publicShareUrl: null,
        qrCodeData: null,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      
      await this.updateUserDocumentCount(userId, 1);

      return {
        success: true,
        documentId: docRef.id,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to upload document'
      };
    }
  }

  
  async getUserDocuments(userId, options = {}) {
    try {
      const {
        limit: pageSize = 10,
        startAfter: startAfterDoc,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        category,
        search
      } = options;

      let q = query(documentsCollection, where('userId', '==', userId));

      
      if (category && category !== 'all') {
        q = query(q, where('category', '==', category));
      }

      
      q = query(q, orderBy(sortBy, sortOrder));

      
      q = query(q, limit(pageSize));

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const documents = [];

      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        });
      });

      
      if (search) {
        const filteredDocuments = documents.filter(doc =>
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          doc.description.toLowerCase().includes(search.toLowerCase())
        );
        return {
          success: true,
          documents: filteredDocuments,
          hasMore: querySnapshot.docs.length === pageSize,
          lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
        };
      }

      return {
        success: true,
        documents,
        hasMore: querySnapshot.docs.length === pageSize,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        error: error.message,
        documents: []
      };
    }
  }

  
  async getDocument(documentId, userId = null) {
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      const documentData = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
      };

      
      if (userId && documentData.userId !== userId) {
        return {
          success: false,
          error: 'Access denied'
        };
      }

      return {
        success: true,
        document: documentData
      };
    } catch (error) {
      console.error('Error getting document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  async updateDocument(documentId, userId, updateData) {
    try {
      
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      if (docSnap.data().userId !== userId) {
        return {
          success: false,
          error: 'Access denied'
        };
      }

      
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Document updated successfully'
      };
    } catch (error) {
      console.error('Error updating document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  async deleteDocument(documentId, userId) {
    try {
      
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      if (docSnap.data().userId !== userId) {
        return {
          success: false,
          error: 'Access denied'
        };
      }

      
      await deleteDoc(docRef);

      
      await this.updateUserDocumentCount(userId, -1);

      return {
        success: true,
        message: 'Document deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  async updateDocumentSharing(documentId, userId, shareData) {
    try {
      const result = await this.updateDocument(documentId, userId, shareData);

      if (result.success) {
        
        if (shareData.shareEnabled) {
          await this.logSharedDocument(documentId, userId, 'enabled');
        }
      }

      return result;
    } catch (error) {
      console.error('Error updating sharing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  async getPublicDocument(documentId) {
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      const documentData = docSnap.data();

      if (!documentData.shareEnabled) {
        return {
          success: false,
          error: 'Document is not shared'
        };
      }

      
      if (documentData.shareExpiry) {
        const expiryTime = documentData.shareExpiry.toDate();
        if (new Date() > expiryTime) {
          return {
            success: false,
            error: 'Sharing link has expired'
          };
        }
      }

      
      await updateDoc(docRef, {
        viewCount: increment(1)
      });

      
      await this.logSharedDocument(documentId, documentData.userId, 'viewed');

      return {
        success: true,
        document: {
          id: docSnap.id,
          title: documentData.title,
          description: documentData.description,
          category: documentData.category,
          documentType: documentData.documentType,
          cloudinaryUrl: documentData.cloudinaryUrl,
          fileSize: documentData.fileSize,
          createdAt: documentData.createdAt?.toDate() || new Date(),
          viewCount: documentData.viewCount + 1,
          sharedBy: {
            name: 'Anonymous', 
            email: 'User'
          }
        }
      };
    } catch (error) {
      console.error('Error getting public document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  async getUserDocumentStats(userId) {
    try {
      const q = query(
        documentsCollection,
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const documents = [];

      querySnapshot.forEach((doc) => {
        documents.push({
          ...doc.data(),
          id: doc.id
        });
      });

      const stats = {
        totalDocuments: documents.length,
        sharedDocuments: documents.filter(doc => doc.shareEnabled).length,
        totalViews: documents.reduce((sum, doc) => sum + (doc.viewCount || 0), 0),
        totalStorage: documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0),
        categoryStats: {
          education: documents.filter(doc => doc.category === 'education').length,
          healthcare: documents.filter(doc => doc.category === 'healthcare').length,
          government: documents.filter(doc => doc.category === 'government').length,
          transportation: documents.filter(doc => doc.category === 'transportation').length,
          others: documents.filter(doc => doc.category === 'others').length
        }
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return {
        success: false,
        error: error.message,
        stats: {
          totalDocuments: 0,
          sharedDocuments: 0,
          totalViews: 0,
          totalStorage: 0,
          categoryStats: {}
        }
      };
    }
  }

  
  async logSharedDocument(documentId, userId, action) {
    try {
      await addDoc(sharedLogsCollection, {
        documentId,
        sharedBy: userId,
        action, 
        accessedAt: serverTimestamp(),
        ipAddress: null, 
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging shared document:', error);
      
    }
  }

  
  async updateUserDocumentCount(userId, increment) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        documentCount: increment(increment)
      });
    } catch (error) {
      console.error('Error updating user document count:', error);
    }
  }

  
  async searchDocuments(userId, searchTerm, options = {}) {
    try {
      const {
        category = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limit: searchLimit = 20
      } = options;

      let q = query(
        documentsCollection,
        where('userId', '==', userId),
        orderBy(sortBy, sortOrder),
        limit(searchLimit)
      );

      const querySnapshot = await getDocs(q);
      const documents = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();

        
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesTitle = docData.title?.toLowerCase().includes(searchLower);
          const matchesDescription = docData.description?.toLowerCase().includes(searchLower);
          const matchesTags = docData.tags?.some(tag =>
            tag.toLowerCase().includes(searchLower)
          );

          if (!matchesTitle && !matchesDescription && !matchesTags) {
            return;
          }
        }

        
        if (category !== 'all' && docData.category !== category) {
          return;
        }

        documents.push({
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt?.toDate() || new Date(),
          updatedAt: docData.updatedAt?.toDate() || new Date()
        });
      });

      return {
        success: true,
        documents,
        count: documents.length
      };
    } catch (error) {
      console.error('Error searching documents:', error);
      return {
        success: false,
        error: error.message,
        documents: []
      };
    }
  }
}


export default new DocumentService();