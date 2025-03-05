import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaImage, FaSpinner } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const AdminDashboardStyled = styled.section`
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  min-height: 100vh;
`;

const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Hero = styled.div`
  background: linear-gradient(90deg, #1a3c5e, #2c6e9c);
  color: #fff;
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FormSection = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a3c5e;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fbfc;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #2c6e9c;
    outline: none;
  }
`;

const FileInput = styled.input`
  padding: 0.5rem 0;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #2c6e9c, #1a3c5e);
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  transition: transform 0.3s ease, background 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #1a3c5e, #2c6e9c);
    transform: scale(1.05);
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LogoPreview = styled.img`
  max-width: 200px;
  border-radius: 10px;
  margin-top: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', image: null });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', category: '', image: null, position: '' });
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', category: '', image: null });
  const [settings, setSettings] = useState({ logo: '' });
  const [newLogo, setNewLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const [refService, inViewService] = useInView({ threshold: 0.2 });
  const [refProject, inViewProject] = useInView({ threshold: 0.2 });
  const [refNews, inViewNews] = useInView({ threshold: 0.2 });
  const [refLogo, inViewLogo] = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchData = async () => {
      const servicesSnap = await getDocs(collection(db, 'services'));
      setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const projectsSnap = await getDocs(collection(db, 'projects'));
      setProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const newsSnap = await getDocs(collection(db, 'news'));
      setNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const settingsSnap = await getDoc(doc(db, 'settings', 'site'));
      if (settingsSnap.exists()) setSettings(settingsSnap.data());
    };
    fetchData();
  }, []);

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const imageUrl = newService.image ? await uploadImage(newService.image) : '';
    const serviceData = { ...newService, image: imageUrl };
    const docRef = await addDoc(collection(db, 'services'), serviceData);
    setServices([...services, { id: docRef.id, ...serviceData }]);
    setNewService({ title: '', description: '', image: null });
    setIsSubmitting(false);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const imageUrl = newProject.image ? await uploadImage(newProject.image) : '';
    const positionArray = newProject.position.split(',').map(Number);
    const projectData = { ...newProject, image: imageUrl, position: positionArray };
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    setProjects([...projects, { id: docRef.id, ...projectData }]);
    setNewProject({ title: '', description: '', category: '', image: null, position: '' });
    setIsSubmitting(false);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const imageUrl = newNews.image ? await uploadImage(newNews.image) : '';
    const newsData = { ...newNews, image: imageUrl, date: new Date().toISOString().split('T')[0] };
    const docRef = await addDoc(collection(db, 'news'), newsData);
    setNews([...news, { id: docRef.id, ...newsData }]);
    setNewNews({ title: '', excerpt: '', category: '', image: null });
    setIsSubmitting(false);
  };

  const handleUpdateLogo = async (e) => {
    e.preventDefault();
    if (newLogo) {
      setIsSubmitting(true);
      const logoUrl = await uploadImage(newLogo);
      const updatedSettings = { ...settings, logo: logoUrl };
      await setDoc(doc(db, 'settings', 'site'), updatedSettings, { merge: true });
      setSettings(updatedSettings);
      setNewLogo(null);
      setIsSubmitting(false);
    }
  };

  return (
    <AdminDashboardStyled>
      <Helmet>
        <title>Admin Dashboard - Botserf PTY LTD</title>
      </Helmet>

      <DashboardContainer>
        <Hero>
          <HeroTitle>{t('admin')}</HeroTitle>
        </Hero>

        <FormSection ref={refService} className={inViewService ? 'visible' : ''}>
          <FormTitle><FaPlus color="#2c6e9c" /> Add Service</FormTitle>
          <Form onSubmit={handleAddService}>
            <Input name="title" placeholder="Title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} required />
            <Input name="description" placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} required />
            <FileInput type="file" onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <FaSpinner className="spin" /> : <FaPlus />} Add Service
            </Button>
          </Form>
        </FormSection>

        <FormSection ref={refProject} className={inViewProject ? 'visible' : ''}>
          <FormTitle><FaPlus color="#2c6e9c" /> Add Project</FormTitle>
          <Form onSubmit={handleAddProject}>
            <Input name="title" placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required />
            <Input name="description" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required />
            <Input name="category" placeholder="Category" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} required />
            <Input name="position" placeholder="Latitude,Longitude (e.g., -1.28,36.81)" value={newProject.position} onChange={(e) => setNewProject({ ...newProject, position: e.target.value })} required />
            <FileInput type="file" onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <FaSpinner className="spin" /> : <FaPlus />} Add Project
            </Button>
          </Form>
        </FormSection>

        <FormSection ref={refNews} className={inViewNews ? 'visible' : ''}>
          <FormTitle><FaPlus color="#2c6e9c" /> Add News</FormTitle>
          <Form onSubmit={handleAddNews}>
            <Input name="title" placeholder="Title" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} required />
            <Input name="excerpt" placeholder="Excerpt" value={newNews.excerpt} onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })} required />
            <Input name="category" placeholder="Category" value={newNews.category} onChange={(e) => setNewNews({ ...newNews, category: e.target.value })} required />
            <FileInput type="file" onChange={(e) => setNewNews({ ...newNews, image: e.target.files[0] })} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <FaSpinner className="spin" /> : <FaPlus />} Add News
            </Button>
          </Form>
        </FormSection>

        <FormSection ref={refLogo} className={inViewLogo ? 'visible' : ''}>
          <FormTitle><FaImage color="#2c6e9c" /> Update Site Logo</FormTitle>
          <Form onSubmit={handleUpdateLogo}>
            <FileInput type="file" onChange={(e) => setNewLogo(e.target.files[0])} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <FaSpinner className="spin" /> : <FaImage />} Update Logo
            </Button>
          </Form>
          {settings.logo && <LogoPreview src={settings.logo} alt="Site Logo" />}
        </FormSection>
      </DashboardContainer>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AdminDashboardStyled>
  );
};

export default AdminDashboard;