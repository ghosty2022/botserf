import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { FaNewspaper, FaFilter, FaShareAlt, FaEye, FaTimes, FaHandsHelping, FaLeaf } from 'react-icons/fa'; // Added FaHandsHelping, FaLeaf
import { useInView } from 'react-intersection-observer';

const NewsSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8eef5 100%);
  overflow: hidden;
`;

const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://via.placeholder.com/1400x300?text=Botserf+News') center/cover no-repeat;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ArticleCard = styled.div`
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

const ArticleIcon = styled.div`
  font-size: 2.5rem;
  color: #2c6e9c;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h3`
  color: #1a3c5e;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ArticleExcerpt = styled.p`
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ArticleDate = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
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

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalArticle, setModalArticle] = useState(null);
  const { t } = useTranslation();
  const [refCards, inViewCards] = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchArticles = async () => {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const articlesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fullContent: doc.data().fullContent || `${doc.data().excerpt} Read more about this update from Botserf PTY LTD, showcasing our latest efforts in sustainability and innovation.`
      }));
      setArticles(articlesData);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const handleShare = (title) => {
    navigator.share({ title, url: window.location.href });
  };

  const openModal = (article) => {
    setModalArticle(article);
  };

  const closeModal = () => {
    setModalArticle(null);
  };

  const filteredArticles = filter === 'all' ? articles : articles.filter(article => article.category === filter);

  return (
    <NewsSection>
      <Helmet>
        <title>News - Botserf PTY LTD</title>
        <meta name="description" content="Latest news from Botserf PTY LTD." />
      </Helmet>

      <NewsContainer>
        <Hero>
          <HeroTitle><FaNewspaper color="#fff" /> {t('news')}</HeroTitle>
          <HeroSubtitle>Stay updated with Botserf’s latest achievements and insights.</HeroSubtitle>
        </Hero>

        <FilterSection>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}><FaFilter /> All</FilterButton>
          <FilterButton active={filter === 'Updates'} onClick={() => setFilter('Updates')}><FaNewspaper /> Updates</FilterButton>
          <FilterButton active={filter === 'Partnerships'} onClick={() => setFilter('Partnerships')}><FaHandsHelping /> Partnerships</FilterButton>
          <FilterButton active={filter === 'Awards'} onClick={() => setFilter('Awards')}><FaLeaf /> Awards</FilterButton>
        </FilterSection>

        {loading ? (
          <ClipLoader color="#2c6e9c" loading={loading} size={50} style={{ display: 'block', margin: '0 auto' }} />
        ) : (
          <ArticleGrid ref={refCards}>
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} className={inViewCards ? 'visible' : ''}>
                <ArticleIcon><FaNewspaper /></ArticleIcon>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                <img src={article.image} alt={article.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
                <ArticleDate><small>{article.date}</small></ArticleDate>
                <CTAButtons>
                  <CTAButton onClick={() => openModal(article)}><FaEye /> Read More</CTAButton>
                  <CTAButton onClick={() => handleShare(article.title)}><FaShareAlt /> Share</CTAButton>
                </CTAButtons>
              </ArticleCard>
            ))}
          </ArticleGrid>
        )}

        <Modal isOpen={!!modalArticle} onClick={closeModal}>
          {modalArticle && (
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalClose onClick={closeModal}><FaTimes /></ModalClose>
              <ModalTitle>{modalArticle.title}</ModalTitle>
              <ArticleIcon><FaNewspaper /></ArticleIcon>
              <ModalText>{modalArticle.fullContent}</ModalText>
              <img src={modalArticle.image} alt={modalArticle.title} style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }} />
              <ArticleDate><small>{modalArticle.date}</small></ArticleDate>
            </ModalContent>
          )}
        </Modal>
      </NewsContainer>
    </NewsSection>
  );
};

export default News;