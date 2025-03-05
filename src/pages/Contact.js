import { useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPhone, FaWhatsapp, FaPaperPlane } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const ContactSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
`;

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1400x300?text=Contact+Botserf') center/cover no-repeat;
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

const FormWrapper = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
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

const Textarea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fbfc;
  resize: vertical;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #2c6e9c;
    outline: none;
  }
`;

const Button = styled.button`
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

const ContactInfo = styled.div`
  margin-top: 3rem;
  text-align: center;
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContactItem = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const WhatsAppLink = styled.a`
  color: #25D366;
  text-decoration: none;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  &:hover {
    color: #1eb351;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { t } = useTranslation();
  const [refForm, inViewForm] = useInView({ threshold: 0.2 });
  const [refInfo, inViewInfo] = useInView({ threshold: 0.2 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      'service_837qny9',
      'template_uyhg5ji',
      formData,
      'KILfxATttD-0u9tss'
    )
      .then(() => {
        toast.success(t('messageSent'));
        setFormData({ name: '', email: '', message: '' });
      })
      .catch(() => toast.error(t('messageFailed')));
  };

  return (
    <ContactSection>
      <Helmet>
        <title>Contact - Botserf PTY LTD</title>
        <meta name="description" content="Get in touch with Botserf PTY LTD." />
      </Helmet>

      <ContactContainer>
        <Hero>
          <HeroTitle>{t('contact')}</HeroTitle>
          <HeroSubtitle>Reach out to us for inquiries or collaborations.</HeroSubtitle>
        </Hero>

        <FormWrapper ref={refForm} className={inViewForm ? 'visible' : ''}>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder={t('name')}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder={t('email')}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Textarea
              name="message"
              placeholder={t('message')}
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
            <Button type="submit"><FaPaperPlane /> {t('send')}</Button>
          </Form>
        </FormWrapper>

        <ContactInfo ref={refInfo} className={inViewInfo ? 'visible' : ''}>
          <ContactItem><FaPhone color="#2c6e9c" /> Phone: 0722211129</ContactItem>
          <ContactItem><FaEnvelope color="#2c6e9c" /> Email: tpm.s@yahoo.com</ContactItem>
          <ContactItem>
            <WhatsAppLink href="https://wa.me/0722211129?text=Hello%20Botserf" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> WhatsApp: 0722211129
            </WhatsAppLink>
          </ContactItem>
        </ContactInfo>
      </ContactContainer>
    </ContactSection>
  );
};

export default Contact;