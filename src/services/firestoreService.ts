import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  query,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { NewsArticle, SavedCompany } from '../types';

export async function saveArticlesToFirestore(
  userId: string,
  companyName: string,
  articles: NewsArticle[]
): Promise<void> {
  const companyRef = doc(db, 'users', userId, 'savedCompanies', companyName.toLowerCase().replace(/\s+/g, '-'));
  
  await setDoc(companyRef, {
    companyName,
    articles,
    lastUpdated: Timestamp.now().toDate().toISOString(),
    articleCount: articles.length
  });
}

export async function getSavedCompanies(userId: string): Promise<SavedCompany[]> {
  const companiesRef = collection(db, 'users', userId, 'savedCompanies');
  const querySnapshot = await getDocs(query(companiesRef));
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SavedCompany));
}

export async function deleteSavedCompany(userId: string, companyId: string): Promise<void> {
  const companyRef = doc(db, 'users', userId, 'savedCompanies', companyId);
  await deleteDoc(companyRef);
}

export async function deleteAllSavedCompanies(userId: string): Promise<void> {
  const companiesRef = collection(db, 'users', userId, 'savedCompanies');
  const querySnapshot = await getDocs(query(companiesRef));
  
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}
