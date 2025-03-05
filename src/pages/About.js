import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaEye, FaRocket, FaHandsHelping, FaUsers } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const AboutSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1a3c5e;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const VisionMission = styled.div`
  margin: 2rem 0;
  background: #fff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ValueCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #1a3c5e;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
`;

const ValueText = styled.p`
  font-size: 1.1rem;
  color: #333;
`;

const OrganogramSection = styled.div`
  margin: 3rem 0;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OrganogramTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const OrganogramText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
`;

const About = () => {
  const { t } = useTranslation();
  const [refVision, inViewVision] = useInView({ threshold: 0.2 });
  const [refMission, inViewMission] = useInView({ threshold: 0.2 });
  const [refOrganogram, inViewOrganogram] = useInView({ threshold: 0.2 });

  return (
    <AboutSection>
      <Helmet>
        <title>About Botserf PTY LTD</title>
        <meta name="description" content="Learn about Botserf PTY LTD’s vision, mission, and values." />
      </Helmet>
      <AboutContainer>
        <Title>{t('about')}</Title>

        <VisionMission ref={refVision} className={inViewVision ? 'visible' : ''}>
          <SectionTitle><FaEye color="#2c6e9c" /> Vision</SectionTitle>
          <SectionText>
            Botserf LTD is dedicated to a sustainable future by using Earth System Science to understand planetary dynamics, providing data-driven insights for strategic decisions, fostering partnerships, developing innovative technologies, and building resilience against environmental challenges, while also extending their expertise to revolutionizing health supply solutions.
          </SectionText>
        </VisionMission>

        <VisionMission ref={refMission} className={inViewMission ? 'visible' : ''}>
          <SectionTitle><FaRocket color="#2c6e9c" /> Mission</SectionTitle>
          <SectionText>
            Botserf PTY LTD is dedicated to leveraging Earth Systems Sciences and cutting-edge technologies to develop impactful solutions for critical global challenges, while simultaneously revolutionizing health supply solutions through innovative, client-focused approaches, ultimately aiming to provide tangible benefits to all stakeholders.
          </SectionText>
        </VisionMission>

        <ValuesGrid>
          <ValueCard>
            <FaHandsHelping size={40} color="#2c6e9c" />
            <ValueTitle>Excellence</ValueTitle>
            <ValueText>Pursuit of excellence through rigorous research and superior solutions.</ValueText>
          </ValueCard>
          <ValueCard>
            <FaHandsHelping size={40} color="#2c6e9c" />
            <ValueTitle>Inclusivity</ValueTitle>
            <ValueText>Valuing diverse perspectives for innovation and collaboration.</ValueText>
          </ValueCard>
          <ValueCard>
            <FaHandsHelping size={40} color="#2c6e9c" />
            <ValueTitle>Integrity</ValueTitle>
            <ValueText>Adhering to the highest ethical and professional standards.</ValueText>
          </ValueCard>
          <ValueCard>
            <FaHandsHelping size={40} color="#2c6e9c" />
            <ValueTitle>Innovation</ValueTitle>
            <ValueText>Driving positive change through continuous technological advancement.</ValueText>
          </ValueCard>
          <ValueCard>
            <FaHandsHelping size={40} color="#2c6e9c" />
            <ValueTitle>Sustainability</ValueTitle>
            <ValueText>Prioritizing eco-friendly practices for future generations.</ValueText>
          </ValueCard>
        </ValuesGrid>

        <OrganogramSection ref={refOrganogram} className={inViewOrganogram ? 'visible' : ''}>
          <OrganogramTitle><FaUsers color="#2c6e9c" /> Our Structure</OrganogramTitle>
          <OrganogramText>
            Botserf PTY LTD operates with a leadership structure consisting of three directors, supported by a diverse team of associates who bring expert knowledge across our consulting specializations, including climate science, water management, health logistics, and ecological conservation.
          </OrganogramText>
        </OrganogramSection>
      </AboutContainer>
    </AboutSection>
  );
};

export default About;