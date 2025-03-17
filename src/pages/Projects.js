import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { FaShareAlt, FaEye, FaEnvelope, FaFilter, FaLeaf, FaWater, FaHandsHelping, FaTree, FaCloud, FaTimes } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ProjectsSection = styled.section`
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #e9f1f9 0%, #f7fafc 100%);
  min-height: 100vh;
`;

const ProjectsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Hero = styled(motion.div)`
  background: linear-gradient(145deg, rgba(44, 110, 156, 0.9), rgba(26, 60, 94, 0.9)), url('https://via.placeholder.com/1400x300?text=Botserf+Projects') center/cover no-repeat;
  color: #fff;
  padding: 5rem 2rem;
  border-radius: 30px;
  text-align: center;
  margin-bottom: 4rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    padding: 3rem 1rem;
    border-radius: 20px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.4rem;
  font-weight: 300;
  margin: 0;
  opacity: 0.9;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FilterSection = styled.div`
  margin: 3rem 0;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button`
  background: ${props => (props.active ? '#2c6e9c' : '#ffffff')};
  color: ${props => (props.active ? '#fff' : '#2c6e9c')};
  padding: 0.8rem 1.8rem;
  border: 2px solid #2c6e9c;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    background: #2c6e9c;
    color: #fff;
    transform: translateY(-2px);
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin: 4rem 0;
`;

const ProjectCard = styled(motion.div)`
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectIcon = styled.div`
  font-size: 3rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
`;

const ProjectTitle = styled.h3`
  color: #1a3c5e;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const CTAButton = styled.button`
  background: linear-gradient(90deg, #2c6e9c, #1a3c5e);
  color: #fff;
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #1a3c5e, #2c6e9c);
    transform: scale(1.05);
  }
`;

const Modal = styled(motion.div)`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 25px;
  max-width: 700px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #1a3c5e;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #2c6e9c;
  }
`;

const ModalTitle = styled.h2`
  color: #1a3c5e;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ModalText = styled.p`
  color: #333;
  font-size: 1.2rem;
  line-height: 1.8;
`;

const QuoteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const QuoteInput = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #2c6e9c;
    outline: none;
  }
`;

const QuoteTextarea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #2c6e9c;
    outline: none;
  }
`;

const QuoteSubmit = styled.button`
  background: #2c6e9c;
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    background: #1a3c5e;
    transform: scale(1.05);
  }
`;

const ChartSection = styled(motion.div)`
  margin: 4rem auto;
  max-width: 800px;
  background: #fff;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ChartTitle = styled.h2`
  font-size: 2rem;
  color: #2c6e9c;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalProject, setModalProject] = useState(null);
  const [quoteModal, setQuoteModal] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', message: '' });
  const { t } = useTranslation();
  const [refCards, inViewCards] = useInView({ threshold: 0.2 });
  const [refChart, inViewChart] = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          details: doc.data().details || t('defaultProjectDetails', { title: doc.data().title })
        }));
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        toast.error('Failed to load projects.');
        setLoading(false);
      }
    };
    fetchProjects();
  }, [t]);

  const handleShare = (title) => {
    navigator.share({ title, url: window.location.href });
  };

  const openModal = (project) => setModalProject(project);
  const closeModal = () => setModalProject(null);

  const openQuoteModal = (project) => {
    setQuoteModal(project);
    setQuoteForm({ name: '', email: '', message: t('quoteRequestMessage', { title: project.title }) });
  };
  const closeQuoteModal = () => setQuoteModal(null);

  const handleQuoteChange = (e) => setQuoteForm({ ...quoteForm, [e.target.name]: e.target.value });

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      'service_837qny9',
      'template_uyhg5ji',
      { ...quoteForm, project: quoteModal?.title },
      'KILfxATttD-0u9tss'
    )
      .then(() => {
        toast.success(t('messageSent'));
        closeQuoteModal();
      })
      .catch(() => toast.error(t('messageFailed')));
  };

  const filteredProjects = filter === 'all' ? projects : projects.filter(project => project.category === filter);

  const chartData = projects.reduce((acc, project) => {
    const category = project.category || 'Other';
    const existing = acc.find(item => item.name === category);
    if (existing) existing.value += 1;
    else acc.push({ name: category, value: 1 });
    return acc;
  }, []);
  const COLORS = ['#2c6e9c', '#ffd700', '#1a3c5e', '#88d8b0', '#ffcc00'];

  const projectIcons = {
    "Agriculture": <FaLeaf />,
    "Climate": <FaCloud />,
    "Health": <FaHandsHelping />,
    "Ecology": <FaTree />,
    "Water": <FaWater />,
  };

  return (
    <ProjectsSection>
      <Helmet>
        <title>{t('projectsTitle')}</title>
        <meta name="description" content={t('projectsDescription')} />
      </Helmet>

      <ProjectsContainer>
        <Hero initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <HeroTitle>{t('projects')}</HeroTitle>
          <HeroSubtitle>{t('projectsSubtitle')}</HeroSubtitle>
        </Hero>

        <FilterSection>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}><FaFilter /> {t('all')}</FilterButton>
          <FilterButton active={filter === 'Agriculture'} onClick={() => setFilter('Agriculture')}><FaLeaf /> {t('agriculture')}</FilterButton>
          <FilterButton active={filter === 'Climate'} onClick={() => setFilter('Climate')}><FaCloud /> {t('climate')}</FilterButton>
          <FilterButton active={filter === 'Health'} onClick={() => setFilter('Health')}><FaHandsHelping /> {t('health')}</FilterButton>
          <FilterButton active={filter === 'Ecology'} onClick={() => setFilter('Ecology')}><FaTree /> {t('ecology')}</FilterButton>
        </FilterSection>

        {loading ? (
          <ClipLoader color="#2c6e9c" loading={loading} size={60} style={{ display: 'block', margin: '4rem auto' }} />
        ) : (
          <>
            <ProjectGrid ref={refCards}>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  className={inViewCards ? 'visible' : ''}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inViewCards ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectIcon>{projectIcons[project.category] || <FaLeaf />}</ProjectIcon>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <img src={project.image} alt={project.title} style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '1.5rem' }} />
                  <CTAButtons>
                    <CTAButton onClick={() => openModal(project)}><FaEye /> {t('viewMore')}</CTAButton>
                    <CTAButton onClick={() => handleShare(project.title)}><FaShareAlt /> {t('share')}</CTAButton>
                    <CTAButton onClick={() => openQuoteModal(project)}><FaEnvelope /> {t('getQuote')}</CTAButton>
                  </CTAButtons>
                </ProjectCard>
              ))}
            </ProjectGrid>

            <Modal isOpen={!!modalProject} onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {modalProject && (
                <ModalContent onClick={e => e.stopPropagation()}>
                  <ModalClose onClick={closeModal}><FaTimes /></ModalClose>
                  <ModalTitle>{modalProject.title}</ModalTitle>
                  <ProjectIcon>{projectIcons[modalProject.category] || <FaLeaf />}</ProjectIcon>
                  <ModalText>{modalProject.details}</ModalText>
                  <img src={modalProject.image} alt={modalProject.title} style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '1.5rem' }} />
                </ModalContent>
              )}
            </Modal>

            <Modal isOpen={!!quoteModal} onClick={closeQuoteModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {quoteModal && (
                <ModalContent onClick={e => e.stopPropagation()}>
                  <ModalClose onClick={closeQuoteModal}><FaTimes /></ModalClose>
                  <ModalTitle>{t('getQuoteFor', { title: quoteModal.title })}</ModalTitle>
                  <QuoteForm onSubmit={handleQuoteSubmit}>
                    <QuoteInput type="text" name="name" placeholder={t('name')} value={quoteForm.name} onChange={handleQuoteChange} required />
                    <QuoteInput type="email" name="email" placeholder={t('email')} value={quoteForm.email} onChange={handleQuoteChange} required />
                    <QuoteTextarea name="message" placeholder={t('message')} value={quoteForm.message} onChange={handleQuoteChange} required />
                    <QuoteSubmit type="submit">{t('submitQuoteRequest')}</QuoteSubmit>
                  </QuoteForm>
                </ModalContent>
              )}
            </Modal>

            <ChartSection
              ref={refChart}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inViewChart ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <ChartTitle>{t('projectCategories')}</ChartTitle>
              <PieChart width={Math.min(500, window.innerWidth - 40)} height={400}>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartSection>
          </>
        )}
      </ProjectsContainer>
    </ProjectsSection>
  );
};

export default Projects;