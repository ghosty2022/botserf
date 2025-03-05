import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { FaShareAlt, FaEye, FaEnvelope, FaFilter, FaLeaf, FaWater, FaHandsHelping, FaTree, FaTimes, FaCloud } from 'react-icons/fa'; // Added FaCloud
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const ProjectsSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
`;

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1400x300?text=Botserf+Projects') center/cover no-repeat;
  color: #fff;
  padding: 4rem 2rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin: 0;
`;

const FilterSection = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const FilterButton = styled.button`
  background: ${props => (props.active ? '#2c6e9c' : '#fff')};
  color: ${props => (props.active ? '#fff' : '#2c6e9c')};
  padding: 0.75rem 1.5rem;
  border: 2px solid #2c6e9c;
  border-radius: 25px;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: #2c6e9c;
    color: #fff;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ProjectCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectIcon = styled.div`
  font-size: 2.5rem;
  color: #2c6e9c;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  color: #1a3c5e;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const CTAButton = styled.button`
  background: #2c6e9c;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  &:hover {
    background: #1a3c5e;
  }
`;

const Modal = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  max-width: 600px;
  margin: 5% auto;
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  @keyframes slideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @media (max-width: 768px) {
    margin: 10% 1rem;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1a3c5e;
  cursor: pointer;
`;

const ModalTitle = styled.h2`
  color: #1a3c5e;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const QuoteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QuoteInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const QuoteTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
`;

const QuoteSubmit = styled.button`
  background: #2c6e9c;
  color: #fff;
  padding: 0.75rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #1a3c5e;
  }
`;

const ChartSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ChartTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
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

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        details: doc.data().details || `Discover more about ${doc.data().title}, a flagship project by Botserf PTY LTD driving sustainability and innovation.`
      }));
      setProjects(projectsData);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const handleShare = (title) => {
    navigator.share({ title, url: window.location.href });
  };

  const openModal = (project) => {
    setModalProject(project);
  };

  const closeModal = () => {
    setModalProject(null);
  };

  const openQuoteModal = (project) => {
    setQuoteModal(project);
    setQuoteForm({ name: '', email: '', message: `Requesting a quote for ${project.title}` });
  };

  const closeQuoteModal = () => {
    setQuoteModal(null);
  };

  const handleQuoteChange = (e) => {
    setQuoteForm({ ...quoteForm, [e.target.name]: e.target.value });
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      'service_837qny9', // Your EmailJS Service ID
      'template_uyhg5ji', // Your EmailJS Template ID
      {
        ...quoteForm,
        project: quoteModal?.title,
      },
      'KILfxATttD-0u9tss' // Your EmailJS Public Key
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
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []);
  const COLORS = ['#2c6e9c', '#ffd700', '#1a3c5e', '#ffcc00', '#88d8b0'];

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
        <title>Projects - Botserf PTY LTD</title>
        <meta name="description" content="Explore our impactful projects." />
      </Helmet>

      <ProjectsContainer>
        <Hero>
          <HeroTitle>{t('projects')}</HeroTitle>
          <HeroSubtitle>Transforming communities through sustainable innovation.</HeroSubtitle>
        </Hero>

        <FilterSection>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}><FaFilter /> All</FilterButton>
          <FilterButton active={filter === 'Agriculture'} onClick={() => setFilter('Agriculture')}><FaLeaf /> Agriculture</FilterButton>
          <FilterButton active={filter === 'Climate'} onClick={() => setFilter('Climate')}><FaCloud /> Climate</FilterButton>
          <FilterButton active={filter === 'Health'} onClick={() => setFilter('Health')}><FaHandsHelping /> Health</FilterButton>
          <FilterButton active={filter === 'Ecology'} onClick={() => setFilter('Ecology')}><FaTree /> Ecology</FilterButton>
        </FilterSection>

        {loading ? (
          <ClipLoader color="#2c6e9c" loading={loading} size={50} style={{ display: 'block', margin: '0 auto' }} />
        ) : (
          <>
            <ProjectGrid ref={refCards}>
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} className={inViewCards ? 'visible' : ''}>
                  <ProjectIcon>{projectIcons[project.category] || <FaLeaf />}</ProjectIcon>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <img src={project.image} alt={project.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
                  <CTAButtons>
                    <CTAButton onClick={() => openModal(project)}><FaEye /> View More</CTAButton>
                    <CTAButton onClick={() => handleShare(project.title)}><FaShareAlt /> Share</CTAButton>
                    <CTAButton onClick={() => openQuoteModal(project)}><FaEnvelope /> Get a Quote</CTAButton>
                  </CTAButtons>
                </ProjectCard>
              ))}
            </ProjectGrid>

            <Modal isOpen={!!modalProject} onClick={closeModal}>
              {modalProject && (
                <ModalContent onClick={e => e.stopPropagation()}>
                  <ModalClose onClick={closeModal}><FaTimes /></ModalClose>
                  <ModalTitle>{modalProject.title}</ModalTitle>
                  <ProjectIcon>{projectIcons[modalProject.category] || <FaLeaf />}</ProjectIcon>
                  <ModalText>{modalProject.details}</ModalText>
                  <img src={modalProject.image} alt={modalProject.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
                </ModalContent>
              )}
            </Modal>

            <Modal isOpen={!!quoteModal} onClick={closeQuoteModal}>
              {quoteModal && (
                <ModalContent onClick={e => e.stopPropagation()}>
                  <ModalClose onClick={closeQuoteModal}><FaTimes /></ModalClose>
                  <ModalTitle>Get a Quote for {quoteModal.title}</ModalTitle>
                  <QuoteForm onSubmit={handleQuoteSubmit}>
                    <QuoteInput
                      type="text"
                      name="name"
                      placeholder={t('name')}
                      value={quoteForm.name}
                      onChange={handleQuoteChange}
                      required
                    />
                    <QuoteInput
                      type="email"
                      name="email"
                      placeholder={t('email')}
                      value={quoteForm.email}
                      onChange={handleQuoteChange}
                      required
                    />
                    <QuoteTextarea
                      name="message"
                      placeholder={t('message')}
                      value={quoteForm.message}
                      onChange={handleQuoteChange}
                      rows="4"
                      required
                    />
                    <QuoteSubmit type="submit">Submit Quote Request</QuoteSubmit>
                  </QuoteForm>
                </ModalContent>
              )}
            </Modal>

            <ChartSection>
              <ChartTitle>Project Categories</ChartTitle>
              <PieChart width={500} height={400} style={{ margin: '0 auto' }}>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
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