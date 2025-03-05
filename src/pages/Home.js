import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaLeaf, FaWater, FaGlobeAfrica, FaHandsHelping, FaTree, FaEye, FaCloud } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
  position: relative;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1400x500?text=Botserf+Sustainability') center/cover no-repeat;
  color: #fff;
  padding: 6rem 2rem;
  border-radius: 30px;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin: 0 0 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin: 0 0 2rem;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroCTA = styled(Link)`
  display: inline-block;
  background: linear-gradient(90deg, #ffd700, #ffcc00);
  color: #1a3c5e;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin: 3rem auto;
  max-width: 1200px;
`;

const StatCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #1a3c5e;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ChartSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const ImpactAreasSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  background: linear-gradient(135deg, #fff, #f4f7fa);
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ImpactAreasTitle = styled.h2`
  font-size: 2rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
`;

const ImpactAreasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ImpactAreaCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImpactSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ImpactCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImpactTitle = styled.h3`
  color: #1a3c5e;
  margin-bottom: 1rem;
`;

const ImpactText = styled.p`
  color: #333;
  font-size: 1.1rem;
`;

const SliderSection = styled.div`
  margin: 3rem auto;
  max-width: 1200px;
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
  margin: 3rem auto;
  max-width: 1200px;
  padding: 2rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const Timeline = styled.div`
  position: relative;
  padding: 2rem 0;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
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
  }
`;

const TimelineIcon = styled.div`
  background: #2c6e9c;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const Home = () => {
  const { t } = useTranslation();
  const [refStats, inViewStats] = useInView({ triggerOnce: true });
  const [refTimeline, inViewTimeline] = useInView({ threshold: 0.2 });

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
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  const timelineData = [
    { year: '2015', event: 'Botserf founded with a focus on Earth Systems Sciences.' },
    { year: '2018', event: 'Expanded into health supply solutions.' },
    { year: '2020', event: 'Launched first climate adaptation project in Kenya.' },
    { year: '2023', event: 'Achieved 150+ sustainable projects globally.' },
  ];

  return (
    <HomeSection>
      <Helmet>
        <title>Botserf PTY LTD - Home</title>
        <meta name="description" content="Welcome to Botserf PTY LTD, your partner in sustainable solutions." />
      </Helmet>

      <Hero>
        <HeroTitle>{t('welcome', { company: 'Botserf PTY LTD' })}</HeroTitle>
        <HeroSubtitle>Harnessing Earth Systems Science for a sustainable future.</HeroSubtitle>
        <HeroCTA to="/services"><FaEye /> Explore Our Solutions</HeroCTA>
      </Hero>

      <StatsSection ref={refStats}>
        <StatCard>
          <FaLeaf size={50} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 150 : 0} duration={2.5} />+</h3>
          <p>Projects Completed</p>
        </StatCard>
        <StatCard>
          <FaWater size={50} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 200 : 0} duration={2.5} />+</h3>
          <p>Clients Served</p>
        </StatCard>
        <StatCard>
          <FaGlobeAfrica size={50} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 10 : 0} duration={2.5} />+</h3>
          <p>Years Impacting</p>
        </StatCard>
        <StatCard>
          <FaHandsHelping size={50} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 500 : 0} duration={2.5} />+</h3>
          <p>Communities Helped</p>
        </StatCard>
        <StatCard>
          <FaTree size={50} color="#2c6e9c" />
          <h3><CountUp start={0} end={inViewStats ? 1000 : 0} duration={2.5} />+</h3>
          <p>Trees Planted</p>
        </StatCard>
      </StatsSection>

      <ChartSection>
        <h2>Our Impact Over Time</h2>
        <BarChart width={800} height={400} data={impactData} style={{ margin: '0 auto' }}>
          <XAxis dataKey="year" stroke="#1a3c5e" />
          <YAxis stroke="#1a3c5e" />
          <Tooltip wrapperStyle={{ background: '#fff', borderRadius: '5px' }} />
          <Legend />
          <Bar dataKey="impact" fill="#2c6e9c" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ChartSection>

      <ChartSection>
        <h2>Impact by Category</h2>
        <PieChart width={400} height={400} style={{ margin: '0 auto' }}>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ChartSection>

      <ImpactAreasSection>
        <ImpactAreasTitle><FaCloud /> Our Impact Areas</ImpactAreasTitle>
        <ImpactAreasGrid>
          <ImpactAreaCard>
            <FaLeaf size={40} color="#2c6e9c" />
            <h3>Climate Resilience</h3>
            <p>Developing strategies to adapt to changing climates, protecting vulnerable ecosystems.</p>
          </ImpactAreaCard>
          <ImpactAreaCard>
            <FaWater size={40} color="#2c6e9c" />
            <h3>Water Sustainability</h3>
            <p>Optimizing water resources for agriculture and communities in arid regions.</p>
          </ImpactAreaCard>
          <ImpactAreaCard>
            <FaHandsHelping size={40} color="#2c6e9c" />
            <h3>Health Solutions</h3>
            <p>Revolutionizing supply chains to deliver critical health resources efficiently.</p>
          </ImpactAreaCard>
          <ImpactAreaCard>
            <FaTree size={40} color="#2c6e9c" />
            <h3>Eco Conservation</h3>
            <p>Preserving biodiversity through innovative ecological assessments.</p>
          </ImpactAreaCard>
        </ImpactAreasGrid>
      </ImpactAreasSection>

      <ImpactSection>
        <ImpactCard>
          <ImpactTitle>Kenya Irrigation</ImpactTitle>
          <ImpactText>Implemented precision irrigation in arid regions, increasing crop yields by 30% in 2023.</ImpactText>
        </ImpactCard>
        <ImpactCard>
          <ImpactTitle>Sahel Resilience</ImpactTitle>
          <ImpactText>Built water retention systems, supporting 50+ communities in 2024.</ImpactText>
        </ImpactCard>
        <ImpactCard>
          <ImpactTitle>Health Delivery</ImpactTitle>
          <ImpactText>Optimized supply chains, delivering aid to 10,000+ people during crises.</ImpactText>
        </ImpactCard>
      </ImpactSection>

      <SliderSection>
        <h2>Featured Initiatives</h2>
        <Slider {...sliderSettings}>
          <div><img src="https://via.placeholder.com/400x300?text=Climate+Adaptation" alt="Climate Adaptation" /></div>
          <div><img src="https://via.placeholder.com/400x300?text=Water+Management" alt="Water Management" /></div>
          <div><img src="https://via.placeholder.com/400x300?text=Health+Supply" alt="Health Supply" /></div>
          <div><img src="https://via.placeholder.com/400x300?text=Eco+Conservation" alt="Eco Conservation" /></div>
        </Slider>
      </SliderSection>

      <TimelineSection ref={refTimeline}>
        <h2>Our Journey</h2>
        <Timeline>
          {timelineData.map((item, index) => (
            <TimelineItem key={index} className={inViewTimeline ? 'visible' : ''}>
              <TimelineIcon><FaGlobeAfrica /></TimelineIcon>
              <TimelineContent>
                <h3>{item.year}</h3>
                <p>{item.event}</p>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </TimelineSection>
    </HomeSection>
  );
};

export default Home;