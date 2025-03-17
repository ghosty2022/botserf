import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { FaShareAlt, FaEye, FaEnvelope, FaFilter, FaLeaf, FaWater, FaHandsHelping, FaTree, FaCloud, FaGlobeAfrica, FaTimes, FaPhone, FaQuoteLeft, FaProjectDiagram, FaQuestionCircle, FaVideo, FaTable, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

// Styled Components
const ServicesSection = styled.section`
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1400x300?text=Botserf+Services') center/cover no-repeat;
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

const ServiceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 3rem 0;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const ServiceCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ServiceTitle = styled.h3`
  color: #1a3c5e;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
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

const StatsOverview = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatsTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }
`;

const StatItem = styled.div`
  color: #1a3c5e;
`;

const FeaturedProjectsSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  padding: 2rem;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FeaturedProjectsTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ProjectsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const ProjectCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a3c5e;
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ProjectLink = styled(Link)`
  color: #2c6e9c;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const TestimonialSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  .slick-slide {
    padding: 0 1rem;
  }
  .slick-dots li button:before {
    color: #2c6e9c;
  }
`;

const TestimonialCard = styled.div`
  background: #f9fbfc;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  color: #333;
  font-style: italic;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.p`
  font-size: 1rem;
  color: #2c6e9c;
  font-weight: 600;
`;

const FAQSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FAQTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const FAQItem = styled.div`
  margin: 1rem 0;
  text-align: left;
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fbfc;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #1a3c5e;
  font-weight: 600;
  &:hover {
    background: #e8eef5;
  }
`;

const FAQAnswer = styled.div`
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #333;
  border-left: 4px solid #2c6e9c;
`;

const VideoTestimonialsSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const VideoTestimonialsTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const VideoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const ComparisonTableSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ComparisonTableTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const ComparisonTh = styled.th`
  background: #2c6e9c;
  color: #fff;
  padding: 1rem;
  font-size: 1.1rem;
  border-bottom: 2px solid #1a3c5e;
`;

const ComparisonTd = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
`;

const ComparisonTr = styled.tr`
  &:nth-child(even) {
    background: #f9fbfc;
  }
  &:hover {
    background: #e8eef5;
  }
`;

const CTABanner = styled.div`
  background: linear-gradient(90deg, #2c6e9c, #1a3c5e);
  color: #fff;
  padding: 2rem 1rem;
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 1200px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
`;

const CTABannerTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const CTABannerText = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CTABannerButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(90deg, #ffd700, #ffcc00);
  color: #1a3c5e;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalService, setModalService] = useState(null);
  const [quoteModal, setQuoteModal] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', message: '' });
  const [faqOpen, setFaqOpen] = useState(null);
  const { t } = useTranslation();
  const [refCards, inViewCards] = useInView({ threshold: 0.2 });
  const [refStats, inViewStats] = useInView({ triggerOnce: true });
  const [refTestimonials, inViewTestimonials] = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          details: doc.data().details || t('defaultServiceDetails', { title: doc.data().title }),
        }));
        setServices(servicesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
        if (error.code === 'permission-denied') {
          toast.error(t('permissionDenied'));
        } else {
          toast.error(t('fetchServicesFailed'));
        }
      }
    };
    fetchServices();
  }, [t]);

  const handleShare = (title) => {
    navigator.share({ title, url: window.location.href });
  };

  const openModal = (service) => {
    setModalService(service);
  };

  const closeModal = () => {
    setModalService(null);
  };

  const openQuoteModal = (service) => {
    setQuoteModal(service);
    setQuoteForm({ name: '', email: '', message: t('quoteRequestMessage', { title: service.title }) });
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
      'service_837qny9',
      'template_uyhg5ji',
      {
        ...quoteForm,
        service: quoteModal?.title,
      },
      'KILfxATttD-0u9tss'
    )
      .then(() => {
        toast.success(t('messageSent'));
        closeQuoteModal();
      })
      .catch(() => toast.error(t('messageFailed')));
  };

  const toggleFAQ = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const filteredServices = filter === 'all' ? services : services.filter(service => service.category === filter);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonials = [
    { text: t('testimonial1Text'), author: t('testimonial1Author') },
    { text: t('testimonial2Text'), author: t('testimonial2Author') },
    { text: t('testimonial3Text'), author: t('testimonial3Author') },
  ];

  const serviceIcons = {
    "Climate Variability Analysis": <FaCloud color="#2c6e9c" />,
    "Climate Mitigation Strategies": <FaLeaf color="#34c759" />,
    "Earth Systems Modeling": <FaGlobeAfrica color="#2c6e9c" />,
    "Geological Assessments": <FaTree color="#34c759" />,
    "Water Management Solutions": <FaWater color="#2c6e9c" />,
    "Health Supply Solutions": <FaHandsHelping color="#1a3c5e" />,
  };

  const featuredProjects = [
    { title: "Kenya Irrigation Project", description: "Implemented sustainable irrigation solutions in Kenya.", image: "https://via.placeholder.com/400x300?text=Kenya+Irrigation" },
    { title: "Sahel Resilience Program", description: "Supported resilience in the Sahel through climate strategies.", image: "https://via.placeholder.com/400x300?text=Sahel+Resilience" },
    { title: "Health Delivery Network", description: "Expanded health supply chains in remote areas.", image: "https://via.placeholder.com/400x300?text=Health+Delivery" },
  ];

  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
  ];

  const videoTestimonials = [
    { title: "Client Success Story: Climate Project", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Testimonial: Water Initiative Impact", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Health Solutions Feedback", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ];

  const comparisonData = [
    { feature: t('featureScope'), climate: "Global", water: "Regional", health: "Local" },
    { feature: t('featureImpact'), climate: "High", water: "Moderate", health: "High" },
    { feature: t('featureTimeline'), climate: "Long-term", water: "Mid-term", health: "Short-term" },
    { feature: t('featureCost'), climate: "$$$", water: "$$", health: "$$$" },
  ];

  return (
    <ServicesSection>
      <Helmet>
        <title>{t('servicesTitle')}</title>
        <meta name="description" content={t('servicesDescription')} />
      </Helmet>

      <ServicesContainer>
        <Hero>
          <HeroTitle>{t('services')}</HeroTitle>
          <HeroSubtitle>{t('servicesSubtitle')}</HeroSubtitle>
        </Hero>

        <FilterSection>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}><FaFilter /> {t('all')}</FilterButton>
          <FilterButton active={filter === 'Climate'} onClick={() => setFilter('Climate')}><FaLeaf /> {t('climate')}</FilterButton>
          <FilterButton active={filter === 'Water'} onClick={() => setFilter('Water')}><FaWater /> {t('water')}</FilterButton>
          <FilterButton active={filter === 'Health'} onClick={() => setFilter('Health')}><FaHandsHelping /> {t('health')}</FilterButton>
        </FilterSection>

        {loading ? (
          <ClipLoader color="#2c6e9c" loading={loading} size={50} style={{ display: 'block', margin: '0 auto' }} />
        ) : (
          <ServiceGrid ref={refCards}>
            {filteredServices.map(service => (
              <ServiceCard key={service.id} className={inViewCards ? 'visible' : ''}>
                <ServiceIcon>{serviceIcons[service.title] || <FaLeaf color="#34c759" />}</ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                {service.image && (
                  <img src={service.image} alt={service.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
                )}
                <CTAButtons>
                  <CTAButton onClick={() => openModal(service)}><FaEye /> {t('viewMore')}</CTAButton>
                  <CTAButton onClick={() => handleShare(service.title)}><FaShareAlt /> {t('share')}</CTAButton>
                  <CTAButton onClick={() => openQuoteModal(service)}><FaEnvelope /> {t('getQuote')}</CTAButton>
                </CTAButtons>
              </ServiceCard>
            ))}
          </ServiceGrid>
        )}

        <Modal isOpen={!!modalService} onClick={closeModal}>
          {modalService && (
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalClose onClick={closeModal}><FaTimes /></ModalClose>
              <ModalTitle>{modalService.title}</ModalTitle>
              <ServiceIcon>{serviceIcons[modalService.title] || <FaLeaf color="#34c759" />}</ServiceIcon>
              <ModalText>{modalService.details}</ModalText>
              {modalService.image && (
                <img src={modalService.image} alt={modalService.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
              )}
            </ModalContent>
          )}
        </Modal>

        <Modal isOpen={!!quoteModal} onClick={closeQuoteModal}>
          {quoteModal && (
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalClose onClick={closeQuoteModal}><FaTimes /></ModalClose>
              <ModalTitle>{t('getQuoteFor', { title: quoteModal.title })}</ModalTitle>
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
                <QuoteSubmit type="submit">{t('submitQuoteRequest')}</QuoteSubmit>
              </QuoteForm>
            </ModalContent>
          )}
        </Modal>

        <StatsOverview ref={refStats}>
          <StatsTitle>{t('serviceReach')}</StatsTitle>
          <StatsGrid>
            <StatItem>
              <h3><CountUp start={0} end={inViewStats ? 50 : 0} duration={2.5} />+</h3>
              <p>{t('climateProjects')}</p>
            </StatItem>
            <StatItem>
              <h3><CountUp start={0} end={inViewStats ? 30 : 0} duration={2.5} />+</h3>
              <p>{t('waterInitiatives')}</p>
            </StatItem>
            <StatItem>
              <h3><CountUp start={0} end={inViewStats ? 20 : 0} duration={2.5} />+</h3>
              <p>{t('healthSolutions')}</p>
            </StatItem>
            <StatItem>
              <h3><CountUp start={0} end={inViewStats ? 100 : 0} duration={2.5} />+</h3>
              <p>{t('globalPartners')}</p>
            </StatItem>
          </StatsGrid>
        </StatsOverview>

        <FeaturedProjectsSection>
          <FeaturedProjectsTitle><FaProjectDiagram color="#2c6e9c" /> {t('featuredProjects')}</FeaturedProjectsTitle>
          <ProjectsGrid>
            {featuredProjects.map((project, index) => (
              <ProjectCard key={index}>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <img src={project.image} alt={project.title} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '1rem' }} />
                <ProjectLink to="/projects">{t('learnMore')}</ProjectLink>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </FeaturedProjectsSection>

        <TestimonialSection ref={refTestimonials}>
          <h2 style={{ fontSize: '1.8rem', color: '#2c6e9c', marginBottom: '1.5rem' }}>{t('clientTestimonials')}</h2>
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} className={inViewTestimonials ? 'visible' : ''}>
                <FaQuoteLeft size={30} color="#2c6e9c" style={{ marginBottom: '1rem' }} />
                <TestimonialText>"{testimonial.text}"</TestimonialText>
                <TestimonialAuthor>- {testimonial.author}</TestimonialAuthor>
              </TestimonialCard>
            ))}
          </Slider>
        </TestimonialSection>

        <FAQSection>
          <FAQTitle><FaQuestionCircle color="#2c6e9c" /> {t('faqTitle')}</FAQTitle>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                {faq.question}
                {faqOpen === index ? <FaChevronUp /> : <FaChevronDown />}
              </FAQQuestion>
              {faqOpen === index && <FAQAnswer>{faq.answer}</FAQAnswer>}
            </FAQItem>
          ))}
        </FAQSection>

        <VideoTestimonialsSection>
          <VideoTestimonialsTitle><FaVideo color="#2c6e9c" /> {t('videoTestimonialsTitle')}</VideoTestimonialsTitle>
          <VideoGrid>
            {videoTestimonials.map((video, index) => (
              <VideoWrapper key={index}>
                <VideoIframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoWrapper>
            ))}
          </VideoGrid>
        </VideoTestimonialsSection>

        <ComparisonTableSection>
          <ComparisonTableTitle><FaTable color="#2c6e9c" /> {t('comparisonTableTitle')}</ComparisonTableTitle>
          <ComparisonTable>
            <thead>
              <tr>
                <ComparisonTh>{t('feature')}</ComparisonTh>
                <ComparisonTh>{t('climate')}</ComparisonTh>
                <ComparisonTh>{t('water')}</ComparisonTh>
                <ComparisonTh>{t('health')}</ComparisonTh>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <ComparisonTr key={index}>
                  <ComparisonTd>{row.feature}</ComparisonTd>
                  <ComparisonTd>{row.climate}</ComparisonTd>
                  <ComparisonTd>{row.water}</ComparisonTd>
                  <ComparisonTd>{row.health}</ComparisonTd>
                </ComparisonTr>
              ))}
            </tbody>
          </ComparisonTable>
        </ComparisonTableSection>

        <CTABanner>
          <CTABannerTitle>{t('requestQuote')}</CTABannerTitle>
          <CTABannerText>{t('requestQuoteText')}</CTABannerText>
          <CTABannerButton to="/contact"><FaPhone /> {t('contactUs')}</CTABannerButton>
        </CTABanner>
      </ServicesContainer>
    </ServicesSection>
  );
};

export default Services;
