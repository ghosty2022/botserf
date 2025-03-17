import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { FaNewspaper, FaFilter, FaShareAlt, FaEye, FaTimes, FaHandsHelping, FaLeaf } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // Added missing import

const NewsSection = styled.section`
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #e9f1f9 0%, #f7fafc 100%);
  min-height: 100vh;
`;

const NewsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Hero = styled(motion.div)`
  background: linear-gradient(145deg, rgba(44, 110, 156, 0.9), rgba(26, 60, 94, 0.9)), url('https://via.placeholder.com/1400x300?text=Botserf+News') center/cover no-repeat;
  color: #fff;
  padding: 5rem 2rem;
  border-radius: 30px;
  text-align: center;
  margin-bottom: 4rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    padding: 3rem 1rem;
    border-radius: 20px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.4rem;
  font-weight: 300;
  margin: 0;
  opacity: 0.9;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FilterSection = styled.div`
  margin: 3rem 0;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button`
  background: ${props => (props.active ? '#2c6e9c' : '#ffffff')};
  color: ${props => (props.active ? '#fff' : '#2c6e9c')};
  padding: 0.8rem 1.8rem;
  border: 2px solid #2c6e9c;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    background: #2c6e9c;
    color: #fff;
    transform: translateY(-2px);
  }
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin: 4rem 0;
`;

const ArticleCard = styled(motion.div)`
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ArticleIcon = styled.div`
  font-size: 3rem;
  color: #2c6e9c;
  margin-bottom: 1.5rem;
`;

const ArticleTitle = styled.h3`
  color: #1a3c5e;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ArticleExcerpt = styled.p`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const ArticleDate = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-style: italic;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const CTAButton = styled.button`
  background: linear-gradient(90deg, #2c6e9c, #1a3c5e);
  color: #fff;
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #1a3c5e, #2c6e9c);
    transform: scale(1.05);
  }
`;

const Modal = styled(motion.div)`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 25px;
  max-width: 700px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #1a3c5e;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #2c6e9c;
  }
`;

const ModalTitle = styled.h2`
  color: #1a3c5e;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ModalText = styled.p`
  color: #333;
  font-size: 1.2rem;
  line-height: 1.8;
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
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fullContent: doc.data().fullContent || t('defaultNewsContent', { excerpt: doc.data().excerpt })
        }));
        setArticles(articlesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error.message);
        toast.error('Failed to load news.');
        setLoading(false);
      }
    };
    fetchArticles();
  }, [t]);

  const handleShare = (title) => {
    navigator.share({ title, url: window.location.href });
  };

  const openModal = (article) => setModalArticle(article);
  const closeModal = () => setModalArticle(null);

  const filteredArticles = filter === 'all' ? articles : articles.filter(article => article.category === filter);

  const articleIcons = {
    "Updates": <FaNewspaper />,
    "Partnerships": <FaHandsHelping />,
    "Awards": <FaLeaf />,
  };

  return (
    <NewsSection>
      <Helmet>
        <title>{t('newsTitle')}</title>
        <meta name="description" content={t('newsDescription')} />
      </Helmet>

      <NewsContainer>
        <Hero initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <HeroTitle><FaNewspaper color="#fff" /> {t('news')}</HeroTitle>
          <HeroSubtitle>{t('newsSubtitle')}</HeroSubtitle>
        </Hero>

        <FilterSection>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}><FaFilter /> {t('all')}</FilterButton>
          <FilterButton active={filter === 'Updates'} onClick={() => setFilter('Updates')}><FaNewspaper /> {t('updates')}</FilterButton>
          <FilterButton active={filter === 'Partnerships'} onClick={() => setFilter('Partnerships')}><FaHandsHelping /> {t('partnerships')}</FilterButton>
          <FilterButton active={filter === 'Awards'} onClick={() => setFilter('Awards')}><FaLeaf /> {t('awards')}</FilterButton>
        </FilterSection>

        {loading ? (
          <ClipLoader color="#2c6e9c" loading={loading} size={60} style={{ display: 'block', margin: '4rem auto' }} />
        ) : (
          <ArticleGrid ref={refCards}>
            {filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                className={inViewCards ? 'visible' : ''}
                initial={{ opacity: 0, y: 20 }}
                animate={inViewCards ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ArticleIcon>{articleIcons[article.category] || <FaNewspaper />}</ArticleIcon>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                <img src={article.image} alt={article.title} style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '1.5rem' }} />
                <ArticleDate><small>{article.date}</small></ArticleDate>
                <CTAButtons>
                  <CTAButton onClick={() => openModal(article)}><FaEye /> {t('readMore')}</CTAButton>
                  <CTAButton onClick={() => handleShare(article.title)}><FaShareAlt /> {t('share')}</CTAButton>
                </CTAButtons>
              </ArticleCard>
            ))}
          </ArticleGrid>
        )}

        <Modal isOpen={!!modalArticle} onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {modalArticle && (
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalClose onClick={closeModal}><FaTimes /></ModalClose>
              <ModalTitle>{modalArticle.title}</ModalTitle>
              <ArticleIcon>{articleIcons[modalArticle.category] || <FaNewspaper />}</ArticleIcon>
              <ModalText>{modalArticle.fullContent}</ModalText>
              <img src={modalArticle.image} alt={modalArticle.title} style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '1.5rem' }} />
              <ArticleDate><small>{modalArticle.date}</small></ArticleDate>
            </ModalContent>
          )}
        </Modal>
      </NewsContainer>
    </NewsSection>
  );
};

export default News;