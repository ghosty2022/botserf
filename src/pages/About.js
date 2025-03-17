import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaEye, FaRocket, FaHandsHelping, FaUsers, FaLightbulb, FaHeart, FaShieldAlt, FaLeaf, FaGlobeAfrica, FaPhone } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

// Styled Components
const AboutSection = styled.section`
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 3rem 0;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
`;

const ValueCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #1a3c5e;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ValueIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

const OrganogramTree = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const OrganogramNode = styled.div`
  background: #2c6e9c;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 1rem;
    background: #2c6e9c;
    display: ${props => (props.isRoot ? 'none' : 'block')};
  }
`;

const OrganogramChildren = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 2px;
    background: #2c6e9c;
  }
`;

const TeamSection = styled.div`
  margin: 3rem 0;
  background: #fff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TeamTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const TeamGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
`;

const TeamCard = styled.div`
  background: #f9fbfc;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const TeamImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
`;

const TeamName = styled.h3`
  font-size: 1.2rem;
  color: #1a3c5e;
  margin-bottom: 0.5rem;
`;

const TeamRole = styled.p`
  font-size: 1rem;
  color: #333;
`;

const MilestonesSection = styled.div`
  margin: 3rem 0;
  background: #fff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MilestonesTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const MilestoneItem = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const MilestoneIcon = styled.div`
  background: #2c6e9c;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const MilestoneContent = styled.div`
  flex: 1;
`;

const MilestoneYear = styled.h3`
  font-size: 1.2rem;
  color: #1a3c5e;
  margin-bottom: 0.5rem;
`;

const MilestoneText = styled.p`
  font-size: 1rem;
  color: #333;
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

const About = () => {
  const { t } = useTranslation();
  const [refVision, inViewVision] = useInView({ threshold: 0.2 });
  const [refMission, inViewMission] = useInView({ threshold: 0.2 });
  const [refOrganogram, inViewOrganogram] = useInView({ threshold: 0.2 });
  const [refTeam, inViewTeam] = useInView({ threshold: 0.2 });
  const [refMilestones, inViewMilestones] = useInView({ threshold: 0.2 });

  // Sample data for team and milestones
  const teamData = [
    { name: 'John Doe', role: 'CEO & Founder', image: 'https://via.placeholder.com/100' },
    { name: 'Jane Smith', role: 'Chief Sustainability Officer', image: 'https://via.placeholder.com/100' },
    { name: 'Dr. Emily Brown', role: 'Head of Research', image: 'https://via.placeholder.com/100' },
  ];

  const milestonesData = [
    { year: '2015', event: 'Botserf founded with a focus on Earth Systems Sciences.' },
    { year: '2018', event: 'Expanded into health supply solutions.' },
    { year: '2020', event: 'Launched first climate adaptation project in Kenya.' },
    { year: '2023', event: 'Achieved 150+ sustainable projects globally.' },
  ];

  // Values with specific icons
  const valuesData = [
    { title: t('excellence'), text: t('excellenceText'), icon: <FaRocket color="#2c6e9c" /> },
    { title: t('inclusivity'), text: t('inclusivityText'), icon: <FaHandsHelping color="#1a3c5e" /> },
    { title: t('integrity'), text: t('integrityText'), icon: <FaShieldAlt color="#2c6e9c" /> },
    { title: t('innovation'), text: t('innovationText'), icon: <FaLightbulb color="#ffd700" /> },
    { title: t('sustainability'), text: t('sustainabilityText'), icon: <FaLeaf color="#34c759" /> },
  ];

  return (
    <AboutSection>
      <Helmet>
        <title>{t('aboutTitle')}</title>
        <meta name="description" content={t('aboutDescription')} />
      </Helmet>
      <AboutContainer>
        <Title>{t('about')}</Title>

        <VisionMission ref={refVision} className={inViewVision ? 'visible' : ''}>
          <SectionTitle><FaEye color="#2c6e9c" /> {t('vision')}</SectionTitle>
          <SectionText>{t('visionText')}</SectionText>
        </VisionMission>

        <VisionMission ref={refMission} className={inViewMission ? 'visible' : ''}>
          <SectionTitle><FaRocket color="#2c6e9c" /> {t('mission')}</SectionTitle>
          <SectionText>{t('missionText')}</SectionText>
        </VisionMission>

        <ValuesGrid>
          {valuesData.map((value, index) => (
            <ValueCard key={index}>
              <ValueIcon>{value.icon}</ValueIcon>
              <ValueTitle>{value.title}</ValueTitle>
              <ValueText>{value.text}</ValueText>
            </ValueCard>
          ))}
        </ValuesGrid>

        <OrganogramSection ref={refOrganogram} className={inViewOrganogram ? 'visible' : ''}>
          <OrganogramTitle><FaUsers color="#2c6e9c" /> {t('ourStructure')}</OrganogramTitle>
          <OrganogramTree>
            <OrganogramNode isRoot>CEO</OrganogramNode>
            <OrganogramChildren>
              <OrganogramNode>Chief Sustainability Officer</OrganogramNode>
              <OrganogramNode>Head of Research</OrganogramNode>
              <OrganogramNode>Operations Manager</OrganogramNode>
            </OrganogramChildren>
            <OrganogramChildren>
              <OrganogramNode>Climate Team</OrganogramNode>
              <OrganogramNode>Water Team</OrganogramNode>
              <OrganogramNode>Health Team</OrganogramNode>
            </OrganogramChildren>
          </OrganogramTree>
        </OrganogramSection>

        <TeamSection ref={refTeam} className={inViewTeam ? 'visible' : ''}>
          <TeamTitle><FaUsers color="#2c6e9c" /> {t('ourTeam')}</TeamTitle>
          <TeamGrid>
            {teamData.map((member, index) => (
              <TeamCard key={index}>
                <TeamImage src={member.image} alt={member.name} />
                <TeamName>{member.name}</TeamName>
                <TeamRole>{member.role}</TeamRole>
              </TeamCard>
            ))}
          </TeamGrid>
        </TeamSection>

        <MilestonesSection ref={refMilestones} className={inViewMilestones ? 'visible' : ''}>
          <MilestonesTitle><FaGlobeAfrica color="#2c6e9c" /> {t('ourMilestones')}</MilestonesTitle>
          {milestonesData.map((milestone, index) => (
            <MilestoneItem key={index} className={inViewMilestones ? 'visible' : ''}>
              <MilestoneIcon><FaGlobeAfrica /></MilestoneIcon>
              <MilestoneContent>
                <MilestoneYear>{milestone.year}</MilestoneYear>
                <MilestoneText>{milestone.event}</MilestoneText>
              </MilestoneContent>
            </MilestoneItem>
          ))}
        </MilestonesSection>

        <CTABanner>
          <CTABannerTitle>{t('joinOurMission')}</CTABannerTitle>
          <CTABannerText>{t('joinOurMissionText')}</CTABannerText>
          <CTABannerButton to="/contact"><FaPhone /> {t('getInTouch')}</CTABannerButton>
        </CTABanner>
      </AboutContainer>
    </AboutSection>
  );
};

export default About;