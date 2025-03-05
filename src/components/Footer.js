import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, FaAngleDown, FaAngleUp, FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const FooterStyled = styled.footer`
  background: linear-gradient(180deg, #1a3c5e, #2c6e9c);
  color: #fff;
  padding: 3rem 2rem 1rem;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const CarouselSection = styled(Section)`
  .slick-slide img {
    width: 120px;
    margin: 0 auto;
    border-radius: 10px;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
  .slick-dots li button:before {
    color: #ffd700;
  }
`;

const SocialMediaSection = styled(Section)`
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: #fff;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  &:hover {
    color: #ffd700;
    transform: translateY(-3px);
  }
`;

const CTASection = styled(Section)`
  text-align: center;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(90deg, #ffd700, #ffcc00);
  color: #1a3c5e;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0.5rem;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ContactSection = styled(Section)`
  text-align: center;
`;

const ContactToggle = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  font-size: 1.2rem;
  cursor: pointer;
  display: none;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    display: block;
  }
`;

const ContactInfo = styled.div`
  transition: all 0.3s ease;
  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'block' : 'none')};
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #25D366;
  color: #fff;
  padding: 1.2rem;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
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
  border-radius: 20px;
  max-width: 500px;
  margin: 10% auto;
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  @keyframes slideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @media (max-width: 768px) {
    margin: 15% 1rem;
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
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SubscribeInput = styled.input`
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

const SubscribeButton = styled.button`
  background: #2c6e9c;
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
  transition: background 0.3s ease, transform 0.3s ease;
  &:hover {
    background: #1a3c5e;
    transform: scale(1.05);
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscribeForm, setSubscribeForm] = useState({ email: '' });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
  };

  const openSubscribeModal = (e) => {
    e.preventDefault(); // Prevent Link navigation
    setIsSubscribeOpen(true);
  };

  const closeSubscribeModal = () => {
    setIsSubscribeOpen(false);
  };

  const handleSubscribeChange = (e) => {
    setSubscribeForm({ ...subscribeForm, [e.target.name]: e.target.value });
  };

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      'service_837qny9', // Your EmailJS Service ID
      'template_uyhg5ji', // Your EmailJS Template ID (adjust if you have a specific newsletter template)
      { email: subscribeForm.email, message: 'Newsletter subscription request' },
      'KILfxATttD-0u9tss' // Your EmailJS Public Key
    )
      .then(() => {
        toast.success(t('subscriptionSuccess') || 'Subscribed successfully!');
        setSubscribeForm({ email: '' });
        closeSubscribeModal();
      })
      .catch(() => toast.error(t('subscriptionFailed') || 'Subscription failed.'));
  };

  return (
    <FooterStyled>
      <FooterContainer>
        <CarouselSection>
          <h3>Our Partners</h3>
          <Slider {...settings}>
            <div><img src="https://via.placeholder.com/150?text=Partner1" alt="Partner 1" /></div>
            <div><img src="https://via.placeholder.com/150?text=Partner2" alt="Partner 2" /></div>
            <div><img src="https://via.placeholder.com/150?text=Partner3" alt="Partner 3" /></div>
            <div><img src="https://via.placeholder.com/150?text=Partner4" alt="Partner 4" /></div>
            <div><img src="https://via.placeholder.com/150?text=Partner5" alt="Partner 5" /></div>
          </Slider>
        </CarouselSection>

        <SocialMediaSection>
          <h3>Connect With Us</h3>
          <SocialLinks>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></SocialLink>
          </SocialLinks>
        </SocialMediaSection>

        <CTASection>
          <h3>Take Action</h3>
          <CTAButton to="/contact">Contact Us</CTAButton>
          <CTAButton as="button" onClick={openSubscribeModal}><FaEnvelope /> Subscribe</CTAButton>
        </CTASection>

        <ContactSection>
          <ContactToggle onClick={toggleContact}>
            Contact Info {isContactOpen ? <FaAngleUp /> : <FaAngleDown />}
          </ContactToggle>
          <ContactInfo isOpen={isContactOpen}>
            <p>Email: tpm.s@yahoo.com</p>
            <p>Phone: 0722211129</p>
          </ContactInfo>
        </ContactSection>
      </FooterContainer>

      <FooterBottom>
        <p>{t('footer', { year: new Date().getFullYear() })} | Developed by TPM Solutions</p>
      </FooterBottom>

      <WhatsAppButton href="https://wa.me/0722211129?text=Hello%20Botserf" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp size={24} />
      </WhatsAppButton>

      <Modal isOpen={isSubscribeOpen} onClick={closeSubscribeModal}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalClose onClick={closeSubscribeModal}><FaTimes /></ModalClose>
          <ModalTitle><FaEnvelope color="#2c6e9c" /> Subscribe to Our Newsletter</ModalTitle>
          <SubscribeForm onSubmit={handleSubscribeSubmit}>
            <SubscribeInput
              type="email"
              name="email"
              placeholder={t('email') || 'Enter your email'}
              value={subscribeForm.email}
              onChange={handleSubscribeChange}
              required
            />
            <SubscribeButton type="submit"><FaPaperPlane /> Subscribe</SubscribeButton>
          </SubscribeForm>
        </ModalContent>
      </Modal>
    </FooterStyled>
  );
};

export default Footer;