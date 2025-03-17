import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaLeaf, FaWater, FaGlobeAfrica, FaHandsHelping, FaTree, FaEye, FaCloud, FaQuoteLeft, FaNewspaper, FaMapMarkedAlt, FaSeedling } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path based on your project structure
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Styled Components
const HomeSection = styled.section`
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1400x500?text=Botserf+Sustainability') center/cover no-repeat;
  color: #fff;
  padding: 4rem 1rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  @media (max-width: 768px) {
    padding: 3rem 0.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin: 0 0 1.5rem;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroCTA = styled(Link)`
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

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  width: 100%;
  padding: 0 1rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
  }
`;

const StatCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #1a3c5e;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ChartSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
`;

const ChartTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ImpactAreasSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const ImpactAreasTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ImpactAreasGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
`;

const ImpactAreaCard = styled.div`
  background: #f9fbfc;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImpactSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  padding: 0 1rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const ImpactCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const EffectTitle = styled.h2`
  font-size: 1.5rem;
  color: #1a3c5e;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ImpactTitle = styled.h3`
  color: #1a3c5e;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ImpactText = styled.p`
  color: #333;
  font-size: 1rem;
`;

const SliderSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  width: 100%;
  padding: 0 1rem;
  .slick-slide img {
    width: 100%;
    border-radius: 10px;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.05);
    }
  }
  .slick-dots li button:before {
    color: #2c6e9c;
  }
`;

const TimelineSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  padding: 1.5rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Timeline = styled.div`
  position: relative;
  padding: 1.5rem 0;
`;

const TimelineItem = styled.div`
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

const TimelineIcon = styled.div`
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

const TimelineContent = styled.div`
  flex: 1;
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

const TestimonialsSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  padding: 2rem 1rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const TestimonialCard = styled.div`
  background: #f9fbfc;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TestimonialQuote = styled.p`
  font-size: 1rem;
  color: #333;
  font-style: italic;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.p`
  font-size: 0.9rem;
  color: #1a3c5e;
  font-weight: 600;
`;

const NewsSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const NewsCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const NewsTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a3c5e;
  margin-bottom: 0.5rem;
`;

const NewsExcerpt = styled.p`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 1rem;
`;

const NewsLink = styled(Link)`
  color: #2c6e9c;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const MapSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  padding: 2rem 1rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const MapContainerStyled = styled(MapContainer)`
  height: 400px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const GoalsSection = styled.div`
  margin: 2rem auto;
  max-width: 1200px;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const GoalsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }
`;

const GoalCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GoalCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(#34c759 ${props => props.progress}%, #e8eef5 ${props => props.progress}%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const GoalInnerCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #34c759;
  font-weight: 600;
`;

const GoalTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a3c5e;
  margin-bottom: 0.5rem;
`;

const GoalText = styled.p`
  font-size: 0.9rem;
  color: #333;
`;

const Home = () => {
  const { t } = useTranslation();
  const [refStats, inViewStats] = useInView({ triggerOnce: true });
  const [refTimeline, inViewTimeline] = useInView({ threshold: 0.2 });
  const [newsData, setNewsData] = useState([]);

  const impactData = [
    { year: '2020', impact: 50 },
    { year: '2021', impact: 70 },
    { year: '2022', impact: 90 },
    { year: '2023', impact: 120 },
    { year: '2024', impact: 150 },
  ];

  const categoryData = [
    { name: 'Climate', value: 40 },
    { name: 'Water', value: 30 },
    { name: 'Health', value: 20 },
    { name: 'Ecology', value: 10 },
  ];
  const COLORS = ['#2c6e9c', '#ffd700', '#1a3c5e', '#ffcc00'];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: true, centerPadding: '20px' } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerMode: true, centerPadding: '10px' } },
    ],
  };

  const timelineData = [
    { year: '2015', event: 'Botserf founded with a focus on Earth Systems Sciences.' },
    { year: '2018', event: 'Expanded into health supply solutions.' },
    { year: '2020', event: 'Launched first climate adaptation project in Kenya.' },
    { year: '2023', event: 'Achieved 150+ sustainable projects globally.' },
  ];

  const testimonialsData = [
    { quote: 'Botserf transformed our community with their innovative water solutions.', author: 'John Doe, Community Leader' },
    { quote: 'Their commitment to sustainability is unmatched. Truly inspiring!', author: 'Jane Smith, Partner Organization' },
    { quote: 'Working with Botserf was a game-changer for our health initiatives.', author: 'Dr. Emily Brown, Health Expert' },
  ];

  const goalsData = [
    { title: 'Carbon Reduction', progress: 75, text: 'Reduce emissions by 50% by 2030' },
    { title: 'Water Saved', progress: 60, text: 'Save 5M liters annually' },
    { title: 'Trees Planted', progress: 80, text: 'Plant 10K trees by 2025' },
  ];

  // Sample project locations for the map
  const projectLocations = [
    { position: [1.2921, 36.8219], name: 'Nairobi, Kenya', description: 'Climate adaptation project' },
    { position: [12.6392, -8.0000], name: 'Dakar, Senegal', description: 'Water sustainability initiative' },
    { position: [-1.2921, 36.8219], name: 'Mombasa, Kenya', description: 'Health supply chain project' },
  ];

  // Fetch news data from Firestore
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Limit to 3 articles for the preview
        setNewsData(articlesData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  return (
    <HomeSection>
      <Helmet>
        <title>{t('homeTitle')}</title>
        <meta name="description" content={t('homeDescription')} />
      </Helmet>

      <Hero>
        <HeroTitle>{t('welcome', { company: 'Botserf PTY LTD' })}</HeroTitle>
        <HeroSubtitle>{t('heroSubtitle')}</HeroSubtitle>
        <HeroCTA to="/services"><FaEye /> {t('exploreSolutions')}</HeroCTA>
      </Hero>

      <StatsSection ref={refStats}>
        <StatCard>
          <FaLeaf size={40} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 150 : 0} duration={2.5} />+</h3>
          <p>{t('projectsCompleted')}</p>
        </StatCard>
        <StatCard>
          <FaWater size={40} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 200 : 0} duration={2.5} />+</h3>
          <p>{t('clientsServed')}</p>
        </StatCard>
        <StatCard>
          <FaGlobeAfrica size={40} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 10 : 0} duration={2.5} />+</h3>
          <p>{t('yearsImpacting')}</p>
        </StatCard>
        <StatCard>
          <FaHandsHelping size={40} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 500 : 0} duration={2.5} />+</h3>
          <p>{t('communitiesHelped')}</p>
        </StatCard>
        <StatCard>
          <FaTree size={40} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 1000 : 0} duration={2.5} />+</h3>
          <p>{t('treesPlanted')}</p>
        </StatCard>
      </StatsSection>

      <ChartSection>
        <ChartTitle>{t('impactOverTime')}</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={impactData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="year" stroke="#1a3c5e" tick={{ fontSize: 12 }} />
            <YAxis stroke="#1a3c5e" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
              cursor={{ fill: 'rgba(44, 110, 156, 0.1)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              dataKey="impact"
              fill="#2c6e9c"
              radius={[8, 8, 0, 0]}
              barSize={30}
              background={{ fill: '#e8eef5' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      <ChartSection>
        <ChartTitle>{t('impactByCategory')}</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartSection>

      <ImpactAreasSection>
        <ImpactAreasTitle><FaCloud color="#2c6e9c" /> {t('ourImpactAreas')}</ImpactAreasTitle>
        <ImpactAreasGrid>
          <ImpactAreaCard>
            <FaLeaf size={30} color="#34c759" />
            <h3>{t('climateResilienceTitle')}</h3>
            <p>{t('climateResilienceDesc')}</p>
          </ImpactAreaCard>
          <ImpactAreaCard>
            <FaWater size={30} color="#2c6e9c" />
            <h3>{t('waterSustainabilityTitle')}</h3>
            <p>{t('waterSustainabilityDesc')}</p>
          </ImpactAreaCard>
          <ImpactAreaCard>
            <FaHandsHelping size={30} color="#1a3c5e" />
            <h3>{t('healthSolutionsTitle')}</h3>
            <p>{t('healthSolutionsDesc')}</p>
          </ImpactAreaCard>
          <ImpactAreaCard>
            <FaTree size={30} color="#34c759" />
            <h3>{t('ecoConservationTitle')}</h3>
            <p>{t('ecoConservationDesc')}</p>
          </ImpactAreaCard>
        </ImpactAreasGrid>
      </ImpactAreasSection>

      <ImpactSection>
        <ImpactCard>
          <ImpactTitle>{t('kenyaIrrigationTitle')}</ImpactTitle>
          <ImpactText>{t('kenyaIrrigationText')}</ImpactText>
        </ImpactCard>
        <ImpactCard>
          <ImpactTitle>{t('sahelResilienceTitle')}</ImpactTitle>
          <ImpactText>{t('sahelResilienceText')}</ImpactText>
        </ImpactCard>
        <ImpactCard>
          <ImpactTitle>{t('healthDeliveryTitle')}</ImpactTitle>
          <ImpactText>{t('healthDeliveryText')}</ImpactText>
        </ImpactCard>
      </ImpactSection>

      <SliderSection>
        <EffectTitle>{t('featuredInitiatives')}</EffectTitle>
        <Slider {...sliderSettings}>
          <div><img src="https://via.placeholder.com/400x300?text=Climate+Adaptation" alt={t('climateAdaptation')} /></div>
          <div><img src="https://via.placeholder.com/400x300?text=Water+Management" alt={t('waterManagement')} /></div>
          <div><img src="https://via.placeholder.com/400x300?text=Health+Supply" alt={t('healthSupply')} /></div>
          <div><img src="https://via.placeholder.com/400x300?text=Eco+Conservation" alt={t('ecoConservation')} /></div>
        </Slider>
      </SliderSection>

      <CTABanner>
        <CTABannerTitle>{t('joinOurMission')}</CTABannerTitle>
        <CTABannerText>{t('joinOurMissionText')}</CTABannerText>
        <CTABannerButton to="/contact">{t('getInvolved')}</CTABannerButton>
      </CTABanner>

      <TestimonialsSection>
        <EffectTitle>{t('whatPeopleSay')}</EffectTitle>
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard key={index}>
            <FaQuoteLeft size={30} color="#2c6e9c" style={{ marginBottom: '1rem' }} />
            <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
            <TestimonialAuthor>- {testimonial.author}</TestimonialAuthor>
          </TestimonialCard>
        ))}
      </TestimonialsSection>

      <NewsSection>
        <EffectTitle><FaNewspaper color="#2c6e9c" /> {t('recentNews')}</EffectTitle>
        <NewsGrid>
          {newsData.map((news) => (
            <NewsCard key={news.id}>
              <NewsTitle>{news.title}</NewsTitle>
              <NewsExcerpt>{news.excerpt}</NewsExcerpt>
              <NewsLink to="/news">{t('readMore')}</NewsLink>
            </NewsCard>
          ))}
        </NewsGrid>
      </NewsSection>

      <MapSection>
        <EffectTitle><FaMapMarkedAlt color="#2c6e9c" /> {t('ourGlobalReach')}</EffectTitle>
        <MapContainerStyled center={[0, 0]} zoom={2} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {projectLocations.map((location, index) => (
            <Marker key={index} position={location.position}>
              <Popup>
                <strong>{location.name}</strong><br />
                {location.description}
              </Popup>
            </Marker>
          ))}
        </MapContainerStyled>
      </MapSection>

      <GoalsSection>
        <EffectTitle><FaSeedling color="#34c759" /> {t('sustainabilityGoals')}</EffectTitle>
        <GoalsGrid>
          {goalsData.map((goal, index) => (
            <GoalCard key={index}>
              <GoalCircle progress={goal.progress}>
                <GoalInnerCircle>{goal.progress}%</GoalInnerCircle>
              </GoalCircle>
              <GoalTitle>{goal.title}</GoalTitle>
              <GoalText>{goal.text}</GoalText>
            </GoalCard>
          ))}
        </GoalsGrid>
      </GoalsSection>

      <TimelineSection ref={refTimeline}>
        <EffectTitle>{t('ourJourney')}</EffectTitle>
        <Timeline>
          {timelineData.map((item, index) => (
            <TimelineItem key={index} className={inViewTimeline ? 'visible' : ''}>
              <TimelineIcon><FaGlobeAfrica /></TimelineIcon>
              <TimelineContent>
                <h3>{item.year}</h3>
                <p>{t(`timelineEvent${index + 1}`)}</p>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </TimelineSection>
    </HomeSection>
  );
};

export default Home;