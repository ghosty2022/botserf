import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { FaShareAlt, FaEye, FaEnvelope, FaFilter, FaLeaf, FaWater, FaHandsHelping, FaTree, FaCloud, FaGlobeAfrica, FaTimes } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const ServicesSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ServiceCard = styled.div`
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

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: #2c6e9c;
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
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatsTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatItem = styled.div`
  color: #1a3c5e;
`;

const TestimonialSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  .slick-slide {
    padding: 0 1rem;
  }
  .slick-dots li button:before {
    color: #2c6e9c;
  }
`;

const TestimonialCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.p`
  font-size: 1rem;
  color: #2c6e9c;
  font-weight: 600;
`;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalService, setModalService] = useState(null);
  const [quoteModal, setQuoteModal] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', message: '' });
  const { t } = useTranslation();
  const [refCards, inViewCards] = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        details: doc.data().details || `Learn more about ${doc.data().title}, a key service offered by Botserf PTY LTD to address sustainability challenges.`
      }));
      setServices(servicesData);
      setLoading(false);
    };
    fetchServices();
  }, []);

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
    setQuoteForm({ name: '', email: '', message: `Requesting a quote for ${service.title}` });
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
        service: quoteModal?.title,
      },
      'KILfxATttD-0u9tss' // Your EmailJS Public Key
    )
      .then(() => {
        toast.success(t('messageSent'));
        closeQuoteModal();
      })
      .catch(() => toast.error(t('messageFailed')));
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
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  const testimonials = [
    { text: "Botserf’s climate analysis transformed our agricultural planning.", author: "John K., Farmer" },
    { text: "Their water management solutions saved our community.", author: "Amina S., Community Leader" },
    { text: "Innovative health supply solutions during a crisis—exceptional!", author: "Dr. Patel, NGO Director" },
  ];

  const serviceIcons = {
    "Climate Variability Analysis": <FaCloud />,
    "Climate Mitigation Strategies": <FaLeaf />,
    "Earth Systems Modeling": <FaGlobeAfrica />,
    "Geological Assessments": <FaTree />,
    "Water Management Solutions": <FaWater />,
  };

  return (
    <ServicesSection>
      <Helmet>
        <title>Services - Botserf PTY LTD</title>
        <meta name="description" content="Explore our Earth Systems and health solutions." />
      </Helmet>

      <ServicesContainer>
        <Hero>
          <HeroTitle>{t('services')}</HeroTitle>
          <HeroSubtitle>Comprehensive solutions for a sustainable world.</HeroSubtitle>
        </Hero>

        <FilterSection>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}><FaFilter /> All</FilterButton>
          <FilterButton active={filter === 'Climate'} onClick={() => setFilter('Climate')}><FaLeaf /> Climate</FilterButton>
          <FilterButton active={filter === 'Water'} onClick={() => setFilter('Water')}><FaWater /> Water</FilterButton>
          <FilterButton active={filter === 'Health'} onClick={() => setFilter('Health')}><FaHandsHelping /> Health</FilterButton>
        </FilterSection>

        {loading ? (
          <ClipLoader color="#2c6e9c" loading={loading} size={50} style={{ display: 'block', margin: '0 auto' }} />
        ) : (
          <ServiceGrid ref={refCards}>
            {filteredServices.map(service => (
              <ServiceCard key={service.id} className={inViewCards ? 'visible' : ''}>
                <ServiceIcon>{serviceIcons[service.title] || <FaLeaf />}</ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <img src={service.image} alt={service.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
                <CTAButtons>
                  <CTAButton onClick={() => openModal(service)}><FaEye /> View More</CTAButton>
                  <CTAButton onClick={() => handleShare(service.title)}><FaShareAlt /> Share</CTAButton>
                  <CTAButton onClick={() => openQuoteModal(service)}><FaEnvelope /> Get a Quote</CTAButton>
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
              <ServiceIcon>{serviceIcons[modalService.title] || <FaLeaf />}</ServiceIcon>
              <ModalText>{modalService.details}</ModalText>
              <img src={modalService.image} alt={modalService.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
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

        <StatsOverview>
          <StatsTitle>Our Service Reach</StatsTitle>
          <StatsGrid>
            <StatItem>
              <h3>50+</h3>
              <p>Climate Projects</p>
            </StatItem>
            <StatItem>
              <h3>30+</h3>
              <p>Water Initiatives</p>
            </StatItem>
            <StatItem>
              <h3>20+</h3>
              <p>Health Solutions</p>
            </StatItem>
            <StatItem>
              <h3>100+</h3>
              <p>Global Partners</p>
            </StatItem>
          </StatsGrid>
        </StatsOverview>

        <TestimonialSection>
          <h2>What Our Clients Say</h2>
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <TestimonialText>"{testimonial.text}"</TestimonialText>
                <TestimonialAuthor>- {testimonial.author}</TestimonialAuthor>
              </TestimonialCard>
            ))}
          </Slider>
        </TestimonialSection>
      </ServicesContainer>
    </ServicesSection>
  );
};

export default Services;