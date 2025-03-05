import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBzaz4B7PukkLNSi4BZSfun-eIqDQ-uyO8",
  authDomain: "botai-de5de.firebaseapp.com",
  projectId: "botai-de5de",
  storageBucket: "botai-de5de.firebasestorage.app",
  messagingSenderId: "330690201293",
  appId: "1:330690201293:web:09a20e52c13d9de363cb84",
  measurementId: "G-4GSV8XBMVF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize placeholder data only if collections are empty
const initializeData = async () => {
  try {
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty) {
      await addDoc(collection(db, 'services'), { title: "Climate Variability Analysis", description: "Assessing climate trends and projections.", image: "https://via.placeholder.com/300?text=Climate" });
      await addDoc(collection(db, 'services'), { title: "Climate Mitigation Strategies", description: "Reducing emissions and enhancing resilience.", image: "https://via.placeholder.com/300?text=Mitigation" });
      await addDoc(collection(db, 'services'), { title: "Earth Systems Modeling", description: "Simulating environmental interactions.", image: "https://via.placeholder.com/300?text=Modeling" });
      await addDoc(collection(db, 'services'), { title: "Geological Assessments", description: "Evaluating geological formations.", image: "https://via.placeholder.com/300?text=Geology" });
      await addDoc(collection(db, 'services'), { title: "Water Management Solutions", description: "Optimizing water use in agriculture.", image: "https://via.placeholder.com/300?text=Water" });
    }

    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      await addDoc(collection(db, 'projects'), { title: "Kenya Irrigation Project", description: "Precision irrigation for sustainable farming.", category: "Agriculture", image: "https://via.placeholder.com/300?text=Irrigation", position: [-1.286389, 36.817223] });
      await addDoc(collection(db, 'projects'), { title: "Sahel Resilience Initiative", description: "Building resilience in arid regions.", category: "Climate", image: "https://via.placeholder.com/300?text=Sahel", position: [13.5, 2.1] });
      await addDoc(collection(db, 'projects'), { title: "Health Supply Chain", description: "Optimizing crisis delivery systems.", category: "Health", image: "https://via.placeholder.com/300?text=Health", position: [-4.0, 39.0] });
      await addDoc(collection(db, 'projects'), { title: "Biodiversity Monitoring", description: "Tracking ecological changes.", category: "Ecology", image: "https://via.placeholder.com/300?text=Biodiversity", position: [-3.5, 37.5] });
    }

    const newsSnap = await getDocs(collection(db, 'news'));
    if (newsSnap.empty) {
      await addDoc(collection(db, 'news'), { title: "New Climate Model Launched", excerpt: "A breakthrough in analytics.", category: "Updates", image: "https://via.placeholder.com/300?text=ClimateModel", date: "2025-03-01" });
      await addDoc(collection(db, 'news'), { title: "Partnership with UNEP", excerpt: "Collaborating on sustainability.", category: "Partnerships", image: "https://via.placeholder.com/300?text=UNEP", date: "2025-02-15" });
      await addDoc(collection(db, 'news'), { title: "Gender Inclusivity Award", excerpt: "Recognized for diversity efforts.", category: "Awards", image: "https://via.placeholder.com/300?text=Award", date: "2025-01-20" });
    }

    const settingsSnap = await getDocs(collection(db, 'settings'));
    if (settingsSnap.empty) {
      await setDoc(doc(db, 'settings', 'site'), {
        logo: "https://via.placeholder.com/150?text=BotserfLogo",
        socialMedia: { facebook: "https://facebook.com", twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
        footerLogos: ["https://via.placeholder.com/150?text=Logo1", "https://via.placeholder.com/150?text=Logo2"]
      });
    }
    console.log("Initial data setup complete or skipped.");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

initializeData();
